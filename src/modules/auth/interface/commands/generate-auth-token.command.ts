import { BaseError } from "@/core/base/errors";
import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import { ACCESS_TOKEN_EXPIRATION_SECONDS, getExpTimestamp } from "@/core/utils";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { JWTOption } from "@elysiajs/jwt";
import { User } from "@/modules/auth/infrastructure/entities";

export interface GenerateAuthTokenCommandResult {
  token: string;
  user: User;
}

export class GenerateAuthTokenCommand extends BaseCommand {
  email: string;
  constructor(props: CommandProps<GenerateAuthTokenCommand>) {
    super(props);
    this.email = props.email;
  }
}

export class GenerateAuthTokenCommandHandler extends BaseCommandHandler<
  GenerateAuthTokenCommand,
  GenerateAuthTokenCommandResult
> {
  private readonly jwt: any;

  constructor(jwt: any) {
    super();
    this.jwt = jwt;
  }
  async execute(command: GenerateAuthTokenCommand): Promise<GenerateAuthTokenCommandResult> {
    const repository = UserRepository.getInstance();

    const user = await repository.findOneBy({
      email: command.email,
    });

    if (!user) {
      throw new BaseError({
        statusCode: 500,
        message: "User not found",
      });
    }

    const token = await this.jwt.sign({
      sub: user.id,
      exp: getExpTimestamp(ACCESS_TOKEN_EXPIRATION_SECONDS),
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
    });

    return { token, user };
  }
}
