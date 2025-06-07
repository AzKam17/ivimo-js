import { ArgumentNotProvidedException } from "@/core/exceptions";
import { Guard } from "@/core/utils";
import { ICommand } from "elysia-cqrs";
import { nanoid } from "nanoid";

/**
 * Type for command properties that omits correlationId from T and makes BaseCommand properties optional
 */
export type CommandProps<T> = Omit<T, "correlationId"> & Partial<BaseCommand>;

/**
 * Base command class for CQRS pattern
 */
export class BaseCommand extends ICommand {
  /**
   * ID for correlation purposes (for UnitOfWork, for commands that
   * arrive from other microservices, logs correlation etc).
   */
  public readonly correlationId: string;

  constructor(props: CommandProps<unknown>) {
    super();
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException("Command props should not be empty");
    }
    this.correlationId = props.correlationId || nanoid(8);
  }
}
