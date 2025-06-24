import { GetAnalyticsQuery, GetAnalyticsQueryHandler } from "@/modules/admin/interface/queries";
import { routes } from "@/modules/admin/routes";
import { User } from "@/modules/auth/infrastructure/entities";
import { AuthRoutesPlugin } from "@/modules/auth/plugins";
import { RedisPlugin } from "@/modules/config";
import Elysia from "elysia";
import { cqrs, QueryMediator } from "elysia-cqrs";
export const AdminController = new Elysia()
  .use(RedisPlugin)
  .use(({ decorator }) => {
    const redis = decorator.redis;

    return cqrs({
      queries: [[GetAnalyticsQuery, new GetAnalyticsQueryHandler(redis)]],
    });
  })
  .use(AuthRoutesPlugin)
  .get(
    routes.analytics,
    async ({ user, queryMediator }: { user: User; queryMediator: QueryMediator }) => {
      const result = queryMediator.send(
        new GetAnalyticsQuery({
          user_id: user.id,
          role: user.role,
        })
      );

      return result;
    },
    {
      detail: {
        summary: "Get dashboard homepage analytics",
        tags: ["Admin"],
      },
    }
  );
