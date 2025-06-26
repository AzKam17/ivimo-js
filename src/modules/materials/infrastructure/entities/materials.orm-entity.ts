import { MoneyTransformer } from "@/core/infrastructure/database";
import type { Metadata } from "@/core/types";
import { Entity, Column } from "typeorm";
import { BaseEntity } from "@/core/infrastructure/entities/BaseEntity";

@Entity({ name: "materials" })
export class Materials extends BaseEntity {

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "bigint", transformer: new MoneyTransformer() })
  price: number;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "boolean", default: true })
  has_stock?: boolean;

  @Column({ type: "integer", nullable: true })
  quantity_in_stock?: number;

  @Column({ name: "images", type: "varchar", nullable: true, array: true })
  images?: string[];

  @Column({ name: "supplier_id", type: "varchar", nullable: true })
  supplier_id: string;
  
  @Column({ type: "varchar", nullable: false })
  category_slug: string;

  @Column({ name: "extras", type: "json" })
  extras: Metadata;

  static create(props: Partial<Materials>): Materials {
    const o = new Materials();
    Object.assign(o, props);
    return o;
  }
}
