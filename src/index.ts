import { Elysia } from "elysia";
import { AppDataSource, LoggerPlugin } from "./modules/config";
import { AuthModule } from "./modules/auth";
import swagger from "@elysiajs/swagger";
import { ErrorPlugin } from "@/core/base/errors";
import { PropertyModule } from "@/modules/property";

AppDataSource.initialize().then(async () =>
  console.log("🗃️ Database connected with Bun")
);

const app = new Elysia()
  .use(swagger())
  .use(ErrorPlugin)
  .use(AuthModule)
  .use(PropertyModule)
  .get("/health", () => ({ status: "ok", runtime: "bun" }))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
