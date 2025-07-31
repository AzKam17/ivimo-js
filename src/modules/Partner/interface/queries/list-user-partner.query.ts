import { UserRoleEnum, UserRoleEnumWithoutAdminAndFournisseurAndClient } from './../../../../core/enums/enums';
import { BaseQuery, CommandProps, BaseQueryHandler } from "@/core/base/classes";
import { UserRoleEnumWithoutAdminAndFournisseur } from "@/core/enums/enums";
import { User } from "@/modules/auth/infrastructure/entities";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { SelectQueryBuilder } from 'typeorm';


export class ListUserPartnerQuery extends BaseQuery {
  companyId: string;
  params?: any;
  currentUser?: User;
  constructor(props: CommandProps<ListUserPartnerQuery>) {
    super(props);
    this.companyId = props.companyId;
    this.params = props.params;
    this.params.roles = props.params.roles ? this.convertStringToArray(props.params.roles) : [];
    this.currentUser = props.currentUser;
  }

  convertStringToArray(value: string): string[] {
    const val = value.split(',') as string[] | [];
    console.log('\n val => ', val)
    return val
  }

}

export class ListUserPartnerQueryHandler extends BaseQueryHandler<ListUserPartnerQuery, { data: User[]; total: number; page: number; pageCount: number }> {
  async execute(query: ListUserPartnerQuery): Promise<{ data: User[]; total: number; page: number; pageCount: number }> {
    const repository = UserRepository.getInstance();
    console.log('\n roles => ', query.params.roles)

    let list = await this.getPartnerUserByRole({
      companyId: query.companyId,
      roles: query.params.roles.length > 0 ? query.params.roles : UserRoleEnumWithoutAdminAndFournisseurAndClient
    },
      {
        limite: (query.params.limite as number) || 10,
        page: (query.params.page as number) || 1
      });

    list.data = list.data.filter(item => {
      // delete item?.password;
      return item;
    })
    return list;
  }

  public async getPartnerUserByRole(param: { companyId: string, roles: [] }, paginate: { limite: number, page: number }): Promise<{ data: User[]; total: number; page: number; pageCount: number }> {
    const repository = UserRepository.getInstance();
    const page: number = paginate.page;
    const limit: number = paginate.limite;
    const skip = (page - 1) * limit;

    let query: SelectQueryBuilder<User> = repository.getRepositoryDatabase()
      .createQueryBuilder('u_all')
      .select([
        'u_all.id as user_id',
        'u_all.first_name as user_name',
        'u_all.phone_number as phone_number',
        'u_all.created_by as created_by',
        'u_all.role as role',
        'u_all.email as user_email',
        'u_all.company_id as company_id',
        'COALESCE(creation_stats.nb_client, 0) as nb_client'
      ])
      .leftJoin(
        subQuery => {
          return subQuery
            .select([
              'created_by',
              'COUNT(*) as nb_client'
            ])
            .from(User, 'user_sub')
            .where('user_sub.role = :role AND user_sub.created_by IS NOT NULL', { role: 'client' })
            .groupBy('created_by');
        },
        'creation_stats',
        'u_all.id::text = creation_stats.created_by::text'
      )
      .leftJoin(User, 'creator', 'u_all.created_by::text = creator.id::text')
      .where('u_all.company_id = :companyId', { companyId: param.companyId })
      .andWhere('u_all.role IN (:...roles)', { roles: param.roles })
      .orderBy('nb_client', 'DESC')
      .addOrderBy('u_all.first_name', 'ASC');

    // Get total count before pagination
    const total = await query.getCount();

    // Apply pagination
    query = query.limit(limit).offset(skip);

    const data = await query.getRawMany();

    return {
      data,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

}



interface UserStatsParams {
  page?: number;
  limit?: number;
}