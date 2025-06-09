import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import { PropertyRepository } from "@/modules/property/infrastructure/repositories";
import { RedisClient } from "bun";

export class IncreasePropertyViewsCommand extends BaseCommand {
  id: string;
  ip: string;

  constructor(props: CommandProps<IncreasePropertyViewsCommand>) {
    super(props);
    this.id = props.id;
    this.ip = props.ip;
  }
}

export class IncreasePropertyViewsCommandHandler extends BaseCommandHandler<IncreasePropertyViewsCommand, boolean> {
  private readonly redis: RedisClient;

  constructor(redis: RedisClient) {
    super();
    this.redis = redis;
  }

  async execute(command: IncreasePropertyViewsCommand): Promise<boolean> {
    const { id, ip } = command;
    const key = `property-views:${id}:views`;
    const repository = PropertyRepository.getInstance();

    if (await this.redis.get(key)) {
      return true;
    }
    
    this.redis.set(key, '@');
    this.redis.expire(key, 60 * 60 * 1.5);

    return await repository.increaseViews(id);
  }
}
