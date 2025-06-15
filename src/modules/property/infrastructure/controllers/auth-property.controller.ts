import { User } from "@/modules/auth/infrastructure/entities";
import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import { PropertyRepository } from "@/modules/property/infrastructure/repositories";
import { BookMarkPropertyCommand, BookMarkPropertyCommandHandler } from "@/modules/property/interface/commands";
import { PropertyResponse } from "@/modules/property/interface/property-http.response";
import { routes } from "@/modules/property/routes";
import Elysia from "elysia";
import { CommandMediator, cqrs } from "elysia-cqrs";

export const AuthPropertyController = new Elysia()
  .use(({ decorator }) => {
    return cqrs({
      commands: [[BookMarkPropertyCommand, new BookMarkPropertyCommandHandler()]],
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
        consumes: ["multipart/form-data"],
        tags: ["Property"],
      },
    }
  );
