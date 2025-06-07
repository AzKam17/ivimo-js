import { ColumnNumericTransformer } from "@/core/infrastructure/database";
import { BaseEntity } from "@/core/infrastructure/entities/BaseEntity";
import type { Geometry } from "geojson";
import { Entity, Column, Index } from "typeorm";
import type { Metadata } from "@/core/types";

@Entity({ name: "property" })
export class Property extends BaseEntity {
  @Column("varchar")
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "bigint", transformer: new ColumnNumericTransformer() })
  price: number;

  @Column("varchar", { nullable: true })
  address?: string;

  @Column({ name: "main_image", type: "varchar", nullable: true })
  mainImage?: string;

  @Column({ name: "images", type: "json", nullable: true })
  images?: string[];

  @Column("geometry", {
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: true,
  })
  @Index({ spatial: true })
  geolocation?: Geometry;

  @Column({ name: "created_by", type: "varchar" })
  createdBy: string;

  @Column({ name: "extras", type: "json" })
  extras: Metadata;

  static create(props: Partial<Property>): Property {
    const user = new Property();
    Object.assign(user, props);
    return user;
  }
}
