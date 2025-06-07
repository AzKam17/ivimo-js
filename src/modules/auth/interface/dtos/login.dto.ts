import { t } from "elysia";

export const LoginDto = t.Object({
    email: t.String({ format: "email" }),
    password: t.String(),
  });