import { BaseQuery, CommandProps, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { User } from "@/modules/auth/infrastructure/entities";
import { AnnouncementRepository } from "../../infrastructure/repositories";
import { Announcement } from "../../infrastructure/entities";


export class ActiveAnnouncementQuery extends BaseQuery {
  id: string;
  user: User;
  constructor(props: QueryProps<ActiveAnnouncementQuery>) {
    super(props);
    this.id = props.id;
    this.user = props.user;
  }
}

export class ActiveAnnouncementQueryHandler extends BaseQueryHandler<ActiveAnnouncementQuery, Announcement> {
  async execute(query: ActiveAnnouncementQuery): Promise<Announcement> {
    const repository = AnnouncementRepository.getInstance();

    const announcement = await repository.activeAnnouncement(query.id);

    if (!announcement) {
      throw new BaseError({
        message: "error Active ",
        statusCode: 400,
      });
    }

    return announcement;   
  }
}