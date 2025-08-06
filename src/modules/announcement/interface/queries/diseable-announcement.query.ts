import { AnnouncementRepository } from './../../infrastructure/repositories/announcement.repository';
import { BaseQuery, QueryProps, BaseQueryHandler } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { User } from "@/modules/auth/infrastructure/entities";
import { Announcement } from "../../infrastructure/entities";

export class DiseableAnnouncementQuery extends BaseQuery {
  id: string;
  user: User;
  constructor(props: QueryProps<DiseableAnnouncementQuery>) {
    super(props);
    this.id = props.id;
    this.user = props.user;
  }
}

export class DiseableAnnouncementQueryHandler extends BaseQueryHandler<DiseableAnnouncementQuery, Announcement> {
  async execute(query: DiseableAnnouncementQuery): Promise<Announcement> {
    const repository = AnnouncementRepository.getInstance();

    console.log('id announcement =>', query)

    const announcement = await repository.diseableAnnouncement(query.id);

    if (!announcement) {
      throw new BaseError({
        message: "error diseable ",
        statusCode: 400,
      });
    }


    return announcement as Announcement;   
  }
}