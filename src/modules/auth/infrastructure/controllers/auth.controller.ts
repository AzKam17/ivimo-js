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
} from "@/modules/auth/interface/commands";
import { ConfirmOtpDto, CreateUserDto, LoginDto } from "@/modules/auth/interface/dtos";
import { routes } from "@/modules/auth/routes";
import { User } from "@/modules/auth/infrastructure/entities";
import {
  UserResponse,
  UserResponseSchema,
  UserTokenResponse,
  UserTokenResponseSchema,
} from "@/modules/auth/interface/user-http.response";
import { BaseError } from "@/core/base/errors";
import { AuthJWT } from "@/modules/auth/plugins";

export const AuthController = new Elysia()
  .use(RedisPlugin)
  .use(AuthJWT)
  .use(({ decorator }) => {
    const jwt = decorator.jwt;
    const redis = decorator.redis;
    return cqrs({
      commands: [
        [CreateUserCommand, new CreateUserCommandHandler()],
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
        })
      );
      return new UserResponse(result);
    },
    {
      body: CreateUserDto,
      response: UserResponseSchema,
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

      const token = await commandMediator.send(
        new GenerateAuthTokenCommand({
          ...body,
        })
      );

      return new UserTokenResponse({ token });
    },
    {
      body: ConfirmOtpDto,
      response: UserTokenResponseSchema,
    }
  );
