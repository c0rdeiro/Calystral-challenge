import { NextFunction, Request, Response } from 'express'
import { Books } from '../database/book.database'

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

    res
      .status(200)
      .json(
        Books.filter(
          (b) =>
            b.title.includes(title) &&
            b.description.includes(description) &&
            (price ? b.price <= price : undefined)
        )
      )
  } catch (error) {
    next(error)
  }
}
