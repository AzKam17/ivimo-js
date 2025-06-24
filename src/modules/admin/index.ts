import { Elysia } from "elysia";
import { AdminController } from "./infrastructure/controllers";

export const AdminModule = new Elysia({ name: "admin-module", prefix: "api/v1/admin" })
  .use(AdminController);
