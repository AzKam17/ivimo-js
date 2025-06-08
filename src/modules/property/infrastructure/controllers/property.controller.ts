import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import { OptionalAuthPlugin } from "@/modules/auth/plugins/optionnal-auth.plugin";
import { CreatePropertyDto } from "@/modules/property/interface/dtos";
import { routes } from "@/modules/property/routes";
import Elysia from "elysia";

export const PropertyController = new Elysia().use(OptionalAuthPlugin).post(
  routes.property.root,
  ({ user }) => {
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
