
import { BaseRepository } from "@/core/infrastructure/repositories";
import { Materials } from "@/modules/materials/infrastructure/entities";

export class MaterialsRepository extends BaseRepository<Materials> {
  private static instance: MaterialsRepository;

  private constructor() {
    super(Materials);
  }

  public static getInstance(): MaterialsRepository {
    if (!MaterialsRepository.instance) {
      MaterialsRepository.instance = new MaterialsRepository();
    }
    return MaterialsRepository.instance;
  }
}
