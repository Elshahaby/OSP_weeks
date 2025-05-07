import { Book } from "@prisma/client";

export interface PaginatedBooksResult {
    books: Partial<Book>[];  // Because of select, some fields may be excluded
    totalDocuments: number;
    page: number;
    limit: number;
}