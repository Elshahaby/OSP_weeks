import { Router } from 'express'
import { validateRequest } from '../middlewares/validateRequestWithZod';
import { bookIdParamSchema, bookQuerySchema, createBookSchema, updateBookSchema  } from './book.zodSchema';
import * as BookControllers from './book.controller'


const bookRouter = Router();


bookRouter.get('/', 
    validateRequest({querySchema: bookQuerySchema}) ,
    BookControllers.getAllBooks
)

bookRouter.get('/:id', 
    validateRequest({paramsSchema: bookIdParamSchema}) ,
    BookControllers.getBook
)

bookRouter.post('/', 
    validateRequest({bodySchema: createBookSchema }) , 
    BookControllers.createBook
)

bookRouter.put('/:id' , 
    validateRequest({
        bodySchema: updateBookSchema,
        paramsSchema: bookIdParamSchema
    }),
    BookControllers.updateBook
)

bookRouter.delete("/:id", 
    validateRequest({paramsSchema: bookIdParamSchema}) ,
    BookControllers.deleteBook
)

export default bookRouter;