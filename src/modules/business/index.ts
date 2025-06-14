import { AgentController, AppointmentController, CompanyController } from "@/modules/business/infrastructure/controllers";
import Elysia from "elysia";

export const BusinessModule = new Elysia({ name: "business-module" }).use(CompanyController).use(AgentController).use(AppointmentController);
