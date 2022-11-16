import { NextFunction, Request, Response } from 'express'
import { Books } from '../database/book.database'

export const getAllBooks = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json(Books)
  } catch (error) {
    next(error)
  }
}
