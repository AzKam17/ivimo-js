import { Elysia } from "elysia";
import { AuthController } from "./infrastructure/controllers";
import { UserRepository } from "./infrastructure/repositories/user.repository";

export const AuthRepositories = new Elysia({ name: "auth-repositories" }).decorate("userRepository", UserRepository);

export const AuthModule = new Elysia({ name: "auth-module", prefix: "api/v1/auth" })
  .use(AuthRepositories)
  .use(AuthController);
