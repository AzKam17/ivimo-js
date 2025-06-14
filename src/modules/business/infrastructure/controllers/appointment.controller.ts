import { User } from "@/modules/auth/infrastructure/entities";
import { OptionalAuthPlugin } from "@/modules/auth/plugins";
import { Appointment } from "@/modules/business/infrastructure/entities";
import { CreateAppointmentCommand, CreateAppointmentCommandHandler } from "@/modules/business/interface/commands";
import { CreateAppointmentDto } from "@/modules/business/interface/dtos";
import { AppointmentResponse } from "@/modules/business/interface/responses";
import { routes } from "@/modules/business/routes";
import Elysia from "elysia";
import { CommandMediator, cqrs } from "elysia-cqrs";

export const AppointmentController = new Elysia()
  .use(({ decorator }) => {
    return cqrs({
      commands: [[CreateAppointmentCommand, new CreateAppointmentCommandHandler()]],
    });
  })
  .use(OptionalAuthPlugin)
  .post(
    routes.appointment.root,
    async ({ body, user, commandMediator }: { body: any; user: User | null; commandMediator: CommandMediator }) => {
      const result: Appointment = await commandMediator.send(
        new CreateAppointmentCommand({
          ...body,
          createdBy: user?.id,
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
  );
