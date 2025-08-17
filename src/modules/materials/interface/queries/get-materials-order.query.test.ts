import { describe, it, expect, beforeEach, mock, spyOn } from "bun:test";
import { MaterialsOrderRepository } from "@/modules/materials/infrastructure/repositories/materials-order.repository";
import { MaterialsOrder, MaterialsOrderItem } from "@/modules/materials/infrastructure/entities";
import { GetMaterialsOrderQuery, GetMaterialsOrderQueryHandler } from "./get-materials-order.query";
import { PaginatedResponse } from "@/core/base/responses";
import { MaterialOrderStatus } from "@/core/enums/enums";

describe("GetMaterialsOrderQueryHandler", () => {
  const mockOrderItems = [
    MaterialsOrderItem.create({
      materialId: "material-1",
      amount: 100,
      quantity: 2
    })
  ];

  const mockMaterialsOrders: MaterialsOrder[] = [
    MaterialsOrder.create({
      id: "1",
      clientName: "Client 1",
      slug: "order-1",
      amount: 200,
      items: mockOrderItems,
      status: MaterialOrderStatus.PENDING,
      supplier_id: "supplier-1",
      extras: {}
    }),
    MaterialsOrder.create({
      id: "2",
      clientName: "Client 2",
      slug: "order-2",
      amount: 300,
      items: mockOrderItems,
      status: MaterialOrderStatus.PENDING,
      supplier_id: "supplier-1",
      extras: {}
    })
  ];

  const mockPaginatedResponse = {
    data: mockMaterialsOrders,
    total: 2,
    page: 1,
    pageCount: 1
  };

  const mockSearchResponse = {
    data: [mockMaterialsOrders[0]],
    total: 1,
    page: 1,
    pageCount: 1
  };

  const mockEmptyResponse = {
    data: [],
    total: 0,
    page: 1,
    pageCount: 0
  };

  const mockMaterialsOrderRepository = {
    findManyWithPagination: mock(() => Promise.resolve(mockPaginatedResponse)),
    searchByILIKE: mock(() => Promise.resolve(mockSearchResponse))
  };

  beforeEach(() => {
    mockMaterialsOrderRepository.findManyWithPagination.mockReset();
    mockMaterialsOrderRepository.findManyWithPagination.mockResolvedValue(mockPaginatedResponse);
    
    mockMaterialsOrderRepository.searchByILIKE.mockReset();
    mockMaterialsOrderRepository.searchByILIKE.mockResolvedValue(mockSearchResponse);

    spyOn(MaterialsOrderRepository, "getInstance").mockReturnValue(
      mockMaterialsOrderRepository as unknown as MaterialsOrderRepository
    );
  });

  it("should return paginated materials orders when no search query is provided", async () => {
    const query = new GetMaterialsOrderQuery({
      query: { page: "1", limit: "10" },
      supplier_id: "supplier-1"
    });
    const handler = new GetMaterialsOrderQueryHandler();

    const result = await handler.execute(query);

    expect(mockMaterialsOrderRepository.findManyWithPagination).toHaveBeenCalledTimes(1);
    expect(mockMaterialsOrderRepository.findManyWithPagination).toHaveBeenCalledWith(
      { supplier_id: "supplier-1" },
      1,
      10
    );
    expect(result).toEqual({
      items: mockMaterialsOrders,
      total: 2,
      page: 1,
      limit: 10,
      last_page: 1
    });
  });

  it("should search materials orders when search query is provided", async () => {
    const query = new GetMaterialsOrderQuery({
      query: { page: "1", limit: "10", q: "Client 1" },
      supplier_id: "supplier-1"
    });
    const handler = new GetMaterialsOrderQueryHandler();

    const result = await handler.execute(query);

    expect(mockMaterialsOrderRepository.searchByILIKE).toHaveBeenCalledTimes(1);
    expect(mockMaterialsOrderRepository.searchByILIKE).toHaveBeenCalledWith(
      ["clientName", "slug"],
      "Client 1",
      1,
      10,
      { supplier_id: "supplier-1" }
    );
    expect(result).toEqual({
      items: [mockMaterialsOrders[0]],
      total: 1,
      page: 1,
      limit: 10,
      last_page: 1
    });
  });

  it("should use default pagination values when not provided", async () => {
    const query = new GetMaterialsOrderQuery({
      query: {},
      supplier_id: "supplier-1"
    });
    const handler = new GetMaterialsOrderQueryHandler();

    await handler.execute(query);

    expect(mockMaterialsOrderRepository.findManyWithPagination).toHaveBeenCalledWith(
      { supplier_id: "supplier-1" },
      1,  // default page
      20  // default limit
    );
  });

  it("should return empty items when no materials orders exist", async () => {
    mockMaterialsOrderRepository.findManyWithPagination.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      pageCount: 0
    });

    const query = new GetMaterialsOrderQuery({
      query: { page: "1", limit: "10" },
      supplier_id: "supplier-1"
    });
    const handler = new GetMaterialsOrderQueryHandler();

    const result = await handler.execute(query);

    expect(result).toEqual({
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      last_page: 0
    });
  });

  it("should return empty items when supplier_id doesn't match any orders", async () => {
    mockMaterialsOrderRepository.findManyWithPagination.mockResolvedValue(mockEmptyResponse);

    const query = new GetMaterialsOrderQuery({
      query: { page: "1", limit: "10" },
      supplier_id: "non-existent-supplier"
    });
    const handler = new GetMaterialsOrderQueryHandler();

    const result = await handler.execute(query);

    expect(mockMaterialsOrderRepository.findManyWithPagination).toHaveBeenCalledTimes(1);
    expect(mockMaterialsOrderRepository.findManyWithPagination).toHaveBeenCalledWith(
      { supplier_id: "non-existent-supplier" },
      1,
      10
    );
    expect(result).toEqual({
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      last_page: 0
    });
  });
});