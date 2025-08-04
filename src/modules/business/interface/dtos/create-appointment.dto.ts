import { ExtrasTransform } from "@/core/interface";
import { t } from "elysia";

export const CreateAppointmentDto = t.Object({
  start_date: t.String(),
  end_date: t.String(),
  property_id: t.String(),
  extras: ExtrasTransform,
});
