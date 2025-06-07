import { Elysia } from "elysia";
import { SignInController } from "./infrastructure/controllers/sign-in.controller";
import { UserRepository } from "./infrastructure/repositories/user.repository";
import { ErrorPlugin, Errors } from "@/core/base/errors";

export const AuthRepositories = new Elysia({ name: "auth-repositories" }).decorate("userRepository", UserRepository);

export const AuthModule = new Elysia({ name: "auth-module", prefix: "api/v1/auth" })
  .use(AuthRepositories)
  .use(SignInController);
