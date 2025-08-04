import { EditUserPartnerQueryHandler } from './../../interface/commands/edit-user-partner.command';
import { User } from "@/modules/auth/infrastructure/entities";
import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import Elysia from "elysia";
import { CommandMediator, cqrs, QueryMediator } from "elysia-cqrs";
import { routes } from "../../routes";
import { UserResponse } from "@/modules/auth/interface/user-http.response";
import { ActiveUserPartnerQuery, ActiveUserPartnerQueryHandler, CreateUserPartnerCommand, CreateUserPartnerCommandHandler, DiseableUserPartnerQuery, DiseableUserPartnerQueryHandler, EditUserPartnerQuery } from "../../interface/commands";
import { CreateUserPartenaireDto, EditUserPartenaireDto } from "../../interface/dtos";
import { ListUserPartnerQuery, ListUserPartnerQueryHandler } from "../../interface/queries/list-user-partner.query";
import { NON_ADMIN_NON_SUPPLIER_ROLES, UserRoleEnum, UserRoleWithoutAdminAndFournisseur } from '@/core/enums/enums';

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
    async ({ queryMediator, user, query }: { queryMediator: QueryMediator, user: User, query: { roles: UserRoleWithoutAdminAndFournisseur, limit: number, page: number } }) => {
      /**
       * Liste des utilisateur doit tenir compte du business_id, createBy
       */
      console.log("roles => ", query.roles)

      const result: { data: User[]; total: number; page: number; pageCount: number } =
        await queryMediator.send(new ListUserPartnerQuery({ companyId: user.companyId, params: query }));
      console.log('\nresult => ', result)
      return () => result;

    },
    newFunction({
      detail: {
        summary: 'List - List User Partner',
        parameters: [
          {
            name: 'role',
            in: 'query',
            description: "Search text to find properties by name, description, or address",
            required: false,
            schema: {
              type: 'string',
              enum: NON_ADMIN_NON_SUPPLIER_ROLES
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
            description: "Number of items per page",
            required: false,
            schema: {
              type: "number",
            }
          },
        ]
      }
    })

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
      return new UserResponse({...result});
    },
    newFunction({ body: CreateUserPartenaireDto, reponse: UserResponse, detail: { summary: "Sign in - Create new User Partner" } })
  )
  // update profil
  .put(
    routes.partner_auth.detail,
    async ({ params: { id }, queryMediator, body, user }: { queryMediator: QueryMediator, body: any, params: any, user: User }) => {
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
    newFunction({ body: EditUserPartenaireDto, reponse: UserResponse, detail: { summary: "Edit - edit User partner" } })
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
    newFunction({ detail: { summary: "Diseable - diseable User partner" } })
  )
  // active profil
  .get(
    routes.partner_auth.active,
    async ({ params: { id }, queryMediator }: { queryMediator: QueryMediator, params: any }) => {
      const result: User = await queryMediator.send(new ActiveUserPartnerQuery({
        id
      }));
      return () => new UserResponse({ ...result });
    }, newFunction({ detail: { summary: "Active - active User partner" } })
  )

function newFunction<T = any>(data: {
  body?: T,
  response?: T,
  detail:
  {
    summary?: string,
    tags?: string[],
    parameters?: { name: string, in: string, description: string, required: boolean, schema: any }[]
  }
}) {
  data.detail.tags = ["Partner"]
  return data;
}

interface ResponsePaginate {
  data: UserResponse[],
  total: number,
  page: number,
  pageCount: number
}