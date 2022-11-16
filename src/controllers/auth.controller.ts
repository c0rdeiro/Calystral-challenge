import { hash, verify } from 'argon2'
import { NextFunction, Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { Users } from '../database/user.database'

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user: CustomUser = req.body
    const exists = !!Users.find((u) => user.username === u.username)
    if (exists) {
      res.status(400).send('User already exists')
      return
    }
    user.password = await hash(user.password) //should have salt in a real scenario
    Users.push(user)

    res.status(201).send()
  } catch (error) {
    next(error)
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const JWT_SECRET: string = 'd68a2e6365f0fd1f9c46c2e65c77ec87' //should be in the .env file, here for simplicity
    const reqUser: User = req.body

    const user: CustomUser | undefined = Users.find(
      (u) => u.username === reqUser.username
    )

    if (!user) {
      res.status(404).send()
      return
    }

    verify(user.password, reqUser.password)

    const token = await sign(
      { username: user.username, authorPseudonym: user.authorPseudonym },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '12h',
      }
    )

    res.status(200).json(token)
  } catch (error) {
    next(error)
  }
}
