# Simple Book Store API

A REST API for managing books using Express, TypeScript, Prisma ORM, Zod validation, and PostgreSQL.

## Tech Stack

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod

## Features

- Create, read, update, and delete books
- Query validation with Zod
- Pagination for listing books
- Search by title/author
- Filter by publication year
- Optional field selection through query params
- Global error handling

## Prerequisites

- Node.js 20.x
- npm
- PostgreSQL database

Important for Prisma versions:

- Prisma 6.x works with your current setup.
- Prisma 7.x requires Node.js `20.19+` (or `22.12+` / `24+`).

## Project Structure

```text
prisma/
  schema.prisma
  seed.ts
  migrations/
src/
  index.ts
  db.server.ts
  books/
    book.routes.ts
    book.controller.ts
    book.service.ts
    book.zodSchema.ts
  middlewares/
  errors/
  utils/
  types/
```

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PORT=3000
```

## Installation

```bash
npm install
```

## Run the Project

Development mode:

```bash
npm run dev
```

## Prisma Workflow

### 1) Generate Prisma client

```bash
npx prisma generate
```

### 2) Create and apply a new migration (development)

```bash
npx prisma migrate dev --name init
```

Use a descriptive migration name, for example:

```bash
npx prisma migrate dev --name add_book_unique_constraint
```

### 3) Apply existing migrations (production/CI)

```bash
npx prisma migrate deploy
```

### 4) Check migration status

```bash
npx prisma migrate status
```

### 5) Reset database in development (destructive)

```bash
npx prisma migrate reset
```

This drops and recreates the database, reapplies migrations, and runs seed if configured.

### 6) Seed data

```bash
npx prisma db seed
```

## Migration Revert Strategy (Prisma)

Prisma does not have a single command to rollback a migration in normal workflow.
Use one of these approaches:

1. Create a new migration that reverses the previous change (recommended).
2. Use `npx prisma migrate reset` in development only.
3. For advanced/manual handling, use `prisma migrate resolve` to mark migration state.

## API Base URL

```text
http://localhost:3000/api/v1/books
```

## Endpoints

### GET `/`

Get paginated books.

Supported query params:

- `page` (default: `1`)
- `limit` (default: `10`)
- `search` (matches `title` or `auther`, case-insensitive)
- `year` (4-digit year, not in future)
- `select` (comma-separated fields, e.g. `title,auther,pages`)

Example:

```http
GET /api/v1/books?page=1&limit=5&search=leader&year=2024&select=title,auther
```

### GET `/:id`

Get one book by UUID.

### POST `/`

Create a book.

Request body:

```json
{
  "title": "The Leader in Me",
  "auther": "Stephen R. Covey",
  "publishedAt": "2020-01-01",
  "pages": 304
}
```

### PUT `/:id`

Update a book by UUID.

Request body can include any subset of:

```json
{
  "title": "Updated Title",
  "auther": "Updated Author",
  "publishedAt": "2020-02-01",
  "pages": 320
}
```

### DELETE `/:id`

Delete a book by UUID.

## Data Model

Book model fields:

- `id` (UUID)
- `title` (string)
- `auther` (string)
- `publishedAt` (DateTime)
- `pages` (int)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

Unique composite constraint:

- `title + auther + publishedAt`

## Validation Rules

- `id` must be a valid UUID.
- `title` and `auther` must be non-empty.
- `publishedAt` must be a valid date and not in the future.
- `pages` must be a positive integer.
- `year` query must be a valid 4-digit year and not in the future.
- `page` and `limit` must be greater than 0.

## Error Response Shapes

Validation errors:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "path": ["pages"],
      "message": "Pages must be a positive integer"
    }
  ]
}
```

App/domain errors:

```json
{
  "message": "Book not found"
}
```

HTTP/unknown errors:

```json
{
  "error": {
    "status": 500,
    "message": "Internal server error"
  }
}
```

## API Screenshots

### Overview

![Book CRUD](src/images/book_curd.png)

### Create Book

![Add Create New Book 200 Created](src/images/Add_Create_New_Book_200_Created.png)

![Add Book Data Validation Error 244 Unprocessable Entity](src/images/Add_Book_Data_Validation_Error_244_Unprocessable_Entity.png)

![Validation Error for Wrong JSON Keys in Add Book](src/images/validation_error_for_write_keys_of_json_body_wrong_in_add_book.png)

### Get Books

![Get All Books Using All Query Parameters](src/images/get_all_books_Using_all_query_parameters_for_pagination_filtering_searching.png)

![Get All Books with Search and Year Query](src/images/get_all_books_with_search_and_year_query_for_filtering_and_searching.png)

![Get All Books Query Validation Errors](src/images/get_all_books_query_Validation_errors.png)

### Get One Book

![Get Specific Book](src/images/get_specific_book.png)

![Not Found Book by Wrong ID](src/images/Not_found_a_book_when_write_a_wrong_book_id_when_get_specific_book.png)

### Update Book

![Update Book Data 200 OK](src/images/Update_Book_Data_200_OK.png)

![Update Book Validation Error 422 Unprocessable Entity](src/images/Update_Book_Validation_Error_422_Unprocessable_Entity.png)

### Delete Book

![Delete Book 200 OK](src/images/Delete_Book_200_OK.png)

![Delete Not Found Book Error 404 Not Found](src/images/Delete_Not_Found_Book_Error_404_Not_Found.png)

### Not Found Route

![Write Non Defined Route Generates 404 Not Found](src/images/write_non_defiend_route_generates_404_not_found.png)

## Troubleshooting

### Prisma upgrade fails with Node engine error

If you run:

```bash
npm i --save-dev prisma@latest
npm i @prisma/client@latest
```

and get an unsupported Node engine error, upgrade Node first to `20.19+`.

### Warning: "datasource property `url` is no longer supported"

That warning refers to Prisma 7 migration guidance. In Prisma 6, your schema-based `url` is expected.
If you move to Prisma 7 later, follow the official migration docs:

- https://pris.ly/d/config-datasource
- https://pris.ly/d/prisma7-client-configPrisma

## Notes

- The field name is `auther` in the current schema and API. Keep this name consistent unless you plan a migration to rename it to `author`.
- No test suite is configured yet (`npm test` currently exits with an error message).

## License

ISC
