import { ExtrasTransform } from "@/core/interface";
import { t } from "elysia";

export const UpdateAppointmentDto = t.Object({
  start_date: t.String(),
  end_date: t.String(),
  extras: ExtrasTransform,
});
