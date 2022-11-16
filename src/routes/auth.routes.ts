import { Router } from 'express'
import { authenticate, register } from '../controllers/auth.controller'

const authRouter = Router()

authRouter.post('/signIn', authenticate)
authRouter.post('/register', register)

export default authRouter
