import { BaseEntity } from "@/core/infrastructure/entities/BaseEntity";
import type { Metadata } from "@/core/types";
import { Column, Entity } from "typeorm";

@Entity({ name: "appointment" })
export class Appointment extends BaseEntity {
  @Column({ name: "start_date" })
  startDate: Date;

  @Column({ name: "end_date" })
  endDate: Date;

  @Column("varchar", { name: "is_all_day", nullable: true })
  isAllDay: boolean;

  @Column("varchar", { name: "property_id" })
  propertyId: string;

  @Column("varchar", { name: "agent_id" })
  agentId: string;

  @Column("varchar", { name: "client_id", nullable: true })
  clientId: string;

  @Column("varchar", { name: "created_by", nullable: true })
  createdBy: string;
  
  @Column({ name: "extras", type: "json", default: {} })
  extras: Metadata;

  static create(props: Partial<Appointment>): Appointment {
    const appointment = new Appointment();
    Object.assign(appointment, props);
    return appointment;
  }
}
