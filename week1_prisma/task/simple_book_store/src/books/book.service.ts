import { Prisma, Book } from '@prisma/client';
import prisma from '../db.server';
import { AppError } from '../errors/AppError.class';
import { handlePrismaError } from '../utils/handlePrismaError';
import { buildQueryOptions } from '../utils/buildQueryOptions';
// import { QueryParams } from '../types/QueryParams.interface';
import { PaginatedBooksResult } from '../types/paginatedBooksResult.interface';
import { BookQuery } from './book.zodSchema';

// You could select part of the response like you want to return some data about books like title and auther 
// but not want to return the rest you could do that in prisma using select attribute and then edit the type
// that the function return by doing an interface that cutoms what you want to return at response and put it
// inside :Promise< Customed_Interface_depending_On_What_I_Want_To_return_at_response >

export const BookService = {
 /**
   * Get all books based on query filters
   * @param query - Query parameters for search, filter, pagination, etc.
   * @returns {Promise<PaginatedBooksResult>}
   */
 async getAll(query: BookQuery): Promise<PaginatedBooksResult> {
  try {
    const { prismaOptions, pagination } = buildQueryOptions(query);

    const [books, totalDocuments] = await Promise.all([
      prisma.book.findMany(prismaOptions),
      prisma.book.count({ where: prismaOptions.where }),
    ]);

    return {
      totalDocuments,
      ...pagination,
      books,
    };
  } catch (err) {
    throw new AppError('Failed to fetch books');
  }
},

  /**
   * Get a book by ID
   * @param id - UUID string
   * @returns {Promise<Book | null>}
   */
  async getById(id: string): Promise<Book | null> {
    try {
      const book = await prisma.book.findUnique({ where: { id } });
      if (!book) throw new AppError('Book not found', 404);
      return book;
    } catch (err) {
      throw new AppError('Book not found', 404);
    }
  },

  /**
   * Create a new book
   * @param data - Prisma.BookCreateInput
   * @returns {Promise<Book>}
   */
  async create(data: Prisma.BookCreateInput): Promise<Book> {
    try {
      return await prisma.book.create({ data });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const { statusCode, message } = handlePrismaError(err);
        throw new AppError(`Book creation failed: ${message}`, statusCode);
      }
      throw err;
    }
  },

  /**
   * Update a book by ID
   * @param id - UUID string
   * @param data - Prisma.BookUpdateInput
   * @returns {Promise<Book>}
   */
  async update(id: string, data: Prisma.BookUpdateInput): Promise<Book> {
    try {
      return await prisma.book.update({ where: { id }, data });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const { statusCode, message } = handlePrismaError(err);
        throw new AppError(`Book update failed: ${message}`, statusCode);
      }
      throw err;
    }
  },

  /**
   * Delete a book by ID
   * @param id - UUID string
   * @returns {Promise<Book>}
   */
  async remove(id: string): Promise<Book> {
    try {
      return await prisma.book.delete({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const { statusCode, message } = handlePrismaError(err);
        throw new AppError(`Book deletion failed: ${message}`, statusCode);
      }
      throw err;
    }
  },
};
