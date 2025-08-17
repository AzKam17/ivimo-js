import { PaginatedResponse } from "@/core/base/responses";
import { User } from "@/modules/auth/infrastructure/entities";
import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import { Materials, MaterialsCategory } from "@/modules/materials/infrastructure/entities";
import { rejectNonSupplierUser } from "@/modules/materials/infrastructure/services/misc";
import { CreateMaterialCommand, CreateMaterialCommandHandler, UpdateMaterialCommand, UpdateMaterialCommandHandler } from "@/modules/materials/interface/commands";
import { CreateMaterialDto, UpdateMaterialDto } from "@/modules/materials/interface/dtos";
import {
  GetMaterialsCategoryQuery,
  GetMaterialsCategoryQueryHandler,
  GetMaterialsDetailQuery,
  GetMaterialsDetailQueryHandler,
  SearchMaterialsQuery,
  SearchMaterialsQueryHandler,
} from "@/modules/materials/interface/queries";
import {
  MaterialsCategoryResponse,
  MaterialsCategoryResponsePropsResponseSchema,
} from "@/modules/materials/interface/responses/materials-category-http.response";
import {
  MaterialsResponse,
  MaterialsResponsePropsResponseSchema,
} from "@/modules/materials/interface/responses/materials-http.response";
import { routes } from "@/modules/materials/routes";
import Elysia, { t } from "elysia";
import { CommandMediator, cqrs, QueryMediator } from "elysia-cqrs";

export const MaterialsController = new Elysia({ prefix: "/materials" })
  .use(({ decorator }) => {
    return cqrs({
      queries: [
        [GetMaterialsCategoryQuery, new GetMaterialsCategoryQueryHandler()],
        [SearchMaterialsQuery, new SearchMaterialsQueryHandler()],
        [GetMaterialsDetailQuery, new GetMaterialsDetailQueryHandler()],
      ],
      commands: [
        [CreateMaterialCommand, new CreateMaterialCommandHandler()],
        [UpdateMaterialCommand, new UpdateMaterialCommandHandler()],
      ],
    });
  })
  .get(
    routes.materials_category.root,
    async ({ queryMediator }: { queryMediator: QueryMediator }) => {
      const result: MaterialsCategory[] = await queryMediator.send(new GetMaterialsCategoryQuery({ id: "1" }));
      return result.map((e) => new MaterialsCategoryResponse({ ...e }));
    },
    {
      response: {
        200: t.Array(MaterialsCategoryResponsePropsResponseSchema),
      },
      detail: {
        tags: ["Materials"],
        summary: "Get materials category",
        description: "Get all materials category",
      },
    }
  )
  .get(
    routes.materials.search,
    async ({ queryMediator, query }: { queryMediator: QueryMediator; query: any }) => {
      const result: PaginatedResponse<Materials> = await queryMediator.send(new SearchMaterialsQuery({ query }));

      return {
        items: result.items.map((e) => new MaterialsResponse({ ...e })),
        total: result.total,
        page: result.page,
        limit: result.limit,
        last_page: result.last_page,
      };
    },
    {
      detail: {
        summary: "Search materials",
        description: "Provide a paginated array of materials",
        tags: ["Materials"],
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
          {
            name: "filter_by",
            in: "query",
            description: "Filter expression for Typesense (e.g., 'has_stock:=true && price:>1000')",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "facet_by",
            in: "query",
            description: "Fields to facet by (e.g., 'category_slug,has_stock')",
            required: false,
            schema: {
              type: "string",
            },
          },
        ],
      },
    }
  )
  .get(
    routes.materials.detail,
    async ({ params: { id }, queryMediator }: { params: { id: string }; queryMediator: QueryMediator }) => {
      const result: Materials = await queryMediator.send(new GetMaterialsDetailQuery({ id }));
      return () => new MaterialsResponse({ ...result });
    },
    {
      detail: {
        tags: ["Materials"],
        summary: "Get a material details",
        description: "Get a material details by id",
        parameters: [
          {
            name: "id",
            in: 'path',
            description: "ID of the material to retrieve details on",
            required: true,
            schema: {
              type: 'string'
            }
          },
        ]
      },
    }
  )
  .use(AuthRoutesPlugin)
  .post(
    routes.materials.root,
    async ({ user, body, commandMediator }: { user: User; body: any; commandMediator: CommandMediator }) => {
      //rejectNonSupplierUser(user);

      const result: Materials = await commandMediator.send(
        new CreateMaterialCommand({
          ...body,
          supplier_id: user.id,
        })
      );

      return new MaterialsResponse({ ...result });
    },
    {
      body: CreateMaterialDto,
      type: "formdata",
      response: {
        200: MaterialsResponsePropsResponseSchema,
      },
      detail: {
        tags: ["Materials"],
        summary: "Create material",
        description: "Create a new material",
      },
    }
  )
  .use(AuthRoutesPlugin)
  .put(routes.materials.update, async({ user, params: { id }, body, commandMediator }: { user: User, params: { id: string }; body: any; commandMediator: CommandMediator }) => {
    const result: Materials = await commandMediator.send(
      new UpdateMaterialCommand({
        ...body,
        id,
        supplier_id: user.id,
      })
    );

    return new MaterialsResponse({ ...result });
  }, {
      body: UpdateMaterialDto,
    type: "formdata",
      response: {
        200: MaterialsResponsePropsResponseSchema,
      },
      detail: {
        tags: ["Materials"],
        summary: "Update material",
        description: "Update an existing material by id",
        parameters: [
          {
            name: "id",
            in: 'path',
            description: "ID of the material to update",
            required: true,
            schema: {
              type: 'string'
            }
          },
        ]
      },
  });
