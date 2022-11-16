import express from 'express'
import { authenticate, register } from '../controllers/auth.controller'

const authRouter = express.Router()

authRouter.post('/signIn', authenticate)
authRouter.post('/register', register)

export default authRouter
