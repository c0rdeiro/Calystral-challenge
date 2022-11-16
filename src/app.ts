import express, { NextFunction, Request, Response } from 'express'
import authRouter from './routes/auth.routes'
import bookRouter from './routes/book.routes'
import dotenv from 'dotenv'
import { Users } from './database/user.database'

const app = express()
dotenv.config()
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/book', bookRouter)

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({
      message: err.message,
    })
  }
  return res.status(500).json({
    status: 'error',
    message: `Internal server error - ${err}`,
  })
})

export default app
