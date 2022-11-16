import { JwtPayload, verify } from 'jsonwebtoken'
import request from 'supertest'
import app from '../src/app'

describe('Auth Controller', () => {
  it('should be able to register new user', async () => {
    const response = await request(app).post('/api/auth/register').send({
      username: 'Francisco',
      password: '1234',
      authorPseudonym: 'fc',
    })

    expect(response.status).toBe(201)
  })

  it('should be able to authenticate user', async () => {
    const response = await request(app).post('/api/auth/signIn').send({
      username: 'Francisco',
      password: '1234',
    })

    const token = verify(response.body, process.env.JWT_SECRET!)
    expect((token as JwtPayload).username).toBe('Francisco')
  })
})
