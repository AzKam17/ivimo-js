import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { Property } from "@/modules/property/infrastructure/entities";
import { PaginatedResponse } from "@/core/base/responses";
import { PropertyRepository } from "../../infrastructure/repositories";

export class ListPropertyQuery extends BaseQuery {
  query: {companyId: string, page?: number, limit?: number};

  constructor(props: QueryProps<ListPropertyQuery>) {
    super(props);
    this.query = props.query;
  }
}

export class ListPropertyByCompagnyQueryHandler extends BaseQueryHandler<ListPropertyQuery, PaginatedResponse<Property>> {
  async execute(params: ListPropertyQuery): Promise<PaginatedResponse<Property>> {
        const repository = PropertyRepository.getInstance();

        const listProperty = await repository.findAllManyWithPagination({
          where: { companyId: params.query.companyId },
          limit: params?.query.limit,
          page: params?.query.page          
        });

        return {
          items: listProperty.item,
          page: listProperty.page,
          limit: listProperty.limit,
          total: listProperty.total
        };
    
  }
}
