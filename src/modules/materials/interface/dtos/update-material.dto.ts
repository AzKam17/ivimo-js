import { t } from "elysia";

export const UpdateMaterialDto = t.Object({
  name: t.Optional(t.String()),
  price: t.Optional(t.Number()),
  description: t.Optional(t.String()),
  has_stock: t.Optional(t.Boolean()),
  quantity_in_stock: t.Optional(t.Number()),
  images: t.Optional(t.Array(t.String())),
  category_slug: t.Optional(t.String()),
  extras: t.Optional(t.Record(t.String(), t.Any()))
});