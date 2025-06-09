import { t } from "elysia";

export const LoginDto = t.Object({
  phone_number: t.String({ minLength: 10, maxLength: 10 }),
  password: t.String(),
});
