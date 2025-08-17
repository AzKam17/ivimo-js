import { BaseRepository } from "@/core/infrastructure/repositories";
import { BillingMethod } from "@/modules/billing/infrastructure/entities";

export class BillingMethodRepository extends BaseRepository<BillingMethod> {
  private static instance: BillingMethodRepository;

  private constructor() {
    super(BillingMethod);
  }

  public static getInstance(): BillingMethodRepository {
    if (!BillingMethodRepository.instance) {
      BillingMethodRepository.instance = new BillingMethodRepository();
    }
    return BillingMethodRepository.instance;
  }
}