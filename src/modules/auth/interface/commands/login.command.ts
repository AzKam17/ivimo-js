import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import { randomOTP } from "@/core/utils";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { RedisClient } from "bun";

export class LoginCommand extends BaseCommand {
  email: string;
  password: string;

  constructor(props: CommandProps<LoginCommand>) {
    super(props);
    this.email = props.email;
    this.password = props.password;
  }
}

export class LoginCommandHandler extends BaseCommandHandler<LoginCommand, boolean> {
  private readonly redis: RedisClient;

  constructor(redis: RedisClient) {
    super();
    this.redis = redis;
  }

  async execute(command: LoginCommand): Promise<boolean> {
    const repository = UserRepository.getInstance();

    const user = await repository.findOneBy({
        email:command.email
    });

    if(user) {
        const isPasswordValid = Bun.password.verify(command.password, user.password);
        if(!isPasswordValid) {
            return Promise.resolve(false);
        }

        const otp = randomOTP();
        this.redis.set(user.id, otp);
        this.redis.expire(user.id, 60);
        return Promise.resolve(true);
    }
    
    return Promise.resolve(false);
  }
}
