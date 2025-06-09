import { BaseEntity } from "@/core/infrastructure/entities/BaseEntity";
import { Column, Entity } from "typeorm";

@Entity({ name: "company" })
export class Company extends BaseEntity {
  @Column("varchar")
  name: string;

  @Column("varchar", {nullable: true})
  address?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column("varchar", {name: 'created_by'})
  createdBy: string;

  @Column("varchar", {name: 'owned_by'})
  ownedBy: string;

  static create(props: Partial<Company>): Company {
    const comp = new Company();
    Object.assign(comp, props);
    return comp;
  }
}