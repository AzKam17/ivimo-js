import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { PropertyRepository } from "@/modules/property/infrastructure/repositories";

export class BookMarkPropertyCommand extends BaseCommand {
  propertyId: string;
  userId: string;

  constructor(props: CommandProps<BookMarkPropertyCommand>) {
    super(props);
    this.propertyId = props.propertyId;
    this.userId = props.userId;
  }
}

export class BookMarkPropertyCommandHandler extends BaseCommandHandler<BookMarkPropertyCommand, boolean> {
  async execute(command: BookMarkPropertyCommand): Promise<boolean> {
    try {
      const { propertyId, userId } = command;
      const propertyRepository = PropertyRepository.getInstance();
      const userRepository = UserRepository.getInstance();

      const user = await userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new BaseError({
          statusCode: 500,
          message: "Unauthorized",
        });
      }

      await propertyRepository.exists({ id: propertyId }, true);

      const bookmarks: Array<string> = (user?.extras?.bookmarks as Array<string>) ?? [];
      if (bookmarks.includes(userId)) {
        bookmarks.splice(bookmarks.indexOf(propertyId), 1);
      } else {
        bookmarks.push(propertyId);
      }

      await userRepository.update(userId, { extras: { bookmarks } });
      await propertyRepository.update(propertyId, { extras: { bookmarks_count: bookmarks.length } });

      return true;
    } catch (error) {
      return false;
    }
  }
}
