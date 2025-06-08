import { BaseRepository } from "@/core/infrastructure/repositories";
import { Property } from "@/modules/property/infrastructure/entities";

export class PropertyRepository extends BaseRepository<Property> {
  private static instance: PropertyRepository;

  private constructor() {
    super(Property);
  }

  public static getInstance(): PropertyRepository {
    if (!PropertyRepository.instance) {
      PropertyRepository.instance = new PropertyRepository();
    }
    return PropertyRepository.instance;
  }
}
