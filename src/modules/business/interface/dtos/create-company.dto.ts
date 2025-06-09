import { t } from "elysia";

export const CreateCompanyDto = t.Object({
  name: t.String(),
  address: t.Optional(t.String()),
  description: t.Optional(t.String()),
});
