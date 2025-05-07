import { Request, Response, NextFunction } from 'express';
import { requestValidators } from '../types/requestValidatiors.interface';
import { ZodValidationError } from '../errors/ZodValidationError.class';
import { ZodError } from 'zod';
import { BookQuery } from '../books/book.zodSchema';

// req.query is by default a read-only object because its type in TypeScript comes from the core definition.

export function validateRequest(validators: requestValidators) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.bodySchema)   req.body   = await validators.bodySchema.parseAsync(req.body);
      if (validators.paramsSchema) req.params = await validators.paramsSchema.parseAsync(req.params);
      if (validators.querySchema)  req.validatedQuery  = await validators.querySchema.parseAsync(req.query) as BookQuery;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ZodValidationError(error));
        return;
      }
      next(error);
    }
  };
}
