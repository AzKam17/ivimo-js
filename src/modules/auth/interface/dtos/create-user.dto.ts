import { t } from "elysia";

export const CreateUserDto = t.Object({
    first_name: t.String({}),
    last_name: t.String({}),
    email: t.String({ format: "email" }),
    phone_number: t.String({ minLength: 10, maxLength: 10 }),
    password: t.String({ minLength: 8 }),
  });