import { IQuery, IQueryHandler } from "elysia-cqrs";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { User } from "../../infrastructure/entities/user.orm-entity";
import { RedisClient } from "bun";

export class GetUserQuery extends IQuery {
  constructor(public readonly userId?: string) {
    super();
  }
}

export class GetUserQueryHandler
  implements IQueryHandler<GetUserQuery, Promise<User[]>>
{
  private readonly redis: RedisClient;

  constructor(redis: RedisClient) {
    this.redis = redis;
    this.execute = this.execute.bind(this);
  }
  
  async execute(query: GetUserQuery) {
    this.redis.set("key", "value");
    this.redis.expire("key", 60);
    
    const repository = UserRepository.getInstance();
    return repository.findAll();
  }
}
