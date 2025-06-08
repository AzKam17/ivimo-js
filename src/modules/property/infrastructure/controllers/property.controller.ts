import { User } from "@/modules/auth/infrastructure/entities";
import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import { OptionalAuthPlugin } from "@/modules/auth/plugins/optionnal-auth.plugin";
import { CreatePropertyCommand, CreatePropertyCommandHandler } from "@/modules/property/interface/commands";
import { CreatePropertyDto } from "@/modules/property/interface/dtos";
import { routes } from "@/modules/property/routes";
import Elysia from "elysia";
import { CommandMediator, cqrs } from "elysia-cqrs";

export const PropertyController = new Elysia()
  .use(({ decorator }) => {
    return cqrs({
      commands: [[CreatePropertyCommand, new CreatePropertyCommandHandler()]],
    });
  })
  .use(OptionalAuthPlugin)
  .post(
    routes.property.root,
    async ({ user, commandMediator, body }: {user: User | null, commandMediator: CommandMediator, body: any}) => {
      await commandMediator.send(new CreatePropertyCommand({
        ...body,
        createdBy: user?.id,  
      }))
      
      return "Hello World";
    },
    {
      body: CreatePropertyDto,
      type: "formdata",
      detail: {
        summary: "Create a new property",
        consumes: ["multipart/form-data"],
        tags: ["Property"],
      },
    }
  );
