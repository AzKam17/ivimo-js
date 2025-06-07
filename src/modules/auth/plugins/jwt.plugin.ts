import { Elysia } from "elysia";
import jwt from "@elysiajs/jwt";

export const AuthJWT = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: Bun.env.JWT_SECRET!,
    })
  )
  .as("scoped");