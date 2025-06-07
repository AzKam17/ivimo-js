/**
 * Exception for when arguments are not provided
 */
export class ArgumentNotProvidedException extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ArgumentNotProvidedException';
    }
  }