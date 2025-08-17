import { BaseRepository } from "@/core/infrastructure/repositories";
import { MaterialsOrder } from "@/modules/materials/infrastructure/entities";

export class MaterialsOrderRepository extends BaseRepository<MaterialsOrder> {
  private static instance: MaterialsOrderRepository;

  private constructor() {
    super(MaterialsOrder);
  }

  public static getInstance(): MaterialsOrderRepository {
    if (!MaterialsOrderRepository.instance) {
      MaterialsOrderRepository.instance = new MaterialsOrderRepository();
    }
    return MaterialsOrderRepository.instance;
  }
}