import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization
  if (!token) {
    return res
      .status(403)
      .send('Must be authenticated to perform this operation')
  }

  const jwt = verify(token.split(' ')[1], process.env.JWT_SECRET!)

  if ((jwt as User).username === '_Darth Vader_') {
    return res.status(403).send('Not enough permissions')
  }

  next()
}
