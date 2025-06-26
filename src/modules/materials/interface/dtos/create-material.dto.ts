import { t } from "elysia";

export const CreateMaterialDto = t.Object({
  name: t.String(),
  price: t.Number(),
  description: t.Optional(t.String()),
  has_stock: t.Optional(t.Boolean()),
  quantity_in_stock: t.Optional(t.Number()),
  images: t.Optional(t.Array(t.String())),
  category_slug: t.String(),
  extras: t.Optional(t.Record(t.String(), t.Any()))
});