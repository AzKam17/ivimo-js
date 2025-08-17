
import { routes } from "@/modules/billing/routes";
import Elysia, { t } from "elysia";
import { CommandMediator, cqrs, QueryMediator } from "elysia-cqrs";
import { GetBillingMethodsQuery, GetBillingMethodsQueryHandler } from "@/modules/billing/interface/queries";
import { BillingMethod } from "@/modules/billing/infrastructure/entities";
import { BillingMethodResponse, BillingMethodsResponsePropsResponseSchema } from "@/modules/billing/interface/responses";

export const BillingMethodController = new Elysia({ prefix: "/billing-method" })
  .use(({ decorator }) => {
    return cqrs({
      queries: [
        [GetBillingMethodsQuery, new GetBillingMethodsQueryHandler()],
      ],
      commands: [
      ],
    });
  })
  .get(
    routes.billing_method.root,
    async ({ queryMediator }: { queryMediator: QueryMediator }) => {
      const res: BillingMethod[] = await queryMediator.send(new GetBillingMethodsQuery({ id: "1" }));
      
      return res.map((item) => new BillingMethodResponse(item));
    },
    {
      response: {
        200: t.Array(BillingMethodsResponsePropsResponseSchema),
      },
      detail: {
        tags: ["Billing"],
        summary: "Get billing methods",
        description: "Get all billing methods",
      },
    }
  );
