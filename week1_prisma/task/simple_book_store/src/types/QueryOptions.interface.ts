import { Prisma } from "@prisma/client";

export interface PrismaQueryOptions {
    prismaOptions: {
      where: Prisma.BookWhereInput;     // required to filter, can be an empty object
      select?: Prisma.BookSelect;       // Optional — if not included, Prisma will return all fields by default.
      skip: number;
      take: number;
    };
    pagination: {
      page: number;
      limit: number;
    };
}