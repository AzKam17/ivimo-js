import Elysia from "elysia";
import { cqrs, CommandMediator, QueryMediator } from "elysia-cqrs";
import { GetUserQuery, GetUserQueryHandler } from "../../interface/queries";
import { RedisPlugin } from "@/modules/config";

export const SignInController = new Elysia()
  .use(RedisPlugin)
  .use(({ decorator }) => {
    return cqrs({
      queries: [[GetUserQuery, new GetUserQueryHandler(decorator.redis)]],
    });
  })
  .get("/sign-in", async ({ queryMediator }: {queryMediator: QueryMediator}) =>
    queryMediator.send(new GetUserQuery())
  );
