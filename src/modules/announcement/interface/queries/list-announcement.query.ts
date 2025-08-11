import { NON_ADMIN_NON_SUPPLIER_ROLES } from '../../../../core/enums/enums';
import { BaseQuery, CommandProps, BaseQueryHandler } from "@/core/base/classes";
import { User } from "@/modules/auth/infrastructure/entities";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { AnnouncementRepository } from '../../infrastructure/repositories';
import { Announcement } from '../../infrastructure/entities';


export class ListAnnouncementQuery extends BaseQuery {
  params?: any;
  currentUser: User;
  constructor(props: CommandProps<ListAnnouncementQuery>) {
    super(props);
    this.params = props.params;
    this.currentUser = props.currentUser;
  }
}

export class ListAnnouncementQueryHandler extends BaseQueryHandler<ListAnnouncementQuery, { item: Announcement[]; total: number; page: number; pageCount: number }> {
  async execute(query: ListAnnouncementQuery): Promise<{ item: Announcement[]; total: number; page: number; pageCount: number }> {
    const repository = AnnouncementRepository.getInstance();
    const result = await repository.findAllByPaginate({
      companyId: query.currentUser.companyId,
      limit: query.params?.limit,
      page: query.params?.page
    });

    console.log('\nresult => ', result)

    return {
      ...result,
      pageCount: result.pageCount !== undefined ? result.pageCount : 0
    };

  }

}