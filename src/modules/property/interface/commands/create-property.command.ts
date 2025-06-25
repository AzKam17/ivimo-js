import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import type { PropertyType } from "@/core/enums/enums";
import { PropertyAdTypeEnum } from "@/core/enums/enums";
import { FileUtilityAdapter, FileUtilityPort } from "@/core/infrastructure/file";
import { IGeometry } from "@/core/interface";
import { Property } from "@/modules/property/infrastructure/entities";
import { PropertyRepository } from "@/modules/property/infrastructure/repositories";

export class CreatePropertyCommand extends BaseCommand {
  name: string;
  price: number;
  ad_type: PropertyAdTypeEnum;
  type: string;
  geolocation: IGeometry;
  description?: string;
  address?: string;
  main_image: File;
  images?: File[];
  extras?: Record<string, any>;
  createdBy?: string;

  constructor(props: CommandProps<CreatePropertyCommand>) {
    super(props);
    this.name = props.name;
    this.price = props.price;
    this.ad_type = props.ad_type;
    this.type = props.type;
    this.geolocation = props.geolocation;
    this.description = props.description;
    this.address = props.address;
    this.main_image = props.main_image;
    this.images = props.images;
    this.extras = props.extras;
    this.createdBy = props.createdBy;
  }
}

export class CreatePropertyCommandHandler extends BaseCommandHandler<CreatePropertyCommand, Property> {
  async execute(command: CreatePropertyCommand): Promise<Property> {
    const repository = PropertyRepository.getInstance();
    const fileUtility: FileUtilityPort = new FileUtilityAdapter();
    const mainImage = await fileUtility.uploadFile(command.main_image);

    const images = command.images
      ? await Promise.all(command.images.map((image) => fileUtility.uploadFile(image)))
      : [];

    const property = Property.create({
      name: command.name,
      price: command.price,
      adType: command.ad_type,
      type: command.type as PropertyType,
      description: command.description,
      address: command.address,
      extras: command.extras,
      createdBy: command.createdBy,
      ownedBy: command.createdBy,
      mainImage,
      images,
      // @ts-ignore
      geolocation: command.geolocation,
    });

    const savedProperty = await repository.create(property);

    return property;
  }
}
