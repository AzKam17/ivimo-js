import { BaseEntity } from "@/core/infrastructure/entities/BaseEntity";
import { Column, Entity } from "typeorm";

@Entity({ name: "agent" })
export class Agent extends BaseEntity {
  @Column("varchar", {name: 'user_id'})
  userId: string;

  @Column("varchar", {name: 'company_id'})
  companyId: string;

  @Column("varchar", {name: 'created_by'})
  createdBy: string;

  static create(props: Partial<Agent>): Agent {
    const agent = new Agent();
    Object.assign(agent, props);
    return agent;
  }
}