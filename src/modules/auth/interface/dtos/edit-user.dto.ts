import type { UserRoleEnumWithoutAdmin } from "@/core/enums/enums";
import { t } from "elysia";

export const EditUserDto = t.Object({
    first_name: t.Optional(t.String()),
    last_name: t.Optional(t.String()),
    role: t.Optional(t.String()),
    email: t.Optional(t.String({ format: "email" })),
    phone_number: t.Optional(t.String({ minLength: 10, maxLength: 10 })),
    password: t.Optional(t.String({ minLength: 8 })),
  });