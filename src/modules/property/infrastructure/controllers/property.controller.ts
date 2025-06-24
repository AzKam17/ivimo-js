import { PaginatedResponse } from "@/core/base/responses";
import type { PropertyType } from "@/core/enums/enums";
import { Guard } from "@/core/utils";
import { User } from "@/modules/auth/infrastructure/entities";
import { OptionalAuthPlugin } from "@/modules/auth/plugins/optionnal-auth.plugin";
import { RedisPlugin } from "@/modules/config";
import { Property } from "@/modules/property/infrastructure/entities";
import {
  CreatePropertyCommand,
  CreatePropertyCommandHandler,
  IncreasePropertyViewsCommand,
  IncreasePropertyViewsCommandHandler,
} from "@/modules/property/interface/commands";
import { CreatePropertyDto } from "@/modules/property/interface/dtos";
import { PropertyResponse } from "@/modules/property/interface/property-http.response";
import {
  GetFeaturedPropertyQuery,
  GetFeaturedPropertyQueryHandler,
  GetPropertyQuery,
  GetPropertyQueryHandler,
  GetRecommendedPropertyQuery,
  GetRecommendedPropertyQueryHandler,
  SearchPropertyQuery,
  SearchPropertyQueryHandler,
} from "@/modules/property/interface/queries";
import { routes } from "@/modules/property/routes";
import Elysia from "elysia";
import { CommandMediator, cqrs, QueryMediator } from "elysia-cqrs";
import { ip } from "elysia-ip";

export const PropertyController = new Elysia()
  .use(RedisPlugin)
  .use(({ decorator }) => {
    const redis = decorator.redis;
    return cqrs({
      commands: [
        [CreatePropertyCommand, new CreatePropertyCommandHandler()],
        [IncreasePropertyViewsCommand, new IncreasePropertyViewsCommandHandler(redis)],
      ],
      queries: [
        [GetPropertyQuery, new GetPropertyQueryHandler()],
        [GetRecommendedPropertyQuery, new GetRecommendedPropertyQueryHandler()],
        [SearchPropertyQuery, new SearchPropertyQueryHandler()],
        [GetFeaturedPropertyQuery, new GetFeaturedPropertyQueryHandler()]
      ],
    });
  })
  .use(OptionalAuthPlugin)
  .post(
    routes.property_auth.root,
    async ({ user, commandMediator, body }: { user: User | null; commandMediator: CommandMediator; body: any }) => {
      const property: Property = await commandMediator.send(
        new CreatePropertyCommand({
          ...body,
          createdBy: user?.id,
        })
      );

      return () =>
        new PropertyResponse({
          ...property,
        });
    },
    {
      body: CreatePropertyDto,
      //response: PropertyResponseSchema,
      type: "formdata",
      detail: {
        summary: "Create a new property",
        consumes: ["multipart/form-data"],
        tags: ["Property"],
      },
    }
  )

  .use(OptionalAuthPlugin)
  .use(ip())
  .get(
    routes.property.detail,
    async ({
      params: { id },
      user,
      ip,
      queryMediator,
      commandMediator,
    }: {
      user: User | null,
      params: any;
      ip: any;
      queryMediator: QueryMediator;
      commandMediator: CommandMediator;
    }) => {
      console.log(user)
      const property = await queryMediator.send(new GetPropertyQuery({ id }));

      if (!Guard.isEmpty(ip) && !user) {
        commandMediator.send(new IncreasePropertyViewsCommand({ id, ip }));
      }

      return () =>
        new PropertyResponse({
          ...(property as Property),
        });
    },
    {
      detail: {
        summary: "Get a property",
        tags: ["Property"],
        parameters: [
          {
            name: "id",
            in: 'path',
            description: "ID of the property to retrieve details on",
            required: true,
            schema: {
              type: 'string'
            }
          },
        ]
      },
    }
  )
  .get(
    routes.property.recommendation,
    async ({ params: { id }, queryMediator }: { params: any; queryMediator: QueryMediator }) => {
      const result: Property[] = await queryMediator.send(new GetRecommendedPropertyQuery({ id }));

      return result.map((e) => new PropertyResponse({ ...e }));
    },
    {
      detail: {
        summary: "Get recommendation for a property",
        description: "Provide an array of recommended properties for a given property",
        tags: ["Property"],
        parameters: [
          {
            name: "id",
            in: 'path',
            description: "Use this with the ID of the property to get recommendations relatively.",
            required: true,
            schema: {
              type: 'string'
            }
          },
        ]
      },
    }
  )
  .get(routes.property.featured, async ({ queryMediator, query: { type, page, limit } }: { queryMediator: QueryMediator, query: { type: PropertyType, page: number, limit: number } }) => {
    const result: PaginatedResponse<Property> = await queryMediator.send(new GetFeaturedPropertyQuery({ type, page, limit }));

    return {
      items: result.items.map((e) => new PropertyResponse({ ...e })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      last_page: result.last_page
    };
  },
  {
    detail: {
      summary: "Get featured properties by type",
      description: "Returns a paginated list of featured properties filtered by property type and ordered by view count",
      tags: ["Property"],
      parameters: [
        {
          name: "type",
          in: 'query',
          description: "Property type to filter by (LAND, APPARTEMENT, VILLA, RESIDENCE)",
          required: true,
          schema: {
            type: 'string'
          }
        },
        {
          name: "page",
          in: 'query',
          description: "Page number for pagination (starts at 1)",
          required: false,
          schema: {
            type: "number",
            default: 1
          }
        },
        {
          name: "limit",
          in: 'query',
          description: "Number of items per page",
          required: false,
          schema: {
            type: "number",
            default: 10
          }
        }
      ]
    }
  }
)
  .get(
    routes.property.search,
    async ({ queryMediator, query }: { queryMediator: QueryMediator; query: any }) => {
      const result : PaginatedResponse<Property> = await queryMediator.send(new SearchPropertyQuery({ query }));

      return {
        items: result.items.map((e) => new PropertyResponse({ ...e })),
        total: result.total,
        page: result.page,
        limit: result.limit,
        last_page: result.last_page
      };
    },
    {
      detail: {
        summary: "Search properties",
        description: "Provide a paginated array of properties",
        tags: ["Property"],
        parameters: [
          {
            name: "q",
            in: 'query',
            description: "Search text to find properties by name, description, or address",
            required: false,
            schema: {
              type: 'string'
            }
          },
          {
            name: "page",
            in: 'query',
            description: "Page number for pagination (default: 1)",
            required: false,
            schema: {
              type: "number",
            }
          },
          {
            name: "limit",
            in: 'query',
            description: "Number of items per page (default: 20)",
            required: false,
            schema: {
              type: "number",
            }
          },
          {
            name: "filter_by",
            in: 'query',
            description: "Filter expression for Typesense (e.g., 'adType:=rent && price:>1000')",
            required: false,
            schema: {
              type: "number",
            }
          },
          {
            name: "facet_by",
            in: 'query',
            description: "Fields to facet by (e.g., 'adType,type')",
            required: false,
            schema: {
              type: "string",
            }
          }
        ],
      },
    }
  )
  ;
  