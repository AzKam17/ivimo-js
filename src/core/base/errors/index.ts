import Elysia from "elysia";

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
    console.error("🛑 Error caught:", error);
    const statusCode = error instanceof BaseError ? error.statusCode : 500;
    set.status = statusCode;

    return {
      error: statusCode,
      message: error instanceof BaseError ? error.message : "An unexpected error occurred",
    };
  })
  .as('global')
  ;
