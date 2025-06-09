import { t } from "elysia";

export const ConfirmOtpDto = t.Object({
  phone_number: t.String({ minLength: 10, maxLength: 10 }),
  code: t.String({}),
});
