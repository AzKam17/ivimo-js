import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { Materials } from "@/modules/materials/infrastructure/entities";
import { MaterialsRepository, MaterialsCategoryRepository } from "@/modules/materials/infrastructure/repositories";
import type { Metadata } from "@/core/types";
import { FileUtilityPort, FileUtilityAdapter } from "@/core/infrastructure/file";
import { AnnouncementRepository } from "../../infrastructure/repositories";
import { Announcement } from "../../infrastructure/entities";
import { PropertyRepository } from "@/modules/property/infrastructure/repositories";
import { User } from "@/modules/auth/infrastructure/entities";

export class CreateAnnouncementCommand extends BaseCommand {
  user: User;
  announcementObject: any;
  

  constructor(props: CommandProps<CreateAnnouncementCommand>) {
    super(props);
    this.user = props.user;
    this.announcementObject = Announcement.create(props.announcementObject);
  }
}

export class CreateAnnouncementCommandHandler extends BaseCommandHandler<CreateAnnouncementCommand, Announcement> {
  async execute(command: CreateAnnouncementCommand): Promise<Announcement> {
    const repositoryAnnounce = AnnouncementRepository.getInstance();
    const repositoryProperty = PropertyRepository.getInstance();

    const property = await repositoryProperty.findByIdAndCompanyId(command.announcementObject.propertyId, command.user.companyId);

    if (!property) {
      throw new BaseError({
        message: "not found property",
        statusCode: 400
      })
    }

    // const announcement: Announcement = command.announcementObject;
    command.announcementObject.propertyId = property.id;
    command.announcementObject.createdBy = command.user.id;
    command.announcementObject.companyId = command.user.companyId;

    return await repositoryAnnounce.createAnnouncement(command.announcementObject);
  }
}
