import { BaseQuery, CommandProps, BaseQueryHandler } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { User } from "@/modules/auth/infrastructure/entities";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";


export class ActiveUserQuery extends BaseQuery {
  id: string;
  constructor(props: CommandProps<ActiveUserQuery>) {
    super(props);
    this.id = props.id;
  }
}

export class ActiveUserQueryHandler extends BaseQueryHandler<ActiveUserQuery, User> {
  async execute(query: ActiveUserQuery): Promise<User> {
    const repository = UserRepository.getInstance();

    const user = await repository.findOneByWhithoutParamIsActive({ id: query.id }, true);

    if (!user) {
      throw new BaseError({
        message: "User not found",
        statusCode: 404,
      });
    }

    user.id = query.id; 
    user.isActive = true; 

    return await repository.save(user) as User;   
  }
}