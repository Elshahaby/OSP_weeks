import { z } from 'zod';

export const bookIdParamSchema = z.object({
  id: z.string().uuid({ message: "Invalid book ID. Must be a valid UUID." })
});


export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  auther: z.string().min(1, 'Author is required'),
  publishedAt: z
  .string({
    required_error: 'Published date is required',
    invalid_type_error: 'Published date must be a string',
  })
  .refine((val) => val.trim() !== '', {                // handle empty string
    message: 'Published date is requiredd',
  })
  .refine((val) => !isNaN(Date.parse(val)), {         // check if validate date
    message: 'Published date must be a valid date',
  })
  .transform((val) => new Date(val))                // turn the valid string into actual Date
  .refine((date) => date <= new Date(), {
    message: 'Published date cannot be in the future',       // This makes sure the book's publishedAt is either today or a past date — not a future year or day.
  }),                 
  pages: z.number().int().positive('Pages must be a positive integer'),
});


export const updateBookSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  auther: z.string().min(1, 'Author is required').optional(),
  publishedAt: z
    .string()
    .trim()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Published date must be a valid date',
    })
    .transform((val) => (val ? new Date(val) : undefined))
    .refine((date) => !date || date <= new Date(), {
      message: 'Published date cannot be in the future',
    })
    .optional(),
  pages: z.number().int().positive('Pages must be a positive integer').optional(),
});



const currentYear = new Date().getFullYear();

export const bookQuerySchema = z.object({
  search: z.string().optional(),
  year: z
    .string()
    .regex(/^\d{4}$/, 'Year must be a valid 4-digit year')
    .transform(Number)
    .refine(val => !isNaN(val),{
      message: "Year must be a valid Year number"
    })
    .refine((val) => val <= currentYear, {
      message: 'Year must not be in the future',
    })
    .optional(),
  select: z.string().optional(),
  page: z
    .string()
    .default('1') // applies even if request not hold with page query
    .transform(Number)
    .refine((val) => val > 0, { message: 'Page must be greater than 0' })
    ,
  limit: z
    .string()
    .default('10')     // applies even if request not hold limit query
    .transform(Number)
    .refine((val) => val > 0, { message: 'Limit must be greater than 0' })
    ,
});


export type BookQuery = z.infer<typeof bookQuerySchema>; 
// export type BookParams = z.infer<typeof bookIdParamSchema>; 
// export type BookBody = z.infer<typeof >; 