import { User } from "@/modules/auth/infrastructure/entities";
import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import { OptionalAuthPlugin } from "@/modules/auth/plugins/optionnal-auth.plugin";
import { Property } from "@/modules/property/infrastructure/entities";
import { CreatePropertyCommand, CreatePropertyCommandHandler } from "@/modules/property/interface/commands";
import { CreatePropertyDto } from "@/modules/property/interface/dtos";
import { PropertyResponse, PropertyResponseSchema } from "@/modules/property/interface/property-http.response";
import {
  GetPropertyQuery,
  GetPropertyQueryHandler,
  GetRecommendedPropertyQuery,
  GetRecommendedPropertyQueryHandler,
} from "@/modules/property/interface/queries";
import { routes } from "@/modules/property/routes";
import Elysia from "elysia";
import { CommandMediator, cqrs, QueryMediator } from "elysia-cqrs";

export const PropertyController = new Elysia()
  .use(({ decorator }) => {
    return cqrs({
      commands: [[CreatePropertyCommand, new CreatePropertyCommandHandler()]],
      queries: [
        [GetPropertyQuery, new GetPropertyQueryHandler()],
        [GetRecommendedPropertyQuery, new GetRecommendedPropertyQueryHandler()],
      ],
    });
  })
  .use(OptionalAuthPlugin)
  .post(
    routes.property.root,
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
      response: PropertyResponseSchema,
      type: "formdata",
      detail: {
        summary: "Create a new property",
        consumes: ["multipart/form-data"],
        tags: ["Property"],
      },
    }
  )

  .get(
    routes.property.detail,
    async ({ params: { id }, queryMediator }: { params: any; queryMediator: QueryMediator }) => {
      const property = await queryMediator.send(new GetPropertyQuery({ id }));
      return () =>
        new PropertyResponse({
          ...(property as Property),
        });
    },
    {
      detail: {
        summary: "Get a property",
        tags: ["Property"],
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
      },
    }
  );
