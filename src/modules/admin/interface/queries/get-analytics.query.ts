import { BaseQuery, BaseQueryHandler, QueryProps } from "@/core/base/classes";
import { UserRoleEnum } from "@/core/enums/enums";
import type { UserRoleEnumWithoutAdmin } from "@/core/enums/enums";
import type { Metadata } from "@/core/types";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { RedisClient } from "bun";

export class GetAnalyticsQuery extends BaseQuery {
  user_id: any;
  role: UserRoleEnum;

  constructor(props: QueryProps<GetAnalyticsQuery>) {
    super(props);
    this.role = props.role;
    this.user_id = props.user_id;
  }
}

export class GetAnalyticsQueryHandler extends BaseQueryHandler<GetAnalyticsQuery, Metadata> {
  private readonly redis: RedisClient;

  constructor(redis: RedisClient) {
    super();
    this.redis = redis;
  }

  async execute(query: GetAnalyticsQuery): Promise<Metadata> {
    const userRepository = UserRepository.getInstance();

    // if found in redis return
    const cachedData = await this.redis.get(`admin:analytics:${query.user_id}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    console.log(query.role);
    let response: Metadata = {};
    switch (query.role) {
      case UserRoleEnum.ADMIN:
        response = {
          total_users: {
            label: "Utilisateurs",
            value: await userRepository.countAll()
          },
        };
        break;
      default:
        response = {};
    }

    return response;
  }
}
