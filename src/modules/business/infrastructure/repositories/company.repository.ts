import { BaseRepository } from "@/core/infrastructure/repositories";
import { Company } from "@/modules/business/infrastructure/entities";

export class CompanyRepository extends BaseRepository<Company> {
  private static instance: CompanyRepository;

  private constructor() {
    super(Company);
  }

  public static getInstance(): CompanyRepository {
    if (!CompanyRepository.instance) {
      CompanyRepository.instance = new CompanyRepository();
    }
    return CompanyRepository.instance;
  }
}
