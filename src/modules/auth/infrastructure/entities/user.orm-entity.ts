import { UserRoleEnum } from "@/core/enums/enums";
import { BaseEntity } from "@/core/infrastructure/entities/BaseEntity";
import { Entity, Column } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @Column('varchar')
  first_name: string;
  
  @Column('varchar')
  last_name: string;
  
  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar', {name: 'role', default: UserRoleEnum.USER})
  role: UserRoleEnum;
  
  @Column('varchar', { length: 10 })
  phone_number: string;
  
  @Column('varchar')
  password: string;

  static create(props: Partial<User>): User {
    const user = new User();
    Object.assign(user, props);
    user.role = UserRoleEnum.USER;
    return user;
  }
}