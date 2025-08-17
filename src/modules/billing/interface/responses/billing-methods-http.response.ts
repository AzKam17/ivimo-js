import { BillingMethod } from "@/modules/billing/infrastructure/entities";
import { t } from "elysia";

export const BillingMethodsResponsePropsResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  slug: t.String(),
  image: t.Optional(t.String()),
  icon: t.Optional(t.String()),
  extras: t.Record(t.String(), t.Any()),
});

export class BillingMethodResponse {
  constructor(props: BillingMethod) {
    return {
        id: props.id,
        name: props.name,
        slug: props.slug,
        image: props.image || "",
        icon: props.icon || "",
        extras: props.extras,
    };
  }
}
