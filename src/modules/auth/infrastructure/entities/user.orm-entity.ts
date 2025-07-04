import { UserRoleEnum } from "@/core/enums/enums";
import { BaseEntity } from "@/core/infrastructure/entities/BaseEntity";
import type { Metadata } from "@/core/types";
import { Entity, Column } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @Column('varchar')
  first_name: string;
  
  @Column('varchar')
  last_name: string;
  
  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar', {name: 'role', default: UserRoleEnum.CLIENT})
  role: UserRoleEnum;
  
  @Column('varchar', { length: 10 })
  phone_number: string;
  
  @Column('varchar')
  password: string;
  
  @Column({ name: "extras", type: "json", default: {} })
  extras: Metadata;

  static create(props: Partial<User>): User {
    const user = new User();
    user.role = UserRoleEnum.CLIENT;
    Object.assign(user, props);
    return user;
  }
}