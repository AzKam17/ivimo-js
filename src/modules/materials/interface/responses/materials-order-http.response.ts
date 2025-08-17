import { t } from "elysia";
import { MaterialsOrderItem } from "@/modules/materials/infrastructure/entities/materials-order.orm-entity";
import { MaterialOrderStatus } from "@/core/enums/enums";

export const MaterialsOrderResponsePropsSchema = t.Object({
  id: t.String(),
  clientName: t.Optional(t.String()),
  slug: t.String(),
  amount: t.Number(),
  items: t.Array(
    t.Object({
      materialId: t.String(),
      amount: t.Number(),
      quantity: t.Number()
    })
  ),
  status: t.String(),
  supplier_id: t.String(),
  extras: t.Record(t.String(), t.Any()),
  created_at: t.Optional(t.String()),
  updated_at: t.Optional(t.String())
});

export interface MaterialsOrderResponseProps {
  id: string;
  clientName?: string;
  slug: string;
  amount: number;
  items: MaterialsOrderItem[];
  status: string;
  supplier_id: string;
  extras: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export class MaterialsOrderResponse {
  constructor(props: MaterialsOrderResponseProps) {
    return {
      id: props.id,
      clientName: props.clientName || "",
      slug: props.slug,
      amount: props.amount,
      items: props.items || [],
      status: props.status,
      supplier_id: props.supplier_id,
      extras: props.extras || {},
      created_at: props.created_at,
      updated_at: props.updated_at
    };
  }
}