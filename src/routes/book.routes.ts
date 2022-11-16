import { Router } from 'express'
import {
  createBook,
  getAllBooks,
  unpublishBook,
  updateBook,
} from '../controllers/book.controller'
import authMiddleware from '../middleware/auth.middleware'

const bookRouter = Router()

bookRouter.get('/', getAllBooks)

bookRouter.post('/', authMiddleware, createBook)
bookRouter.put('/:id', authMiddleware, updateBook)
bookRouter.delete('/:id', authMiddleware, unpublishBook)

export default bookRouter
