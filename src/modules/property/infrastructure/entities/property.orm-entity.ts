import { MoneyTransformer } from "@/core/infrastructure/database";
import { BaseEntity } from "@/core/infrastructure/entities/BaseEntity";
import type { Geometry } from "geojson";
import { Entity, Column, Index } from "typeorm";
import type { Metadata } from "@/core/types";
import { PropertyAdTypeEnum } from "@/core/enums/enums";

@Entity({ name: "property" })
export class Property extends BaseEntity {
  @Column("varchar")
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "bigint", transformer: new MoneyTransformer() })
  price: number;

  @Column("varchar", { nullable: true })
  address?: string;
  
  @Column({ name: 'ad_type', type: 'varchar' })
  adType: PropertyAdTypeEnum;

  @Column({ name: 'type', type: 'varchar', nullable: false})
  type: string;

  @Column({ name: "main_image", type: "varchar", nullable: true })
  mainImage?: string;

  @Column({ name: "images", type: "json", nullable: true })
  images?: string[];

  @Column({ type: "int", default: 0 })
  views: number;

  @Column("geometry", {
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: true,
  })
  @Index({ spatial: true })
  geolocation?: Geometry;

  @Column({ name: "created_by", type: "varchar", nullable: true })
  createdBy: string;

  @Column({ name: "owned_by", type: "varchar", nullable: true })
  ownedBy: string;

  @Column({ name: "extras", type: "json" })
  extras: Metadata;

  static create(props: Partial<Property>): Property {
    const property = new Property();
    Object.assign(property, props);
    property.views = 0;
    return property;
  }
}
