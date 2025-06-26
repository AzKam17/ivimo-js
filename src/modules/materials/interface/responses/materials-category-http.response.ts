import { t } from "elysia";

export const MaterialsCategoryResponsePropsResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  slug: t.String(),
  string: t.String(),
  icon: t.String(),
  extras: t.Record(t.String(), t.Any()),
});

export interface MaterialsCategoryResponseProps {
  id: string;
  name: string;
  slug: string;
  image: string;
  icon: string;
  extras: Record<string, any>;
}

export class MaterialsCategoryResponse {
  constructor(props: MaterialsCategoryResponseProps) {
    return {
        id: props.id,
        name: props.name,
        slug: props.slug,
        image: props.image || "",
        icon: props.icon || "",
        extras: props.extras || {}
    };
  }
}
