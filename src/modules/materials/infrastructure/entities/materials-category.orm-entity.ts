import type { Metadata } from "@/core/types";
import { Entity, Column } from "typeorm";
import { BaseEntity } from "@/core/infrastructure/entities/BaseEntity";

@Entity({ name: "materials-category" })
export class MaterialsCategory extends BaseEntity {
  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  slug: string;

  @Column({ type: "varchar", nullable: true })
  image: string;

  @Column({ type: "varchar", nullable: true })
  icon: string;

  @Column({ name: "extras", type: "json" })
  extras: Metadata;

  static create(props: Partial<MaterialsCategory>): MaterialsCategory {
    const o = new MaterialsCategory();
    Object.assign(o, props);
    return o;
  }
}
