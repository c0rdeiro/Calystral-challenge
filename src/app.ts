import express from 'express'
import authRouter from './routes/auth.routes'
import bookRouter from './routes/book.routes'

const app = express()
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/book', bookRouter)

export default app
