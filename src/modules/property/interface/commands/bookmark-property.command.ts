import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
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

      await userRepository.exists({ id: userId }, true);

      const property = await propertyRepository.findById(propertyId);
      const bookmarks: Array<string> = (property?.extras?.bookmarks as Array<string>) ?? [];

      if (bookmarks.includes(userId)) {
        bookmarks.splice(bookmarks.indexOf(userId), 1);
      } else {
        bookmarks.push(userId);
      }

      await propertyRepository.update(propertyId, { extras: { bookmarks } });
      return true;
    } catch (error) {
      return false;
    }
  }
}
