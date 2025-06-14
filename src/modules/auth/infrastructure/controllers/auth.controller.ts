import Elysia from "elysia";
import { CommandMediator, cqrs, QueryMediator } from "elysia-cqrs";
import { RedisPlugin } from "@/modules/config";
import {
  CreateUserCommand,
  CreateUserCommandHandler,
  LoginCommand,
  LoginCommandHandler,
  ConfirmOtpCommand,
  ConfirmOtpCommandHandler,
  GenerateAuthTokenCommand,
  GenerateAuthTokenCommandHandler,
  GenerateAuthTokenCommandResult,
} from "@/modules/auth/interface/commands";
import { ConfirmOtpDto, CreateUserDto, EditUserDto, LoginDto } from "@/modules/auth/interface/dtos";
import { routes } from "@/modules/auth/routes";
import { User } from "@/modules/auth/infrastructure/entities";
import {
  UserResponse,
  UserResponseSchema,
  UserTokenResponse,
  UserTokenResponseSchema,
} from "@/modules/auth/interface/user-http.response";
import { BaseError } from "@/core/base/errors";
import { AuthJWT, AuthRoutesPlugin } from "@/modules/auth/plugins";
import { EditUserCommand, EditUserCommandHandler } from "@/modules/auth/interface/commands/edit-user.command";

export const AuthController = new Elysia()
  .use(RedisPlugin)
  .use(AuthJWT)
  .use(({ decorator }) => {
    const jwt = decorator.jwt;
    const redis = decorator.redis;
    return cqrs({
      commands: [
        [CreateUserCommand, new CreateUserCommandHandler()],
        [EditUserCommand, new EditUserCommandHandler()],
        [LoginCommand, new LoginCommandHandler(redis)],
        [ConfirmOtpCommand, new ConfirmOtpCommandHandler(redis)],
        [GenerateAuthTokenCommand, new GenerateAuthTokenCommandHandler(jwt)],
      ],
    });
  })
  .post(
    routes.user_sign_in,
    async ({ body, commandMediator }: { body: any; commandMediator: CommandMediator }) => {
      const result: User = await commandMediator.send(
        new CreateUserCommand({
          ...body,
          role: undefined,
        })
      );
      return new UserResponse(result);
    },
    {
      body: CreateUserDto,
      response: UserResponseSchema,
      detail: {
        summary: "Sign in - Create new User",
        tags: ["Auth"],
      },
    }
  )
  .post(
    routes.login,
    async ({ body, commandMediator, set }: { body: any; commandMediator: CommandMediator; set: any }) => {
      const result: User = await commandMediator.send(
        new LoginCommand({
          ...body,
        })
      );

      set.status = result ? 200 : 500;

      return "";
    },
    {
      body: LoginDto,
      detail: {
        summary: "Login in",
        description: "Logs in user and send a otp (60s TTL) to his phone number.",
        tags: ["Auth"],
      },
    }
  )
  .post(
    routes.confirm_otp,
    async ({ body, commandMediator }: { body: any; commandMediator: CommandMediator }) => {
      const result: User = await commandMediator.send(
        new ConfirmOtpCommand({
          ...body,
        })
      );

      if (!result) {
        throw new BaseError({
          statusCode: 500,
          message: "error validating otp",
        });
      }

      const { token, user } : GenerateAuthTokenCommandResult = await commandMediator.send(
        new GenerateAuthTokenCommand({
          ...body,
        })
      );

      return new UserTokenResponse({ token, user });
    },
    {
      body: ConfirmOtpDto,
      // response: UserTokenResponseSchema,
      detail: {
        summary: "Confirm OTP",
        description: "Use this API to confirm received OTP and retrieve a jwt token.",
        tags: ["Auth"],
      },
    }
  )
  .use(AuthRoutesPlugin)
  .put(
    routes.root,
    async ({ user, body, commandMediator }: { user: User; body: any; commandMediator: CommandMediator }) => {
      const result: User = await commandMediator.send(
        new EditUserCommand({
          ...body,
          id: user.id,
        })
      );

      return () => new UserResponse({ ...result, id: user.id });
    },
    {
      body: EditUserDto,
      detail: {
        summary: "Edit User",
        description: "Use this API to edit your account.",
        tags: ["Auth"],
      },
    }
  );
