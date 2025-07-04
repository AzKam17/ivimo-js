import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { Materials } from "@/modules/materials/infrastructure/entities";
import { MaterialsRepository, MaterialsCategoryRepository } from "@/modules/materials/infrastructure/repositories";
import type { Metadata } from "@/core/types";
import { FileUtilityPort, FileUtilityAdapter } from "@/core/infrastructure/file";

export class CreateMaterialCommand extends BaseCommand {
  name: string;
  price: string | number;
  description?: string;
  has_stock?: boolean;
  quantity_in_stock?: string | number;
  images?: File[];
  supplier_id: string;
  category_slug: string;
  extras?: Metadata;

  constructor(props: CommandProps<CreateMaterialCommand>) {
    super(props);
    this.name = props.name;
    this.price = props.price;
    this.description = props.description;
    this.has_stock = props.has_stock;
    this.quantity_in_stock = props.quantity_in_stock;
    this.images = props.images;
    this.supplier_id = props.supplier_id;
    this.category_slug = props.category_slug;
    this.extras = props.extras || {};
  }
}

export class CreateMaterialCommandHandler extends BaseCommandHandler<CreateMaterialCommand, Materials> {
  async execute(command: CreateMaterialCommand): Promise<Materials> {
    const repository = MaterialsRepository.getInstance();
    const fileUtility: FileUtilityPort = new FileUtilityAdapter();
    const categoryRepository = MaterialsCategoryRepository.getInstance();

    // Check if category exists
    const categoryExists = await categoryRepository.findOneBy({ slug: command.category_slug });
    if (!categoryExists) {
      throw new BaseError({
        statusCode: 404,
        message: "Materials category not found",
      });
    }

    const images = command.images
      ? await Promise.all(command.images.map((image) => fileUtility.uploadFile(image)))
      : [];

    // Create the material
    const material = Materials.create({
      images,
      name: command.name,
      price: typeof command.price === "string" ? parseFloat(command.price) : command.price,
      description: command.description,
      has_stock: command.has_stock,
      quantity_in_stock: typeof command.quantity_in_stock === "string" ? parseInt(command.quantity_in_stock) : command.quantity_in_stock,
      supplier_id: command.supplier_id,
      category_slug: command.category_slug,
      extras: command.extras,
    });

    // Save the material
    return await repository.save(material);
  }
}
