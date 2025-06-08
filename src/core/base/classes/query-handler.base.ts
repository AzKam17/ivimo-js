import { IQueryHandler } from "elysia-cqrs";
import { BaseQuery } from "./query.base";

/**
 * Abstract base class for query handlers in CQRS pattern
 * Implements the IQueryHandler interface from elysia-cqrs
 *
 * @template TQuery - Type of query extending BaseQuery
 * @template TResult - Type of result returned by the handler
 */
export abstract class BaseQueryHandler<TQuery extends BaseQuery, TResult = void>
  implements IQueryHandler<TQuery, Promise<TResult>>
{
  constructor() {
    this.execute = this.execute.bind(this);
  }

  /**
   * Abstract method to be implemented by concrete query handlers
   * Contains the business logic for processing the query
   *
   * @param query - The query to be executed
   * @returns Promise resolving to the result of query execution
   */
  abstract execute(query: TQuery): Promise<TResult>;
}
