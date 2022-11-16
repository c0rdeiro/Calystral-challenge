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
    const user: User = req.body
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
    const reqUser: User = req.body

    const user: User | undefined = Users.find(
      (u) => u.username === reqUser.username
    )

    if (!user) {
      res.status(404).send()
      return
    }

    verify(user.password, reqUser.password)

    const token = await sign(
      { username: user.username },
      process.env.JWT_SECRET!,
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
