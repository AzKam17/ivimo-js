import { PropertyController } from "@/modules/property/infrastructure/controllers";
import Elysia from "elysia";


export const PropertyModule = new Elysia({ name: "property-module", prefix: "api/v1/property" })
  .use(PropertyController);