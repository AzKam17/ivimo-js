import { Repository, DataSource, FindOptionsWhere, DeepPartial } from "typeorm";
import { AppDataSource } from "@/modules/config";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

interface BaseEntity {
  id: string;
  isActive: boolean;
  deletedAt: Date | null;
}

export class BaseRepository<T extends BaseEntity> {
  protected repository: Repository<T>;

  constructor(entity: { new (): T }, dataSource: DataSource = AppDataSource) {
    this.repository = dataSource.getRepository(entity);
  }

  public async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  public async findAll(): Promise<T[]> {
    return this.repository.find({
      where: {
        isActive: true,
        deletedAt: null,
      } as unknown as FindOptionsWhere<T>,
    });
  }

  public async findById(id: string): Promise<T | null> {
    return this.repository.findOne({
      where: {
        id,
        isActive: true,
        deletedAt: null,
      } as unknown as FindOptionsWhere<T>,
    });
  }

  public async findOneBy(where: Partial<T>): Promise<T | null> {
    return this.repository.findOne({
      where: {
       ...where,
        isActive: true,
        deletedAt: null,
      } as FindOptionsWhere<T>,
    });
  }

  public async findBy(where: Partial<T>): Promise<T[]> {
    return this.repository.find({
      where: {
        ...where,
        isActive: true,
        deletedAt: null,
      } as FindOptionsWhere<T>,
    });
  }

  public async findManyWithPagination(
    where: Partial<T>,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: T[]; total: number; page: number; pageCount: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      where: {
        ...where,
        isActive: true,
        deletedAt: null,
      } as FindOptionsWhere<T>,
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  public async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  public async update(id: string, data: QueryDeepPartialEntity<T>): Promise<T | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.repository.update(id, {
      isActive: false,
      deletedAt: new Date(),
    } as any);
    return result.affected !== undefined && result.affected > 0;
  }

  public async exists(where: Partial<T>): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        ...where,
        isActive: true,
        deletedAt: null,
      } as FindOptionsWhere<T>,
    });
    
    return count > 0;
  }
}
