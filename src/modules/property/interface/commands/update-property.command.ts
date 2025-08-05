import { BaseCommand, BaseCommandHandler, BaseQuery, BaseQueryHandler, CommandProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import type { PropertyType } from "@/core/enums/enums";
import { PropertyAdTypeEnum } from "@/core/enums/enums";
import { FileUtilityAdapter, FileUtilityPort } from "@/core/infrastructure/file";
import { IGeometry } from "@/core/interface";
import { Metadata } from "@/core/types";
import { Property } from "@/modules/property/infrastructure/entities";
import { PropertyRepository } from "@/modules/property/infrastructure/repositories";

export class UpdatePropertyQuery extends BaseQuery {
  id: string;
  name: string;
  price: number;
  ad_type: PropertyAdTypeEnum;
  type: string;
  geolocation: IGeometry;
  description?: string;
  address?: string;
  main_image: File;
  images?: File[];
  extras?: Metadata;
  createdBy?: string;
  companyId: string;

  constructor(props: CommandProps<UpdatePropertyQuery>) {
    super(props);
    this.id = props.id;
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
    this.companyId = props.companyId;
  }
}

export class UpdatePropertyQueryHandler extends BaseQueryHandler<UpdatePropertyQuery, Property | null> {
  async execute(command: UpdatePropertyQuery): Promise<Property | null> {
    const repository = PropertyRepository.getInstance();
    const fileUtility: FileUtilityPort = new FileUtilityAdapter();

    let update = await repository.findByIdAndCompanyId(command.id, command.companyId);

    // not find exception
    if (!update) {
      throw new BaseError({
        message: "User not found",
        statusCode: 404,
      });
    }


    const mainImage = command.main_image ? await fileUtility.uploadFile(command.main_image) : null;

    const images = command.images
      ? await Promise.all(command.images.map((image) => fileUtility.uploadFile(image)))
      : null;

    // update.id = command.id;
    update.name = command.name ?? update.name;

    update.price = command.price ?? update.price;
    update.adType = command.ad_type ?? update.adType;
    update.type = (command.type as PropertyType) ?? update.type;
    update.description = command.description ?? update.description;
    update.address = command.address ?? update.address;
    update.extras = command.extras ?? update.extras;
    // update.createdBy = update.createdBy ?? command.createdBy;
    // update.ownedBy = update.ownedBy  ?? command.createdBy;
    update.mainImage = mainImage ?? update.mainImage;
    update.images = images ?? update.images;
    // @ts-ignore
    update.geolocation = command.geolocation ?? update.geolocation;
    // update.companyId = command.companyId ?? update.companyId;


    const savedProperty = await repository.update(command.id, update);

    return savedProperty;
  }
}
