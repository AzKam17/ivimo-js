import { describe, it, expect, beforeEach, mock, spyOn } from "bun:test";
import { BillingMethodRepository } from "@/modules/billing/infrastructure/repositories";
import { BillingMethod } from "@/modules/billing/infrastructure/entities";
import { GetBillingMethodsQuery, GetBillingMethodsQueryHandler } from "@/modules/billing/interface/queries/get-billing-methods.query";

describe("GetBillingMethodsQueryHandler", () => {
  const mockBillingMethods: BillingMethod[] = [
    {
      id: "1",
      name: "Credit Card",
      slug: "credit-card",
      image: "credit-card.png",
      icon: "credit-card-icon.png",
      extras: {},
    } as BillingMethod,
    {
      id: "2",
      name: "Bank Transfer",
      slug: "bank-transfer",
      image: "bank-transfer.png",
      icon: "bank-transfer-icon.png",
      extras: {},
    } as BillingMethod,
  ];

  const mockBillingMethodRepository = {
    findAll: mock(() => Promise.resolve(mockBillingMethods)),
  };

  beforeEach(() => {
    mockBillingMethodRepository.findAll.mockReset();
    mockBillingMethodRepository.findAll.mockResolvedValue(mockBillingMethods);

    spyOn(BillingMethodRepository, "getInstance").mockReturnValue(
      mockBillingMethodRepository as unknown as BillingMethodRepository
    );
  });

  it("should return all billing methods", async () => {
    const query = new GetBillingMethodsQuery({ id: "1" });
    const handler = new GetBillingMethodsQueryHandler();

    const result = await handler.execute(query);

    expect(result).toEqual(mockBillingMethods);
    expect(mockBillingMethodRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it("should return empty array when no billing methods exist", async () => {
    mockBillingMethodRepository.findAll.mockResolvedValue([]);

    const query = new GetBillingMethodsQuery({ id: "1" });
    const handler = new GetBillingMethodsQueryHandler();

    const result = await handler.execute(query);

    expect(result).toEqual([]);
    expect(mockBillingMethodRepository.findAll).toHaveBeenCalledTimes(1);
  });
});