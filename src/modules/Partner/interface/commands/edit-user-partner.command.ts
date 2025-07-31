import { BaseCommand, BaseCommandHandler, BaseQuery, BaseQueryHandler, CommandProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { UserRoleEnum } from "@/core/enums/enums";
import { Metadata } from "@/core/types";
import { User } from "@/modules/auth/infrastructure/entities";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";

export class EditUserPartnerQuery extends BaseQuery {
  id: string;
  first_name?: string;
  last_name?: string;
  role?: UserRoleEnum;
  email?: string;
  phone_number?: string;
  extras?: Metadata;
  companyId: string;


  constructor(props: CommandProps<EditUserPartnerQuery>) {
    super(props);
    this.id = props.id;
    this.role = props.role;
    this.first_name = props.first_name;
    this.email = props.email;
    this.last_name = props.last_name;
    this.phone_number = props.phone_number;
    this.extras = {};
    this.companyId = props.companyId;
  }
}

export class EditUserPartnerQueryHandler extends BaseQueryHandler<EditUserPartnerQuery, User | null> {
  async execute(command: EditUserPartnerQuery): Promise<User | null> {
    const repository = UserRepository.getInstance();

    console.log('\n command =>', command)

    const user = (command.id) ? await repository.existsWhithoutIsActive({ id: command.id }, true) : null;
    console.log('user exist => ', user)


    if (!user) {
      throw new BaseError({
        message: "User not found",
        statusCode: 404,
      });
    }

    const updateData: Partial<User> = {};

    if (command.first_name !== undefined) updateData.first_name = command.first_name;
    if (command.last_name !== undefined) updateData.last_name = command.last_name;
    if (command.role !== undefined) updateData.role = command.role;
    if (command.email !== undefined) updateData.email = command.email;
    if (command.phone_number !== undefined) updateData.phone_number = command.phone_number;
    if (command.extras !== undefined) updateData.extras = command.extras;
    if (command.companyId !== undefined) updateData.companyId = command.companyId;

    return await repository.update(command.id, updateData);
  }
}


