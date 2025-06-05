import { Repository } from "typeorm";
import { DataSource } from "typeorm";
import { AppDataSource } from "@/modules/config";
import { User } from "@/modules/auth/infrastructure/entities/user.orm-entity";

export class UserRepository {
  private static instance: UserRepository;
  private repository: Repository<User>;
  private dataSource: DataSource;

  private constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  // Find all users
  public async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  // Find user by ID
  public async findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  // Create a new user
  public async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  // Update a user
  public async update(id: string, userData: Partial<User>): Promise<User | null> {
    await this.repository.update(id, userData);
    return this.findById(id);
  }

  // Delete a user
  public async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    // @ts-ignore
    return result.affected !== undefined && result.affected > 0;
  }
}