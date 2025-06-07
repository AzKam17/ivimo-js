import { Elysia } from "elysia";
import jwt from "@elysiajs/jwt";
import { AuthJWT } from "@/modules/auth/plugins/jwt.plugin";
import { Guard } from "@/core/utils";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { User } from "@/modules/auth/infrastructure/entities";

export const OptionalAuthPlugin = new Elysia()
  .use(AuthJWT)
  .derive(async ({ jwt, headers }) => {
    // Check if authorization header exists and has Bearer token
    if (Guard.isEmpty(headers.authorization) || !headers.authorization!.startsWith("Bearer")) {
      return { user: null };
    }

    const token = headers.authorization!.split(" ")[1];
    if (Guard.isEmpty(token)) {
      return { user: null };
    }

    try {
      const decoded = await jwt.verify(token);
      if (Guard.isEmpty(decoded) || !decoded) {
        return { user: null };
      }

      const payload = decoded as Record<string, string | number>;
      const userId = payload.sub as string;

      const repository = UserRepository.getInstance();
      const user = await repository.findById(userId);
      
      return { user: user as User | null };
    } catch (error) {
      return { user: null };
    }
  })
  .as("scoped");