import { ZodError, ZodIssue } from 'zod';

export class ZodValidationError extends Error {
  public statusCode: number;
  public errors: { path: string; message: string }[];

  constructor(error: ZodError) {
    super('Validation failed');
    this.name = 'ZodValidationError';
    this.statusCode = 422;
    this.errors = error.errors.map((err: ZodIssue) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
  }
}
