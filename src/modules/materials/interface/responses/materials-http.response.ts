import { t } from "elysia";

export const MaterialsResponsePropsResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  price: t.Number(),
  description: t.Optional(t.String()),
  has_stock: t.Optional(t.Boolean()),
  quantity_in_stock: t.Optional(t.Number()),
  images: t.Array(t.String()),
  supplier_id: t.String(),
  category_slug: t.String(),
  extras: t.Record(t.String(), t.Any()),
});

export interface MaterialsResponseProps {
  id: string;
  name: string;
  price: number;
  description?: string;
  has_stock?: boolean;
  quantity_in_stock?: number;
  images?: string[];
  supplier_id: string;
  category_slug: string;
  extras: Record<string, any>;
}

export class MaterialsResponse {
  constructor(props: MaterialsResponseProps) {
    return {
        id: props.id,
        name: props.name,
        price: props.price,
        description: props.description || "",
        has_stock: props.has_stock,
        quantity_in_stock: props.quantity_in_stock,
        images: props.images || [],
        supplier_id: props.supplier_id,
        category_slug: props.category_slug,
        extras: props.extras,
    };
  }
}
