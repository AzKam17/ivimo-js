import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/interface";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { RedisClient } from "bun";

export class ConfirmOtpCommand extends BaseCommand {
  email: string;
  code: string;

  constructor(props: CommandProps<ConfirmOtpCommand>) {
    super(props);
    this.email = props.email;
    this.code = props.code;
  }
}

export class ConfirmOtpCommandHandler extends BaseCommandHandler<ConfirmOtpCommand, boolean> {
  private readonly redis: RedisClient;

  constructor(redis: RedisClient) {
    super();
    this.redis = redis;
  }

  async execute(command: ConfirmOtpCommand): Promise<boolean> {
    const repository = UserRepository.getInstance();

    const user = await repository.findOneBy({
        email:command.email
    });

    if (user) {
      const otp = await this.redis.get(user.id);

      if (otp === command.code) {
        await this.redis.del(user.id);
        return Promise.resolve(true);
      }
    }

    return Promise.resolve(false);
  }
}
