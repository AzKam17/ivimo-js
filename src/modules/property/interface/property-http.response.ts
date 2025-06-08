import { PropertyAdTypeEnum } from "@/core/enums/enums";
import { Property } from "@/modules/property/infrastructure/entities";
import { t } from "elysia";

export const PropertyResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.String(),
  price: t.Number(),
  address: t.String(),
  ad_type: t.Enum(PropertyAdTypeEnum),
  type: t.String(),
  main_image: t.String(),
  images: t.Array(t.String()),
  geolocation: t.Object({
    type: t.String(),
    coordinates: t.Array(t.Number()),
  }),
  created_by: t.String(),
  created_at: t.String(),
  updated_at: t.String(),
});

interface PropertyResponseProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  address?: string;
  ad_type: PropertyAdTypeEnum;
  type: string;
  main_image?: string;
  images?: string[];
  geolocation?: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export class PropertyResponse {
  constructor(props: Property) {
    const defaultGeolocation = {
      type: "Point",
      coordinates: [0, 0],
    };

    const response: PropertyResponseProps = {
      id: props.id,
      name: props.name,
      description: props.description ?? "",
      price: props.price,
      address: props.address ?? "",
      ad_type: props.adType,
      type: props.type,
      main_image: props.mainImage ?? "",
      images: props.images ?? [],
      geolocation: props.geolocation ?? defaultGeolocation,
      created_by: props.createdBy,
      created_at: props.createdAt.toISOString(),
      updated_at: props.updatedAt.toISOString(),
    };
    return response;
  }
}
