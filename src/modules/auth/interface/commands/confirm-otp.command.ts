import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { RedisClient } from "bun";

export class ConfirmOtpCommand extends BaseCommand {
  phone_number: string;
  code: string;

  constructor(props: CommandProps<ConfirmOtpCommand>) {
    super(props);
    this.phone_number = props.phone_number;
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
      phone_number: command.phone_number,
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
