import { BaseQuery, QueryProps, BaseQueryHandler } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { User } from "@/modules/auth/infrastructure/entities";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";

export class DiseableUserQuery extends BaseQuery {
  id: string;
  isActive?: boolean;
  constructor(props: QueryProps<DiseableUserQuery>) {
    super(props);
    this.id = props.id;
    this.isActive = props.isActive;
  }
}

export class DiseableUserQueryHandler extends BaseQueryHandler<DiseableUserQuery, User> {
  async execute(query: DiseableUserQuery): Promise<User> {
    const repository = UserRepository.getInstance();

    const user = await repository.findOneByWhithoutParamIsActive({ id: query.id }, true);

    if (!user) {
      throw new BaseError({
        message: "User not found",
        statusCode: 404,
      });
    }

    user.id = query.id; 
    user.isActive = false; 

    return await repository.save(user) as User;   
  }
}