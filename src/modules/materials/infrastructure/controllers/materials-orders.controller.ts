import { User } from "@/modules/auth/infrastructure/entities";
import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import { MaterialsOrder } from "@/modules/materials/infrastructure/entities";
import { GetMaterialsOrderQuery, GetMaterialsOrderQueryHandler } from "@/modules/materials/interface/queries";
import { MaterialsOrderResponse } from "@/modules/materials/interface/responses";
import { routes } from "@/modules/materials/routes";
import { PaginatedResponse } from "@/core/base/responses";
import Elysia from "elysia";
import { cqrs, QueryMediator } from "elysia-cqrs";

export const MaterialsOrdersController = new Elysia({ prefix: "/materials" })
  .use(() => {
    return cqrs({
      queries: [[GetMaterialsOrderQuery, new GetMaterialsOrderQueryHandler()]],
      commands: [],
    });
  })
  .use(AuthRoutesPlugin)
  .get(
    routes.order.search,
    async ({ user, queryMediator, query }: { query: any; user: User; queryMediator: QueryMediator }) => {
      const result: PaginatedResponse<MaterialsOrder> = await queryMediator.send(
        new GetMaterialsOrderQuery({ query, supplier_id: user.id })
      );
      return {
        ...result,
        items: result.items.map((e) => new MaterialsOrderResponse({...e}))
      };
    },
    {
      response: {},
      detail: {
        tags: ["Materials"],
        summary: "Get materials orders",
        description: "Get all materials orders",
         parameters: [
          {
            name: "q",
            in: "query",
            description: "Search text to find materials by name, description, or category",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "page",
            in: "query",
            description: "Page number for pagination (default: 1)",
            required: false,
            schema: {
              type: "number",
            },
          },
          {
            name: "limit",
            in: "query",
            description: "Number of items per page (default: 20)",
            required: false,
            schema: {
              type: "number",
            },
          },
        ],
      },
    }
  );
