import { MoneyTransformer } from "@/core/infrastructure/database";
import type { Metadata } from "@/core/types";
import { Entity, Column } from "typeorm";
import { BaseEntity } from "@/core/infrastructure/entities/BaseEntity";
import { MaterialOrderStatus } from "@/core/enums/enums";

export class MaterialsOrderItem {
  materialId: string;
  amount: number;
  quantity: number;

  static create(props: Partial<MaterialsOrderItem>): MaterialsOrderItem {
    const o = new MaterialsOrderItem();
    Object.assign(o, props);
    return o;
  }
}

@Entity({ name: "materials-order" })
export class MaterialsOrder extends BaseEntity {
  @Column({ name: "client_name", type: "varchar", nullable: true })
  clientName: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  slug: string;

  @Column({
    name: "amount",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: false,
    transformer: new MoneyTransformer(),
  })
  amount: number;

  @Column({ name: "items", type: "jsonb", nullable: false })
  items: MaterialsOrderItem[];

  @Column({ type: "enum", enum: MaterialOrderStatus, nullable: false, default: MaterialOrderStatus.PENDING })
  status: string;

  @Column({ name: "supplier_id", type: "varchar", nullable: false })
  supplier_id: string;

  @Column({ name: "extras", type: "json" })
  extras: Metadata;

  static create(props: Partial<MaterialsOrder>): MaterialsOrder {
    const o = new MaterialsOrder();
    Object.assign(o, props);
    return o;
  }
}
