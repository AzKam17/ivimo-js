import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { MaterialsCategory } from "@/modules/materials/infrastructure/entities";
import { MaterialsCategoryRepository } from "@/modules/materials/infrastructure/repositories";

export class GetMaterialsCategoryQuery extends BaseQuery {
  id?: any;
  constructor(props: QueryProps<GetMaterialsCategoryQuery>) {
    super(props);
    this.id = this.id;
  }
}

export class GetMaterialsCategoryQueryHandler extends BaseQueryHandler<GetMaterialsCategoryQuery, MaterialsCategory[]> {
  async execute(query: GetMaterialsCategoryQuery): Promise<MaterialsCategory[]> {
    return await MaterialsCategoryRepository.getInstance().findAll();
  }
}
