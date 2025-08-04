import { NotificationController } from "@/modules/notification/infrastructure/controllers";
import Elysia from "elysia";

export const NotificationModule = new Elysia({ name: "notification-module" })
  .use(NotificationController);
