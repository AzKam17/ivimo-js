import { Elysia } from "elysia";
import { User } from "./infrastructure/entities/user.orm-entity";
import { SignInController } from "./infrastructure/controllers/sign-in.controller";
import { UserRepository } from "./infrastructure/repositories/user.repository";

export const AuthRepositories = new Elysia({ name: "auth-repositories" })
  .decorate("userRepository", UserRepository)
;

export const AuthModule = new Elysia({ name: "auth", prefix: "api/v1/auth" })
  // .use(typeorm())
  .use(AuthRepositories)
  .use(SignInController)
  ;
