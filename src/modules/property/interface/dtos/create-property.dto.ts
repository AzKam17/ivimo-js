import { PropertyAdType } from "@/core/enums/enums";
import { t } from "elysia";

export const CreatePropertyDto = t.Object({
  name: t.String(),
  price: t.Number(),
  adType: t.Enum(PropertyAdType),
  type: t.String(),
  description: t.Optional(t.String()),
  address: t.Optional(t.String()),
  mainImage: t.File({ type: "image" }),
  images: t.Optional(t.Array(t.File({ type: "image" }))),
  extras: t.Optional(t.Record(t.String(), t.Any())),
  createdBy: t.Optional(t.String()),
});
