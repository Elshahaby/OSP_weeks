
import 'express';
import { BookQuery } from '../books/book.zodSchema';

declare module 'express-serve-static-core' {
  interface Request {
    validatedQuery?: BookQuery;
  }
}
