import { t } from "elysia";

export const EditUserPartnerDto = t.Object({
    first_name: t.Optional(t.String()),
    last_name: t.Optional(t.String()),
    role: t.Optional(t.String()),
    email: t.Optional(t.String({ format: "email" })),
    extras: t.Object({
      business_id: t.Optional(t.String())
    }),
    phone_number: t.Optional(t.String({ minLength: 10, maxLength: 10 })),
    password: t.Optional(t.String({ minLength: 8 })),
  });