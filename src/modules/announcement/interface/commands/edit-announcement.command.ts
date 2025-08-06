import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { User } from "@/modules/auth/infrastructure/entities";
import { Announcement } from "../../infrastructure/entities";
import { AnnouncementRepository } from "../../infrastructure/repositories";

export class EditAnnouncementQuery extends BaseQuery {
  user: User;
  id: string;
  announcementObject: any;
  
    // id: string;
    // title: string;
    // description: string;
    // status: AnnouncementStatus;
    // type: AnnouncementType;
    // target: AnnouncementTarget;
    // price: Double;
    // expiryDate: Date;


  constructor(props: QueryProps<EditAnnouncementQuery>) {
    super(props);
    this.user = props.user;
    this.id = props.id;
    this.announcementObject = props.announcementObject;
    // this.id = props.id;
    // this.title = props.title;
    // this.description = props.description;
    // this.status = props.status;
    // this.type = props.type;
    // this.target = props.target;
    // this.price = props.price;
    // this.expiryDate = props.expiryDate;
    
  }
}

export class EditAnnouncementQueryHandler extends BaseQueryHandler<EditAnnouncementQuery, Announcement | null> {
  async execute(query: EditAnnouncementQuery): Promise<Announcement | null> {
    const repository = AnnouncementRepository.getInstance();
    query.announcementObject.id = query.id;

    const announcement = await repository.updateAnnouncement(query.announcementObject)

    if (!announcement) {
      throw new BaseError({
        message: "error update",
        statusCode: 400,
      });
    }

    return announcement;
  }
}


