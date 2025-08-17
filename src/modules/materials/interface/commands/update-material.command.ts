import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { Materials } from "@/modules/materials/infrastructure/entities";
import { MaterialsRepository, MaterialsCategoryRepository } from "@/modules/materials/infrastructure/repositories";
import type { Metadata } from "@/core/types";
import { FileUtilityPort, FileUtilityAdapter } from "@/core/infrastructure/file";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { MemberAbilityFactory } from "@/core/infrastructure/services/access-control/member-ability.factory";
import { formatImages, Guard } from "@/core/utils";

export class UpdateMaterialCommand extends BaseCommand {
  id: string;
  supplier_id: string;
  name?: string;
  price?: string | number;
  description?: string;
  has_stock?: boolean;
  quantity_in_stock?: string | number;
  images?: File[];
  category_slug?: string;
  extras?: Metadata;

  constructor(props: CommandProps<UpdateMaterialCommand>) {
    super(props);
    this.id = props.id;
    this.supplier_id = props.supplier_id;
    this.name = props.name;
    this.price = props.price;
    this.description = props.description;
    this.has_stock = props.has_stock;
    this.quantity_in_stock = props.quantity_in_stock;
    this.images = props.images;
    this.category_slug = props.category_slug;
    this.extras = props.extras || {};
  }
}

export class UpdateMaterialCommandHandler extends BaseCommandHandler<UpdateMaterialCommand, Materials> {
  async execute(command: UpdateMaterialCommand): Promise<Materials> {
    const repository = MaterialsRepository.getInstance();
    const userRepository = UserRepository.getInstance();
    const fileUtility: FileUtilityPort = new FileUtilityAdapter();
    const categoryRepository = MaterialsCategoryRepository.getInstance();

    const user = await userRepository.findOneBy({ id: command.supplier_id }, true);
    const material = await repository.findOneBy({ id: command.id }, true);

    const ability = await MemberAbilityFactory.getInstance().getAbilities(user);
    if (ability.cannot("update", material)) {
      throw new BaseError({
        statusCode: 403,
        message: "You do not have permission to update this material",
      });
    }

    const category = await categoryRepository.findOneBy({ slug: command.category_slug }, true);

    const { correlationId, id, supplier_id, ...rest } = command;
    let payload: Partial<Materials> = {
      ...material,
      ...rest,
      price: command.price ? Number(command.price) : undefined,
      quantity_in_stock: command.quantity_in_stock ? Number(command.quantity_in_stock) : undefined,
      category_slug: category.slug,
      images: [],
    };

    const images = formatImages(command.images);
    if (!Guard.isEmpty(images)) {
      payload.images = await Promise.all(
        images.filter((image) => !!image).map((image) => fileUtility.uploadFile(image))
      );
    }

    return (await repository.update(material.id, payload)) as Materials;
  }
}
