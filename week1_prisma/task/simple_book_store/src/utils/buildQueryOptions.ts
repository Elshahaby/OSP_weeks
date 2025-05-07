import { Prisma } from '@prisma/client';
import { PrismaQueryOptions } from '../types/QueryOptions.interface';
import { BookQuery } from '../books/book.zodSchema';

// `Object.fromEntries()` is a JavaScript utility that converts a list of key-value pairs into an object.
//  It’s often used to dynamically build objects from arrays
//  — particularly useful when parsing things like query parameters or form data.


/**
 * Get all Options we need to pass it to findMany
 * @param query - Query parameters for search, filter, pagination, etc.
 * @returns {PrismaQueryOptions}
 */
export function buildQueryOptions(query: BookQuery): PrismaQueryOptions {
  const page = query.page ? query.page : 1;
  const limit = query.limit ? query.limit : 10;
  const search = query.search;
  const year = query.year ? query.year : undefined;
  const select = query.select
    ? Object.fromEntries(query.select.split(',').map((f) => [f.trim(), true]))
    : undefined;

  const where: Prisma.BookWhereInput = {};

  if (year) {
    where.publishedAt = {
      gte: new Date(`${year}-01-01T00:00:00Z`),
      lt: new Date(`${year + 1}-01-01T00:00:00Z`)
    };
  }

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        auther: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  return {
    prismaOptions: {
      skip: (page - 1) * limit,
      take: limit,
      where,
      select
    },
    pagination: {
      page,
      limit
    }
  };
}
