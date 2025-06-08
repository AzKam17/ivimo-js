import { PropertyAdTypeEnum } from "@/core/enums/enums";
import { GeometrySchema } from "@/core/interface";
import { t } from "elysia";

export const CreatePropertyDto = t.Object({
  name: t.String(),
  price: t.String(),
  ad_type: t.Enum(PropertyAdTypeEnum),
  type: t.String(),
  geolocation: GeometrySchema,
  description: t.Optional(t.String()),
  address: t.Optional(t.String()),
  main_image: t.File({ type: "image/*" }),
  images: t.Optional(t.Array(t.File({ type: "image" }))),
  extras: t.Optional(t.Record(t.String(), t.Any())),
  createdBy: t.Optional(t.String()),
});
