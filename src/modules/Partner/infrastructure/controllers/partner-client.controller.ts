import { EditUserPartnerQueryHandler } from '../../interface/commands/edit-user-partner.command';
import { User } from "@/modules/auth/infrastructure/entities";
import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import Elysia from "elysia";
import { CommandMediator, cqrs, QueryMediator } from "elysia-cqrs";
import { routes } from "../../routes";
import { UserResponse, UserResponseSchema } from "@/modules/auth/interface/user-http.response";
import {  ActiveUserPartnerQuery, ActiveUserPartnerQueryHandler, CreateUserPartnerCommand, CreateUserPartnerCommandHandler, DiseableUserPartnerQuery, DiseableUserPartnerQueryHandler, EditUserPartnerQuery } from "../../interface/commands";
import { CreateUserPartenaireDto, EditUserPartenaireDto } from "../../interface/dtos";
import { ListUserPartnerQuery, ListUserPartnerQueryHandler } from "../../interface/queries/list-user-partner.query";

export const PartnerController = new Elysia()
  .use(({ decorator }) => {
    return cqrs({
      commands: [
        [CreateUserPartnerCommand, new CreateUserPartnerCommandHandler()],
      ],
      queries: [
        [ListUserPartnerQuery, new ListUserPartnerQueryHandler()],
        [EditUserPartnerQuery, new EditUserPartnerQueryHandler()],
        [ActiveUserPartnerQuery, new ActiveUserPartnerQueryHandler()],
        [DiseableUserPartnerQuery, new DiseableUserPartnerQueryHandler()]
      ]
    });
  })
  // list user partner
  .use(AuthRoutesPlugin)
  .get(
    routes.partner_auth.list,
    async ({queryMediator, user }: { queryMediator: QueryMediator, user: User }) => {},
    newFunction(null, {}, 'List - List client Partner')
  )

function newFunction(body: any, response: any, summary: string, tags: string[] = ["Partner"]) {
  return {
    body,
    response,
    detail: {
      summary,
      tags,
    },
  };
}
