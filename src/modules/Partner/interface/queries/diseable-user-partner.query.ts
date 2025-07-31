import { BaseQuery, QueryProps, BaseQueryHandler } from "@/core/base/classes";
import { DiseableUserQueryHandler } from "@/modules/auth/interface/queries";

export class DiseableUserPartnerQuery extends BaseQuery {
  id: string;
  isActive?: boolean;
  constructor(props: QueryProps<DiseableUserPartnerQuery>) {
    super(props);
    this.id = props.id;
    this.isActive = props.isActive;
  }
}

export class DiseableUserPartnerQueryHandler extends DiseableUserQueryHandler {}