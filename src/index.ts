import "reflect-metadata";
import { Elysia } from "elysia";
import { AppDataSource, LoggerPlugin } from "./modules/config";
import { AuthModule } from "./modules/auth";
import swagger from "@elysiajs/swagger";
import { ErrorPlugin } from "@/core/base/errors";
import { PropertyModule } from "@/modules/property";
import { AssetModule } from "@/modules/assets";
import { BusinessModule } from "@/modules/business";
import { AdminModule } from "@/modules/admin";
import { MaterialsModule } from "@/modules/materials";
import cors from "@elysiajs/cors";
import { PartnerModule } from "./modules/Partner";

AppDataSource.initialize().then(async () => console.log("🗃️ Database connected with Bun"));

const app = new Elysia()
.use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: "Ivimo Documentation",
          version: "0.0.1",
        },
        tags: [
          { name: "General", description: "General endpoints" },
          { name: "Property", description: "Property endpoints" },
          { name: "Business", description: "Business endpoints" },
          { name: "Auth", description: "Authentication endpoints" },
          { name: "Assets", description: "Assets endpoints" },
          { name: "Appointment", description: "Appointment endpoints" },
          { name: "Admin", description: "Admin endpoints" },
          { name: "Materials", description: "Materials endpoints" },
        ],
        components: {
          securitySchemes: {
            jwt: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    })
  )
  .use(ErrorPlugin)
  .use(AssetModule)
  .use(AuthModule)
  .use(PropertyModule)
  .use(PartnerModule)
  .use(BusinessModule)
  .use(AdminModule)
  .use(MaterialsModule)
  .get("/health", () => ({ status: "ok", runtime: "bun" }), { detail: { tags: ["General"] } })
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
