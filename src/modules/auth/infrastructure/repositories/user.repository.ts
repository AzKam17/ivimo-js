import { BaseRepository } from "@/core/infrastructure/repositories";
import { User } from "@/modules/auth/infrastructure/entities/user.orm-entity";

export class UserRepository extends BaseRepository<User> {
  private static instance: UserRepository;

  private constructor() {
    super(User);
  }

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }
}
