import { PropertyAdTypeEnum } from "@/core/enums/enums";
import { Property } from "@/modules/property/infrastructure/entities";
import { t } from "elysia";

export const PropertyResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.Optional(t.String()),
  price: t.Number(),
  address: t.Optional(t.String()),
  ad_type: t.String(),
  type: t.String(),
  views: t.Number(),
  main_image: t.Optional(t.String()),
  images: t.Optional(t.Array(t.String())),
  geolocation: t.Optional(t.Object({
    type: t.String(),
    coordinates: t.Array(t.Number()),
  })),
  created_by: t.Optional(t.String()),
  owned_by: t.Optional(t.String()),
  created_at: t.Optional(t.String()),
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
  views: number;
  main_image?: string;
  images?: string[];
  geolocation?: any;
  created_by?: string;
  owned_by?: string;
  created_at: string;
  updated_at: string;
  companyId: string;
  is_bookmarked?: boolean;
  extras: any
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
      views: props.views,
      main_image: props.mainImage ?? "",
      images: props.images ?? [],
      geolocation: props.geolocation ?? defaultGeolocation,
      created_by: props.createdBy,
      owned_by: props.ownedBy,
      extras: {
        ...props.extras,
        bookmarks: null
      },
      created_at: props.createdAt.toISOString(),
      updated_at: props.updatedAt.toISOString(),
      companyId: props.companyId  ?? ""
    };
    return response;
  }
}
