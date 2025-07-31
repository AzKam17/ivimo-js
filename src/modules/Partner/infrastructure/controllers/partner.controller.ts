import { EditUserPartnerQueryHandler } from './../../interface/commands/edit-user-partner.command';
import { User } from "@/modules/auth/infrastructure/entities";
import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import Elysia from "elysia";
import { CommandMediator, cqrs, QueryMediator } from "elysia-cqrs";
import { routes } from "../../routes";
import { UserResponse } from "@/modules/auth/interface/user-http.response";
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
    async ({queryMediator, user, query }: { queryMediator: QueryMediator, user: User, query: {roles: string, limit: number, page: number}}) => {
      /**
       * Liste des utilisateur doit tenir compte du business_id, createBy
       */
      console.log("roles => ", query.roles )
    
      const result: { data: User[]; total: number; page: number; pageCount: number } = 
                  await queryMediator.send(new ListUserPartnerQuery({ companyId: user.companyId, params: query }));
      console.log('\nresult => ', result)
      return () => result;

    },
    newFunction(null,  { }, 'List - List User Partner')
  )
  // create user partner
  .post(
    routes.partner_auth.create,
    async ({ user, body, commandMediator }: { user: User, body: any; commandMediator: CommandMediator }) => {
      console.log('user info => ', user)
      const result: User = await commandMediator.send(
        new CreateUserPartnerCommand({
          ...body,
          companyId: user?.companyId || body?.companyId,
          createBy: user.id
        })
      );
      return new UserResponse(result);
    },
    newFunction(CreateUserPartenaireDto, UserResponse, "Sign in - Create new User Partner")
  )
  // update profil
  .put(
    routes.partner_auth.detail,
    async ({params: { id } , queryMediator, body, user }: { queryMediator: QueryMediator, body: any, params: any, user: User }) => {
      console.log('user', user)
      const result: User = await queryMediator.send(
        new EditUserPartnerQuery({
          ...body,
          companyId: user.companyId || body?.companyId,
          id
        })
      );

      return () => new UserResponse({ ...result });
    },
    newFunction(EditUserPartenaireDto, UserResponse, "Edit - edit User partner")
  )
  // disable profil
  .get(
    routes.partner_auth.disable,
    async ({ params: { id }, queryMediator }: { queryMediator: QueryMediator, params: any }) => {
      const result: User = await queryMediator.send(new DiseableUserPartnerQuery({
        id
      }));
      return () => new UserResponse({ ...result });
    },
    newFunction(null, {}, "Diseable - diseable User partner")
  )
  // active profil
  .get(
    routes.partner_auth.active,
    async ({ params: { id }, queryMediator }: { queryMediator: QueryMediator, params: any }) => {
      const result: User = await queryMediator.send(new ActiveUserPartnerQuery({
        id
      }));
      return () => new UserResponse({ ...result });
    },
    newFunction(null, null, "Active - active User partner")
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

interface ResponsePaginate { 
  data: UserResponse[],
  total: number,
  page: number,
  pageCount: number
}