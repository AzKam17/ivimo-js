import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import { MaterialsRepository } from "@/modules/materials/infrastructure/repositories";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { MemberAbilityFactory } from "@/core/infrastructure/services/access-control/member-ability.factory";
import { BaseError } from "@/core/base/errors";

export class DeleteMaterialCommand extends BaseCommand {
  id: string;
  supplier_id: string;

  constructor(props: CommandProps<DeleteMaterialCommand>) {
    super(props);
    this.id = props.id;
    this.supplier_id = props.supplier_id;
  }
}

export class DeleteMaterialCommandHandler extends BaseCommandHandler<DeleteMaterialCommand, boolean> {
  async execute(command: DeleteMaterialCommand): Promise<boolean> {
    const repository = MaterialsRepository.getInstance();
    const userRepository = UserRepository.getInstance();

    const user = await userRepository.findOneBy({ id: command.supplier_id }, true);
    const material = await repository.findOneBy({ id: command.id }, true);

    const ability = await MemberAbilityFactory.getInstance().getAbilities(user);

    if (ability.cannot('remove', material)) {
      throw new BaseError({
        statusCode: 403,
        message: "You are not authorized to delete this material",
      });
    }

    await repository.delete(material.id);
    
    return true;
  }
}