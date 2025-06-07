import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import { routes } from "@/modules/property/routes";
import Elysia from "elysia";

export const PropertyController = new Elysia().use(AuthRoutesPlugin).get(routes.property.root, ({ user }) => {
  console.log("e", user);
  return "Hello World";
});
