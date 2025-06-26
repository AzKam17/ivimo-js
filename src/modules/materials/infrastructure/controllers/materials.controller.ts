import { User } from "@/modules/auth/infrastructure/entities";
import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import { Materials, MaterialsCategory } from "@/modules/materials/infrastructure/entities";
import { rejectNonSupplierUser } from "@/modules/materials/infrastructure/services/misc";
import { CreateMaterialCommand, CreateMaterialCommandHandler } from "@/modules/materials/interface/commands";
import { CreateMaterialDto } from "@/modules/materials/interface/dtos";
import { GetMaterialsCategoryQuery, GetMaterialsCategoryQueryHandler } from "@/modules/materials/interface/queries";
import {
  MaterialsCategoryResponse,
  MaterialsCategoryResponsePropsResponseSchema,
} from "@/modules/materials/interface/responses/materials-category-http.response";
import { MaterialsResponse, MaterialsResponsePropsResponseSchema } from "@/modules/materials/interface/responses/materials-http.response";
import { routes } from "@/modules/materials/routes";
import Elysia, { t } from "elysia";
import { CommandMediator, cqrs, QueryMediator } from "elysia-cqrs";



export const MaterialsController = new Elysia({ prefix: "/materials" })
  .use(({ decorator }) => {
    return cqrs({
      queries: [[GetMaterialsCategoryQuery, new GetMaterialsCategoryQueryHandler()]],
      commands: [
        [CreateMaterialCommand, new CreateMaterialCommandHandler()],
      ]
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
  .use(AuthRoutesPlugin)
  .post(routes.materials.root, async ({ user, body, commandMediator }: { user: User, body: any, commandMediator: CommandMediator }) => {
    rejectNonSupplierUser(user)
    
    const result: Materials = await commandMediator.send(new CreateMaterialCommand({
      ...body,
      supplier_id: user.id
    }));

    return new MaterialsResponse({ ...result });
  }, {
    body: CreateMaterialDto,
    response: {
      200: MaterialsResponsePropsResponseSchema,
    },
    detail: {
      tags: ["Materials"],
      summary: "Create material",
      description: "Create a new material",
    },
  });
