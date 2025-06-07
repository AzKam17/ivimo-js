import { ICommandHandler } from "elysia-cqrs";
import { BaseCommand } from "./command.base";

/**
 * Abstract base class for command handlers in CQRS pattern
 * Implements the ICommandHandler interface from elysia-cqrs
 *
 * @template TCommand - Type of command extending BaseCommand
 * @template TResult - Type of result returned by the handler
 */
export abstract class BaseCommandHandler<TCommand extends BaseCommand, TResult = void>
  implements ICommandHandler<TCommand, Promise<TResult>>
{
  constructor() {
    this.execute = this.execute.bind(this);
  }

  /**
   * Abstract method to be implemented by concrete command handlers
   * Contains the business logic for processing the command
   *
   * @param command - The command to be executed
   * @returns Promise resolving to the result of command execution
   */
  abstract execute(command: TCommand): Promise<TResult>;
}
