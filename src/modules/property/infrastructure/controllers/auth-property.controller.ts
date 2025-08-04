import { PaginatedResponse } from "@/core/base/responses";
import { User } from "@/modules/auth/infrastructure/entities";
import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import { PropertyRepository } from "@/modules/property/infrastructure/repositories";
import { BookMarkPropertyCommand, BookMarkPropertyCommandHandler } from "@/modules/property/interface/commands";
import { PropertyResponse } from "@/modules/property/interface/property-http.response";
import { routes } from "@/modules/property/routes";
import Elysia from "elysia";
import { CommandMediator, cqrs, QueryMediator } from "elysia-cqrs";
import { UpdatePropertyQuery, UpdatePropertyQueryHandler } from "../../interface/commands/update-property.command";
import { UpdatePropertyDto } from "../../interface/dtos";
import { ListPropertyByCompagnyQueryHandler, ListPropertyQuery } from "../../interface/queries";
import { Property } from "../entities";
import { ActivePropertyQuery, ActivePropertyQueryHandler } from "../../interface/queries/active-property.query";
import { DiseablePropertyQuery, DiseablePropertyQueryHandler } from "../../interface/queries/diseable-property.query";

export const AuthPropertyController = new Elysia()
  .use(({ decorator }) => {
    return cqrs({
      commands: [[BookMarkPropertyCommand, new BookMarkPropertyCommandHandler()],
      ],
      queries: [
        [ListPropertyQuery, new ListPropertyByCompagnyQueryHandler()],
        [UpdatePropertyQuery, new UpdatePropertyQueryHandler()],
        [ActivePropertyQuery, new ActivePropertyQueryHandler()],
        [DiseablePropertyQuery, new DiseablePropertyQueryHandler()],
      ]
    });
  })
  .use(AuthRoutesPlugin)
  .get(
    routes.property_auth.bookmark,
    async ({
      user,
      params: { id },
      commandMediator,
      set,
    }: {
      user: User;
      params: { id: string };
      commandMediator: CommandMediator;
      set: any;
    }) => {
      const result: boolean = await commandMediator.send(
        new BookMarkPropertyCommand({
          propertyId: id,
          userId: user.id,
        })
      );

      set.status = result ? 200 : 500;
      return "";
    },
    {
      detail: {
        summary: "Bookmark a property",
        tags: ["Property"],
      },
    }
  )
  .get(
    routes.property_auth.root,
    async ({ user }: { user: User }) => {
      const repository = PropertyRepository.getInstance();
      const properties = await repository.findBy({
        ownedBy: user.id,
      });
      return properties.map((e) => new PropertyResponse(e));
    },
    {
      detail: {
        summary: "Get my properties",
        tags: ["Property"],
      },
    }
  )
  // get list property by company
  .get(routes.property_auth.company,
    async ({ queryMediator, query, user }:
      { queryMediator: QueryMediator, query: { companyId: string, limit?: number, page?: number }, user: User }) => {
      console.log('\n user => ', user)

      query.companyId = user.companyId;
      const result: PaginatedResponse<Property> = await queryMediator.send(new ListPropertyQuery({ query }));

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
        summary: "List properties",
        description: "List properties by compagny",
        tags: ["Property"],
        parameters: [
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
            description: "Number of items per page",
            required: false,
            schema: {
              type: "number",
            }
          },
        ]
      }
    }
  )
  // update property by id and companyId
  .put(
    routes.property_auth.detail,
    async ({ params: { id }, queryMediator, body, user }: { queryMediator: QueryMediator, body: any, params: any, user: User }) => {
      console.log('\n user', user)
      console.log('\n id  ', id)

      const result: Property = await queryMediator.send(
        new UpdatePropertyQuery({
          ...body,
          companyId: user.companyId,
          id,
        })
      );

      return () => new PropertyResponse({ ...result });
    },
    {
      body: UpdatePropertyDto,
      reponse: Property,
      detail: {
        tags: ["Property"],
        summary: "update properties",
        description: "update property for company",
      }
    }
  )
  // active property
  .get(
    routes.property_auth.active,
    async ({ params: { id }, queryMediator }: { queryMediator: QueryMediator, params: any }) => {
      const result: Property = await queryMediator.send(new ActivePropertyQuery({
        id
      }));

      return () => new PropertyResponse({ ...result });

    }, {
    reponse: Property,
    detail: {
      tags: ["Property"],
      summary: "Active - active property"
    }
  })
  // diseable property
  .get(
    routes.property_auth.diseable,
    async ({ params: { id }, queryMediator }: { queryMediator: QueryMediator, params: any }) => {
      const result: Property = await queryMediator.send(new DiseablePropertyQuery({
        id
      }));

      return () => new PropertyResponse({ ...result });

    }, {
    reponse: Property,
    detail: {
      tags: ["Property"],
      summary: "Diseable - diseable property"
    }
  })
  ;
