import { t } from "elysia";

export const UpdateAnnouncementDto = t.Object({
  title: t.String(),
  description: t.Optional(t.String()),
  status: t.String(),
  type: t.String(),
  target: t.String(),
  price: t.Number(),
  expiryDate: t.Date(),
  propertyId: t.String()
});
