import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { Materials } from "@/modules/materials/infrastructure/entities";
import { PaginatedResponse } from "@/core/base/responses";
import { MaterialsRepository } from "@/modules/materials/infrastructure/repositories";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { MemberAbilityFactory } from "@/core/infrastructure/services/access-control/member-ability.factory";
import { BaseError } from "@/core/base/errors";

export class SearchMaterialsQuery extends BaseQuery {
  query: any;
  supplier_id?: string;
  is_private?: boolean;

  constructor(props: QueryProps<SearchMaterialsQuery>) {
    super(props);
    this.query = props.query;
    this.supplier_id = props.supplier_id;
    this.is_private = props.is_private;
  }
}

export class SearchMaterialsQueryHandler extends BaseQueryHandler<SearchMaterialsQuery, PaginatedResponse<Materials>> {
  async execute(query: SearchMaterialsQuery): Promise<PaginatedResponse<Materials>> {
    const materialsRepository = MaterialsRepository.getInstance();

    let conditions: any = {
      isVisible: true,
    };
    if (!!query.supplier_id && !!query.is_private) {
      const user = await UserRepository.getInstance().findOneBy(
        {
          id: query.supplier_id,
        },
        true
      );

      const ability = await MemberAbilityFactory.getInstance().getAbilities(user);

      if (ability.cannot("read", Materials)) {
        throw new BaseError({
          message: "You are not authorized to perform this action.",
          statusCode: 403,
        });
      }

      conditions.supplier_id = query.supplier_id;
      conditions.isVisible = undefined;
    }

    const searchText = query.query?.q || "";
    const page = parseInt(query.query?.page) || 1;
    const limit = parseInt(query.query?.limit) || 20;

    const results = await materialsRepository.searchByILIKE(["name", "description"], searchText, page, limit, {
      ...conditions,
    });

    // Perform the search using the TypesenseService
    return {
      limit,
      page,
      items: results.data,
      total: results.total,
    };
  }
}
