import Elysia, { ValidationError } from "elysia";

interface ErrorResponseProps {
  statusCode: number;
  message: string;
}

export class BaseError extends Error {
  readonly statusCode: number;
  readonly error: string;

  constructor(body: ErrorResponseProps) {
    super();
    this.statusCode = body.statusCode;
    this.message = body.message;
  }
}

export const Errors = {
  BaseError,
};

export const ErrorPlugin = new Elysia()
  .error(Errors)
  .onError(({ code, error, set }) => {
    console.log(error);
    let message: string = "An unexpected error occurred";

    if (error instanceof BaseError) {
      set.status = error.statusCode;
      message = error.message;
    }

    if (error instanceof ValidationError && error.all?.[0]) {
      const firstError = error.all[0];
      message = firstError.summary ?? message;
      if ('path' in firstError && firstError.path) {
        message += ` (${firstError.path})`;
      }
    }

    return {
      error: set.status,
      message,
    };
  })
  .as("global");
