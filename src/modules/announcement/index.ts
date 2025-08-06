import Elysia from "elysia";
import { AnnouncementController } from "./infrastructure/controllers";
export const AnnouncementModule = new Elysia({ name: "announcement-module" }).use(AnnouncementController);
