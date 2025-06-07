import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import { CreatePropertyDto } from "@/modules/property/interface/dtos";
import { routes } from "@/modules/property/routes";
import Elysia from "elysia";

export const PropertyController = new Elysia().use(AuthRoutesPlugin).post(
  routes.property.root,
  ({ user }) => {
    console.log("e", user);
    return "Hello World";
  },
  {
    body: CreatePropertyDto,
    type: "formdata",
  }
);
