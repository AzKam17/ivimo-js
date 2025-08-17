import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { BillingMethod } from "@/modules/billing/infrastructure/entities";
import { BillingMethodRepository } from "@/modules/billing/infrastructure/repositories";

export class GetBillingMethodsQuery extends BaseQuery {
  id?: any;
  constructor(props: QueryProps<GetBillingMethodsQuery>) {
    super(props);
    this.id = props.id;
  }
}

export class GetBillingMethodsQueryHandler extends BaseQueryHandler<GetBillingMethodsQuery, BillingMethod[]> {
  async execute(_query: GetBillingMethodsQuery): Promise<BillingMethod[]> {
    const repository = BillingMethodRepository.getInstance();
    return await repository.findAll();
  }
}