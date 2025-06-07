import { t } from "elysia";

export const ConfirmOtpDto = t.Object({
    email: t.String({ format: "email" }),
    code: t.String({}),
  });