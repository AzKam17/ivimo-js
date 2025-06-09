import { User } from "@/modules/auth/infrastructure/entities";
import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import { Company } from "@/modules/business/infrastructure/entities";
import {
  CreateCompanyCommand,
  CreateCompanyCommandHandler,
} from "@/modules/business/interface/commands/create-company.command";
import { CreateCompanyDto } from "@/modules/business/interface/dtos";
import { GetCompanyQuery, GetCompanyQueryHandler } from "@/modules/business/interface/queries";
import { CompanyResponse, CompanyResponseSchema } from "@/modules/business/interface/responses";
import { routes } from "@/modules/business/routes";
import Elysia from "elysia";
import { CommandMediator, cqrs, QueryMediator } from "elysia-cqrs";

export const CompanyController = new Elysia()
  .use(({ decorator }) => {
    return cqrs({
      commands: [[CreateCompanyCommand, new CreateCompanyCommandHandler()]],
      queries: [[GetCompanyQuery, new GetCompanyQueryHandler()]]
    });
  })
  .get(routes.business.detail, async({params: {id}, queryMediator}: {queryMediator: QueryMediator, params: any}) => {
    const result: Company = await queryMediator.send(new GetCompanyQuery(id));
    return () => new CompanyResponse(result);
  }, {
    detail: {
      summary: "Get a company details",
      tags: ["Business"],
    },
  })
  .use(AuthRoutesPlugin)
  .post(
    routes.business_auth.root,
    async ({ body, user, commandMediator }: { body: any; user: User; commandMediator: CommandMediator }) => {
      const result: Company = await commandMediator.send(
        new CreateCompanyCommand({
          ...body,
          created_by: user.id,
        })
      );

      return () => new CompanyResponse(result);
    },
    {
      body: CreateCompanyDto,
      detail: {
        summary: "Create a new company",
        tags: ["Business"],
      },
    }
  );
