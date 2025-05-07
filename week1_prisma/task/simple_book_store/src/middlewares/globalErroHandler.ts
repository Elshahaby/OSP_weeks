import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.class';
import { ZodValidationError } from '../errors/ZodValidationError.class';
import createHttpError, { HttpError } from 'http-errors';

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log('Enter Global Error Handler', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof ZodValidationError) {
    console.log('Zod Error');
    res.status(err.statusCode || 400).json({
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (err instanceof HttpError) {
    console.log('Http Error');
    res.status(err.statusCode || 500).json({
      error: {
        status: err.statusCode,
        message: err.message,
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      status: 500,
      message: err.message || 'Internal server error',
    },
  });
}

export async function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    next(createHttpError.NotFound('This route does not exist'));
}