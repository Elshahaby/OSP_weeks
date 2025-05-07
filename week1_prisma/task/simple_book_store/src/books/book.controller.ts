import { Request, Response, NextFunction} from 'express'
import { BookService } from './book.service'
import createError from 'http-errors'


export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await BookService.getAll(req.validatedQuery!);
        console.log(books)
        res.status(200).json(books)
    } catch (error) {
        next(error);
    }
}

export const getBook = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookService.getById(req.params.id);
        if(!book){
            throw createError.NotFound('Book is not found');
        }
        console.log(book)
        res.status(200).json({book})
    } catch (error) {
        next(error);
    }
}


export const createBook = async(req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("from Route")
        const newBook = await BookService.create(req.body);
        console.log(newBook)
        res.status(201).json({newBook})
    } catch (error) {
        next(error);
    }
}

export const updateBook = async(req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("from Route")
        const updatedBook = await BookService.update(req.params.id, req.body);
        console.log(updatedBook)
        res.status(200).json({updatedBook})
    } catch (error) {
        next(error);
    }
}

export const deleteBook = async(req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("from Route")
        const deletedBook = await BookService.remove(req.params.id);
        console.log("deleted",  deletedBook)
        res.status(200).json({message: "Book has been successfully deleted", deletedBook: deletedBook})
    } catch (error) {
        next(error);
    }
}