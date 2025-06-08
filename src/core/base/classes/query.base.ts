import { ArgumentNotProvidedException } from "@/core/exceptions";
import { Guard } from "@/core/utils";
import { IQuery } from "elysia-cqrs";
import { nanoid } from "nanoid";

/**
 * Type for command properties that omits correlationId from T and makes BaseCommand properties optional
 */
export type QueryProps<T> = Omit<T, "correlationId"> & Partial<BaseQuery>;

/**
 * Base query class for CQRS pattern
 */
export class BaseQuery extends IQuery {
  /**
   * ID for correlation purposes (for UnitOfWork, for commands that
   * arrive from other microservices, logs correlation etc).
   */
  public readonly correlationId: string;

  constructor(props: QueryProps<unknown>) {
    super();
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException("Command props should not be empty");
    }
    this.correlationId = props.correlationId || nanoid(8);
  }
}
