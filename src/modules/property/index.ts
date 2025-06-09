import { AuthPropertyController, PropertyController } from "@/modules/property/infrastructure/controllers";
import Elysia from "elysia";

export const PropertyModule = new Elysia({ name: "property-module" })
  .use(PropertyController)
  .use(AuthPropertyController);
