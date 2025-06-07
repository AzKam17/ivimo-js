import { BaseEntity } from "@/core/infrastructure/entities/BaseEntity";
import { Entity, Column, Index } from "typeorm";
import type { Metadata } from "@/core/types";

@Entity({ name: "property-type" })
export class PropertyType extends BaseEntity {
  @Column("varchar")
  name: string;

  @Column({ name: "extras", type: "json" })
  extras: Metadata;

  static create(props: Partial<PropertyType>): PropertyType {
    const user = new PropertyType();
    Object.assign(user, props);
    return user;
  }
}
