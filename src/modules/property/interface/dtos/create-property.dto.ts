import { PropertyAdTypeEnum } from "@/core/enums/enums";
import { ExtrasTransform, GeolocationTransform, GeometrySchema } from "@/core/interface";
import { t } from "elysia";

export const CreatePropertyDto = t.Object({
  name: t.String(),
  price: t.Numeric(),
  ad_type: t.Enum(PropertyAdTypeEnum),
  type: t.String(),
  geolocation: GeolocationTransform,
  description: t.Optional(t.String()),
  address: t.Optional(t.String()),
  main_image: t.File({ type: "image/*" }),
  images: t.Optional(t.Array(t.File({ type: "image" }))),
  extras: ExtrasTransform,
  createdBy: t.Optional(t.String()),
});