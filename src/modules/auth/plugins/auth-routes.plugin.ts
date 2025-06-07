import { Elysia } from "elysia";
import jwt from "@elysiajs/jwt";
import { AuthJWT } from "@/modules/auth/plugins/jwt.plugin";
import { Guard } from "@/core/utils";
import { BaseError } from "@/core/base/errors";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { User } from "@/modules/auth/infrastructure/entities";

const eject = () => {
  throw new BaseError({
    statusCode: 401,
    message: "Unauthorized",
  });
};

export const AuthRoutesPlugin = new Elysia()
  .use(AuthJWT)
  .derive(async ({ jwt, headers }) => {
    if (Guard.isEmpty(headers.authorization) || !headers.authorization!.startsWith("Bearer")) {
      eject();
    }

    const token = headers.authorization!.split(" ")[1];
    if (Guard.isEmpty(token)) eject();

    const decoded = await jwt.verify(token);
    if (Guard.isEmpty(decoded) || !decoded) eject();

    const payload = decoded as Record<string, string | number>;
    const userId = payload.sub as string;

    const repository = UserRepository.getInstance();
    const user = await repository.findById(userId);
    if (!user) eject();

    return {user : user as User };
  })
  .as("scoped");
