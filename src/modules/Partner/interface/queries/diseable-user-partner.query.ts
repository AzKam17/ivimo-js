import { BaseQuery, QueryProps, BaseQueryHandler } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { User } from "@/modules/auth/infrastructure/entities";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { DiseableUserQueryHandler } from "@/modules/auth/interface/queries";

export class DiseableUserPartnerQuery extends BaseQuery {
  id: string;
  isActive?: boolean;
  constructor(props: QueryProps<DiseableUserPartnerQuery>) {
    super(props);
    this.id = props.id;
    this.isActive = props.isActive;
  }
}

export class DiseableUserPartnerQueryHandler extends DiseableUserQueryHandler {
    // async execute(query: DiseableUserPartnerQuery): Promise<User> {
    //   const repository = UserRepository.getInstance();
    //   console.log('\n id actif => ', query.id)
    //   const user = await repository.findOneByWhithoutParamIsActive({id: query.id}, true);
  
    //   if (!user) {
    //     throw new BaseError({
    //       message: "User not found",
    //       statusCode: 404,
    //     });
    //   }
  
    //   user.isActive = false;
  
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