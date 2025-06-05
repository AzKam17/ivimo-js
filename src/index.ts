import { Elysia } from "elysia";
import { AppDataSource } from "./modules/config";
import { AuthModule } from "./modules/auth";
import swagger from "@elysiajs/swagger";

AppDataSource.initialize().then(async () =>
  console.log("🗃️ Database connected with Bun")
);

const app = new Elysia()
  .use(swagger())
  .use(AuthModule)
  .get("/health", () => ({ status: "ok", runtime: "bun" }))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
