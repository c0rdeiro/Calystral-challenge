import { Router } from 'express'
import {
  createBook,
  getAllBooks,
  unpublishBook,
  updateBook,
} from '../controllers/book.controller'

const bookRouter = Router()

bookRouter.get('/', getAllBooks)

bookRouter.post('/', createBook)
bookRouter.put('/:id', updateBook)
bookRouter.delete('/:id', unpublishBook)

export default bookRouter
