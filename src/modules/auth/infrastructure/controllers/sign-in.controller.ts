import Elysia from "elysia";
import { CommandMediator, cqrs, QueryMediator } from "elysia-cqrs";
import { RedisPlugin } from "@/modules/config";
import { CreateUserCommand, CreateUserCommandHandler } from "@/modules/auth/interface/commands";
import { CreateUserDto } from "@/modules/auth/interface/dtos";
import { routes } from "@/modules/auth/routes";
import { User } from "@/modules/auth/infrastructure/entities";
import { UserResponse, UserResponseSchema } from "@/modules/auth/interface/user-http.response";

export const SignInController = new Elysia()
  .use(RedisPlugin)
  .use(({ decorator }) => {
    return cqrs({
      commands: [[CreateUserCommand, new CreateUserCommandHandler(decorator.redis)]],
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
      response: UserResponseSchema
    }
  );
