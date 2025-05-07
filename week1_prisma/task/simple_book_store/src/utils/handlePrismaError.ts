
import { Prisma } from '@prisma/client';

interface FormattedPrismaError {
  statusCode: number;
  message: string;
}

export function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): FormattedPrismaError {
  switch (error.code) {
    case 'P2002': {
      const target = (error.meta?.target as string[])?.join(', ') || 'Unique field';
      return {
        statusCode: 409,
        message: `Duplicate value for: ${target}. Please use unique values.`,
      };
    }

    case 'P2025':
      return {
        statusCode: 404,
        message: `The requested resource could not be found.`,
      };

    case 'P2003':
      return {
        statusCode: 400,
        message: `Invalid foreign key reference.`,
      };

    case 'P2010':
      return {
        statusCode: 400,
        message: `Raw query failed. Please check your syntax and data.`,
      };

    default:
      return {
        statusCode: 500,
        message: `A database error occurred: ${error.message}`,
      };
  }
}