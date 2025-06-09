import { Elysia } from "elysia";
import { AppDataSource, LoggerPlugin } from "./modules/config";
import { AuthModule } from "./modules/auth";
import swagger from "@elysiajs/swagger";
import { ErrorPlugin } from "@/core/base/errors";
import { PropertyModule } from "@/modules/property";
import { AssetModule } from "@/modules/assets";

AppDataSource.initialize().then(async () => console.log("🗃️ Database connected with Bun"));

const app = new Elysia()
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
          { name: "Auth", description: "Authentication endpoints" },
          { name: "Assets", description: "Assets endpoints" },
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
  .get("/health", () => ({ status: "ok", runtime: "bun" }), { detail: { tags: ["General"] } })
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
