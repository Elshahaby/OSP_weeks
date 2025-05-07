import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import bookRoutes from './books/book.routes';
import { globalErrorHandler, notFoundHandler } from './middlewares/globalErroHandler';

const app = express();

app.use(express.json())

app.use('/api/v1/books', bookRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

if(! process.env.PORT){
    console.log("string PORT : ", process.env.PORT)
    process.exit(1);
}

const PORT : number = parseInt(process.env.PORT , 10);
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})