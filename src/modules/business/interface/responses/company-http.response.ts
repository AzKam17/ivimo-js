import { Company } from "@/modules/business/infrastructure/entities";
import { t } from "elysia";

export const CompanyResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  address: t.Optional(t.String()),
  description: t.Optional(t.String()),
  created_by: t.String(),
  created_at: t.Optional(t.String()),
  updated_at: t.String(),
});

interface CompanyResponseProps {
  id: string;
  name: string;
  address?: string;
  description?: string;
  owned_by: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export class CompanyResponse {
  constructor(props: Company) {

    const response: CompanyResponseProps = {
      id: props.id,
      name: props.name,
      address: props.address ?? "",
      description: props.description ?? "",
      created_by: props.createdBy,
      owned_by: props.ownedBy,
      created_at: props.createdAt.toISOString(),
      updated_at: props.updatedAt.toISOString(),
    };
    return response;
  }
}
