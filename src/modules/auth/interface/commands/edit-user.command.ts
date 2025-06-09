import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { UserRoleEnum } from "@/core/enums/enums";
import { User } from "@/modules/auth/infrastructure/entities";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";

export class EditUserCommand extends BaseCommand {
  id: string;
  first_name?: string;
  last_name?: string;
  role?: UserRoleEnum;
  email?: string;
  phone_number?: string;
  password?: string;

  constructor(props: CommandProps<EditUserCommand>) {
    super(props);
    this.id = props.id;
    this.role = props.role;
    this.first_name = props.first_name;
    this.last_name = props.last_name;
    this.email = props.email;
    this.phone_number = props.phone_number;
    this.password = props.password;
  }
}

export class EditUserCommandHandler extends BaseCommandHandler<EditUserCommand, User> {
  async execute(command: EditUserCommand): Promise<User> {
    console.log(command)
    const repository = UserRepository.getInstance();

    await repository.exists({ id: command.id }, true);

    const updateData: Partial<User> = {};
    
    if (command.first_name !== undefined) updateData.first_name = command.first_name;
    if (command.last_name !== undefined) updateData.last_name = command.last_name;
    if (command.role !== undefined) updateData.role = command.role;
    if (command.email !== undefined) updateData.email = command.email;
    if (command.phone_number !== undefined) updateData.phone_number = command.phone_number;
    if (command.password !== undefined) updateData.password = Bun.password.hashSync(command.password);
    
    return await repository.update(command.id, updateData) as User;
  }
}
