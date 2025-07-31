import { BaseQuery, CommandProps } from "@/core/base/classes";
import { ActiveUserQueryHandler } from "@/modules/auth/interface/queries";


export class ActiveUserPartnerQuery extends BaseQuery {
  id: string;
  constructor(props: CommandProps<ActiveUserPartnerQuery>) {
    super(props);
    this.id = props.id;
  }
}

export class ActiveUserPartnerQueryHandler extends ActiveUserQueryHandler {
}