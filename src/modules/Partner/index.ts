import { PartnerController } from './infrastructure/controllers/partner.controller';
import Elysia from "elysia";

export const PartnerModule = new Elysia({ name: "partner-module" })
  .use(PartnerController);
