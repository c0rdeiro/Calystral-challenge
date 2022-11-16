import request from 'supertest'
import app from '../src/app'

describe('Book Controller', () => {
  it('should be able to list all books', async () => {
    const res = await request(app).get('/api/book')

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
  })
})
