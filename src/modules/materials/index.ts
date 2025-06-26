import { MaterialsController } from "@/modules/materials/infrastructure/controllers";
import Elysia from "elysia";

export const MaterialsModule = new Elysia({ name: "materials-module" })
    .use(MaterialsController)
;
