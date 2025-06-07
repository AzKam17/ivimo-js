import { Elysia } from "elysia";
import { AppDataSource, LoggerPlugin } from "./modules/config";
import { AuthModule } from "./modules/auth";
import swagger from "@elysiajs/swagger";
import { ErrorPlugin } from "@/core/base/errors";

AppDataSource.initialize().then(async () =>
  console.log("🗃️ Database connected with Bun")
);

const app = new Elysia()
  .use(swagger())
  .use(ErrorPlugin)
  .use(AuthModule)
  .get("/health", () => ({ status: "ok" }))
  .listen(3000, () => {
    console.log(`🦊 Elysia is running`);
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
