import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { Materials } from "@/modules/materials/infrastructure/entities";
import { MaterialsRepository } from "@/modules/materials/infrastructure/repositories";

export class GetMaterialsDetailQuery extends BaseQuery {
  id: string;

  constructor(props: QueryProps<GetMaterialsDetailQuery>) {
    super(props);
    this.id = props.id;
  }
}

export class GetMaterialsDetailQueryHandler extends BaseQueryHandler<GetMaterialsDetailQuery, Materials> {
  async execute(query: GetMaterialsDetailQuery): Promise<Materials> {
    const material = await MaterialsRepository.getInstance().findById(query.id);
    
    if (!material) {
      throw new Error(`Material with ID ${query.id} not found`);
    }
    
    return material;
  }
}