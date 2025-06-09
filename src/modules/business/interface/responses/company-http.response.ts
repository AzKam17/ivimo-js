import { Company } from "@/modules/business/infrastructure/entities";
import { t } from "elysia";

export const CompanyResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  address: t.Optional(t.String()),
  description: t.Optional(t.String())
});

export interface CompanyResponseProps {
  id: string;
  name: string;
  address?: string;
  description?: string;
}

export class CompanyResponse {
  id: string;
  constructor(props: Company) {
    const response: CompanyResponseProps = {
      id: props.id,
      name: props.name,
      address: props.address ?? "",
      description: props.description ?? ""
    } as CompanyResponseProps;

    return response;
  }
}
