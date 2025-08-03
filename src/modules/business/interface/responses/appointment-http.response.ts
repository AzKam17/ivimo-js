import { Appointment } from "@/modules/business/infrastructure/entities";
import { t } from "elysia";

export const AppointmentResponseSchema = t.Object({
  id: t.String(),
  start_date: t.String(),
  end_date: t.String(),
  is_all_day: t.Boolean(),
  property_id: t.String(),
  agent_id: t.String(),
  client_id: t.Optional(t.String()),
  created_by: t.Optional(t.String()),
  created_at: t.String(),
  extras: t.Record(t.String(), t.Any()),
});

export interface AppointmentResponseProps {
  id: string;
  start_date: string;
  end_date: string;
  is_all_day: boolean;
  property_id: string;
  agent_id: string;
  status: string;
  client_id?: string;
  created_by?: string;
  created_at: string;
  extras: Record<string, any>;
}

export class AppointmentResponse {
  id: string;
  constructor(props: Appointment) {
    const response: AppointmentResponseProps = {
      id: props.id,
      start_date: props.startDate.toISOString(),
      end_date: props.endDate.toISOString(),
      is_all_day: props.isAllDay,
      property_id: props.propertyId,
      agent_id: props.agentId,
      status: props.status,
      client_id: props.clientId,
      created_by: props.createdBy,
      created_at: props.createdAt.toISOString(),
      extras: props.extras ?? {},
    };

    return response;
  }
}
