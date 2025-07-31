import { UserRoleEnum } from "@/core/enums/enums";
import { BaseEntity } from "@/core/infrastructure/entities/BaseEntity";
import type { Metadata } from "@/core/types";
import { Entity, Column, IsNull } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @Column('varchar')
  first_name: string;
  
  @Column('varchar')
  last_name: string;
  
  @Column('varchar', { unique: true })
  email: string;


  @Column({ type: "enum", name: 'role', enum: UserRoleEnum, default: UserRoleEnum.CLIENT})
  role: UserRoleEnum;
  
  @Column('varchar', { length: 10 })
  phone_number: string;
  
  @Column('varchar')
  password: string;
  
  @Column({ name: "extras", type: "json", default: {} })
  extras: Metadata;

  @Column("varchar", {name: 'company_id', nullable: true})
  companyId: string;

  @Column("varchar", {name: 'created_by', nullable: true})
  createdBy: string;

  static create(props: Partial<User>): User {
    const user = new User();
    user.role = UserRoleEnum.CLIENT;
    Object.assign(user, props);
    return user;
  }
}