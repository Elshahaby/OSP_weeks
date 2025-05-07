export class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor); //Cleans up the stack trace, which is not helpful for debugging.
    }
}