import { AnyZodObject } from 'zod';

export interface requestValidators {
    bodySchema?: AnyZodObject,
    paramsSchema?: AnyZodObject,
    querySchema?: AnyZodObject,
}
