
import { BaseRepository } from "@/core/infrastructure/repositories";
import { MaterialsCategory } from "@/modules/materials/infrastructure/entities";

export class MaterialsCategoryRepository extends BaseRepository<MaterialsCategory> {
  private static instance: MaterialsCategoryRepository;

  private constructor() {
    super(MaterialsCategory);
  }

  public static getInstance(): MaterialsCategoryRepository {
    if (!MaterialsCategoryRepository.instance) {
      MaterialsCategoryRepository.instance = new MaterialsCategoryRepository();
    }
    return MaterialsCategoryRepository.instance;
  }
}
