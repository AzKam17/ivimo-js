import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { MaterialsOrder } from "@/modules/materials/infrastructure/entities";
import { PaginatedResponse } from "@/core/base/responses";
import { MaterialsOrderRepository } from "@/modules/materials/infrastructure/repositories/materials-order.repository";

export class GetMaterialsOrderQuery extends BaseQuery {
  query: any;
  supplier_id?: string;

  constructor(props: QueryProps<GetMaterialsOrderQuery>) {
    super(props);
    this.query = props.query;
    this.supplier_id = props.supplier_id;
  }
}

export class GetMaterialsOrderQueryHandler extends BaseQueryHandler<GetMaterialsOrderQuery, PaginatedResponse<MaterialsOrder>> {
  async execute(query: GetMaterialsOrderQuery): Promise<PaginatedResponse<MaterialsOrder>> {
    const repository = MaterialsOrderRepository.getInstance();

    let conditions: any = {};
    if (query.supplier_id) {
      conditions.supplier_id = query.supplier_id;
    }

    const searchText = query.query?.q || "";
    const page = parseInt(query.query?.page) || 1;
    const limit = parseInt(query.query?.limit) || 20;

    let results;
    
    if (searchText) {
      results = await repository.searchByILIKE(["clientName", "slug"], searchText, page, limit, {
        ...conditions,
      });
    } else {
      results = await repository.findManyWithPagination(conditions, page, limit);
    }

    return {
      limit,
      page,
      items: results.data,
      total: results.total,
      last_page: Math.ceil(results.total / limit),
    };
  }
}