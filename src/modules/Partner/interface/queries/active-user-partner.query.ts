import { BaseQuery, CommandProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { User } from "@/modules/auth/infrastructure/entities";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { ActiveUserQueryHandler } from "@/modules/auth/interface/queries";


export class ActiveUserPartnerQuery extends BaseQuery {
  id: string;
  constructor(props: CommandProps<ActiveUserPartnerQuery>) {
    super(props);
    this.id = props.id;
  }
}

export class ActiveUserPartnerQueryHandler extends ActiveUserQueryHandler {
  // async execute(query: ActiveUserPartnerQuery): Promise<User> {
  //   const repository = UserRepository.getInstance();
  //   console.log('\n id actif => ', query.id)
  //   const user = await repository.findOneByWhithoutParamIsActive({id: query.id}, true);

  //   if (!user) {
  //     throw new BaseError({
  //       message: "User not found",
  //       statusCode: 404,
  //     });
  //   }

  //   user.isActive = true;

  //   const updatedUser = await repository.update(user.id, user);
    
  //   if (!updatedUser) {
  //     throw new BaseError({
  //       message: "Failed to update user",
  //       statusCode: 500,
  //     });
  //   }
  //   return updatedUser;
  // }
}