import { NextFunction, Request, Response } from 'express'
import { Books } from '../database/book.database'
import { v4 as uuid } from 'uuid'
import { verify } from 'jsonwebtoken'

export const getAllBooks = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title = '',
      description = '',
      price,
    } = req.query as {
      title: string | undefined
      description: string | undefined
      price: number | undefined
    }

    //TODO: filter by author
    res
      .status(200)
      .json(
        Books.filter(
          (b) =>
            b.title.includes(title) &&
            b.description.includes(description) &&
            (price ? b.price <= price : true)
        )
      )
  } catch (error) {
    next(error)
  }
}

export const createBook = (req: Request, res: Response, next: NextFunction) => {
  try {
    const book: Book = req.body

    book.id = uuid()
    Books.push(book)

    res.status(201).send()
  } catch (error) {
    next(error)
  }
}

export const updateBook = (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookIndex = Books.findIndex((b) => b.id === req.params.id)
    if (!bookIndex) {
      res.status(404).send()
      return
    }
    const updatedBook = { id: req.params.id, ...req.body }
    Books.splice(bookIndex, 1, updatedBook)

    res.status(200).send()
  } catch (error) {
    next(error)
  }
}

export const unpublishBook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookIndex = Books.findIndex((b) => b.id === req.params.id)

    if (bookIndex === -1) {
      return res.status(404).send()
    }

    const jwt = verify(
      req.headers.authorization!.split(' ')[1],
      process.env.JWT_SECRET!
    )

    if ((jwt as User).username !== Books[bookIndex].author.username) {
      return res.status(403).send('Not enough permissions')
    }

    Books.splice(bookIndex, 1)

    res.status(200).send()
  } catch (error) {
    next(error)
  }
}
