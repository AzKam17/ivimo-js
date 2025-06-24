import { BaseRepository } from "@/core/infrastructure/repositories";
import { User } from "@/modules/auth/infrastructure/entities/user.orm-entity";
import { FindOptionsWhere, In, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm"; // Add operators
import { UserRoleEnum } from "@/core/enums/enums";

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
  
  /**
   * Count all users with optional filtering
   * @param filter Optional filter criteria (role, createdAfter, createdBefore, etc.)
   * @param includeInactive Whether to include inactive users (default: false)
   * @returns The count of users matching the criteria
   */
  public async countAll(filter: {
    role?: UserRoleEnum | UserRoleEnum[];
    email?: string;
    createdAfter?: Date;
    createdBefore?: Date;
    isActive?: boolean;
  } = {}, includeInactive: boolean = false): Promise<number> {
    const whereClause: FindOptionsWhere<User> = {};
    
    // Apply role filter
    if (filter.role) {
      if (Array.isArray(filter.role)) {
        whereClause.role = In(filter.role);
      } else {
        whereClause.role = filter.role;
      }
    }
    
    // Apply email filter
    if (filter.email) {
      whereClause.email = filter.email;
    }
    
    // Apply date range filters
    if (filter.createdAfter && filter.createdBefore) {
      // If both dates are provided, use Between operator
      whereClause.createdAt = Between(filter.createdAfter, filter.createdBefore);
    } else if (filter.createdAfter) {
      // If only createdAfter is provided
      whereClause.createdAt = MoreThanOrEqual(filter.createdAfter);
    } else if (filter.createdBefore) {
      // If only createdBefore is provided
      whereClause.createdAt = LessThanOrEqual(filter.createdBefore);
    }
    
    // Apply active status filter
    if (filter.isActive !== undefined) {
      whereClause.isActive = filter.isActive;
    } else if (!includeInactive) {
      // By default, only count active users
      whereClause.isActive = true;
      whereClause.deletedAt = undefined;
    }
    
    return this.repository.count({
      where: whereClause,
    });
  }
}
