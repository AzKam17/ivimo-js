import { MaterialsCategory } from "@/modules/materials/infrastructure/entities";
import { GetMaterialsCategoryQuery, GetMaterialsCategoryQueryHandler } from "@/modules/materials/interface/queries";
import { MaterialsCategoryResponse, MaterialsCategoryResponsePropsResponseSchema } from "@/modules/materials/interface/responses/materials-category-http.response";
import { routes } from "@/modules/materials/routes";
import Elysia, { t } from "elysia";
import { cqrs, QueryMediator } from "elysia-cqrs";

type E  = {
  id: string;
}

export const MaterialsController = new Elysia({ prefix: "/materials" })
  .use(({ decorator }) => {
    return cqrs({
      queries: [[GetMaterialsCategoryQuery, new GetMaterialsCategoryQueryHandler()]],
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
        200: t.Array(MaterialsCategoryResponsePropsResponseSchema)
      },
      detail: {
        tags: ["Materials"],
        summary: "Get materials category",
        description: "Get all materials category",
      },
    }
  );
