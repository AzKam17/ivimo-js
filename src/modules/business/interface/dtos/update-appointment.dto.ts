import { AppointmentStatus } from "@/core/enums/enums";
import { ExtrasTransform } from "@/core/interface";
import { t } from "elysia";

export const UpdateAppointmentDto = t.Object({
  start_date: t.Optional(t.String()),
  end_date: t.Optional(t.String()),
  status: t.Enum(AppointmentStatus),
  extras: ExtrasTransform,
});
