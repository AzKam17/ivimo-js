import { User } from "@/modules/auth/infrastructure/entities";
import { AuthRoutesPlugin, OptionalAuthPlugin } from "@/modules/auth/plugins";
import { Appointment } from "@/modules/business/infrastructure/entities";
import {
  CreateAppointmentCommand,
  CreateAppointmentCommandHandler,
  UpdateAppointmentCommand,
  UpdateAppointmentCommandHandler,
} from "@/modules/business/interface/commands";
import { GetAppointmentsQuery, GetAppointmentsQueryHandler } from "@/modules/business/interface/queries";
import { CreateAppointmentDto, UpdateAppointmentDto } from "@/modules/business/interface/dtos";
import { AppointmentResponse } from "@/modules/business/interface/responses";
import { routes } from "@/modules/business/routes";
import Elysia from "elysia";
import { CommandMediator, cqrs, QueryMediator } from "elysia-cqrs";

export const AppointmentController = new Elysia()
  .use(({ decorator }) => {
    return cqrs({
      commands: [
        [CreateAppointmentCommand, new CreateAppointmentCommandHandler()],
        [UpdateAppointmentCommand, new UpdateAppointmentCommandHandler()],
      ],
      queries: [[GetAppointmentsQuery, new GetAppointmentsQueryHandler()]],
    });
  })
  .use(OptionalAuthPlugin)
  .post(
    routes.appointment.root,
    async ({ body, user, commandMediator }: { body: any; user: User | null; commandMediator: CommandMediator }) => {
      const result: Appointment = await commandMediator.send(
        new CreateAppointmentCommand({
          client_id: user?.id,
          ...body,
          created_by: user?.id,
        })
      );

      return () => new AppointmentResponse({ ...result });
    },
    {
      body: CreateAppointmentDto,
      detail: {
        tags: ["Appointment", "Business"],
        summary: "Create a new appointment",
        description: "Use this to create a new appointment as unauth user.",
      },
    }
  )
  .use(AuthRoutesPlugin)
  .get(
    routes.appointment.root,
    async ({ query, user, queryMediator }: { query: any; user: User; queryMediator: QueryMediator }) => {
      const result: Appointment[] = await queryMediator.send(
        new GetAppointmentsQuery({
          userId: user.id,
          startDate: query?.startDate,
          endDate: query?.endDate,
        })
      );

      return {
        items: result.map((e) => new AppointmentResponse({ ...e })),
      };
    },
    {
      detail: {
        tags: ["Appointment", "Business"],
        summary: "List appointments",
        description: "Use this to list your appointments.",
        parameters: [
          {
            name: "startDate",
            in: "query",
            description: "Search text to find properties by name, description, or address",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "endDate",
            in: "query",
            description: "Page number for pagination (default: 1)",
            required: false,
            schema: {
              type: "number",
            },
          },
        ],
      },
    }
  )
  .put(
    routes.appointment.detail,
    async ({
      params: { id },
      body,
      user,
      commandMediator,
    }: {
      body: any;
      params: any;
      user: User;
      commandMediator: CommandMediator;
    }) => {
      const result: Appointment = await commandMediator.send(
        new UpdateAppointmentCommand({
          ...body,
          id,
          user_id: user.id,
        })
      );
      return () => new AppointmentResponse({ ...result });
    },
    {
      body: UpdateAppointmentDto,
      detail: {
        summary: "Update an appointment",
        tags: ["Appointment", "Business"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the appointment to update",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
      },
    }
  );
