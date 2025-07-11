import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import { User } from "@/modules/auth/infrastructure/entities";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { BaseError } from "@/core/base/errors";
import { UserRoleEnum, type UserRoleEnumWithoutAdmin } from "@/core/enums/enums";
import { Guard } from "@/core/utils";

export class CreateUserCommand extends BaseCommand {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  role?: UserRoleEnumWithoutAdmin;

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.first_name = props.first_name;
    this.last_name = props.last_name;
    this.email = props.email;
    this.phone_number = props.phone_number;
    this.password = props.password;
    this.role = props.role;
  }
}

export class CreateUserCommandHandler implements BaseCommandHandler<CreateUserCommand, User> {
  constructor() {}

  async execute(query: CreateUserCommand): Promise<User> {
    const repository = UserRepository.getInstance();

    const userExists = await repository.exists({
      email: query.email,
    });

    if (userExists) {
      throw new BaseError({
        message: "User already exists",
        statusCode: 404,
      });
    }

    const role = Guard.isEmpty(query.role) ? {role: UserRoleEnum.CLIENT} : {role: query.role};
    
    const user = await repository.save(
      User.create({
        first_name: query.first_name,
        last_name: query.last_name,
        email: query.email,
        phone_number: query.phone_number,
        password: await Bun.password.hash(query.password),
        ...role
      })
    );

    return user;
  }
}
