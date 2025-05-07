import dotenv from 'dotenv'
dotenv.config();
import express,{Request, Response, NextFunction} from 'express'
import createError, { HttpError } from 'http-errors'
import bookRoutes from './books/book.routes';
import { ZodValidationError } from './errors/ZodValidationError.class';
import { error } from 'console';
import { Prisma } from '@prisma/client';
import { handlePrismaError } from './utils/handlePrismaError';
import { AppError } from './errors/AppError.class';

const app = express();

app.use(express.json())

app.use('/api/v1/books', bookRoutes);



// 404 handler
app.use( async(req: Request, res: Response, next: NextFunction) => {
    next(createError.NotFound('This route does not exist'));
});

// Global error handler
app.use(
    (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.log("Enter Global Error Handler", err);
       
        if (err instanceof AppError) {
            res.status(err.statusCode).json({ message: err.message });
            return;
        }
          
        
        if (err instanceof ZodValidationError) {
            console.log("Zod Error");
           res.status(err.statusCode || 400).json({
            message: err.message,
            errors: err.errors,
          });
          return;
        }
      
        if (err instanceof HttpError) {
            console.log("Http Error");
           res.status(err.statusCode || 500).json({
            error: {
              status: err.statusCode,
              message: err.message,
            },
          });
          return;
        }
      
        res.status(500).json({
          error: {
            status: 500,
            message: err.message || 'Internal server error',
          },
        });
      }
);

if(! process.env.PORT){
    console.log("string PORT : ", process.env.PORT)
    process.exit(1);
}

const PORT : number = parseInt(process.env.PORT , 10);
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})