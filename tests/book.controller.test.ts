import request from 'supertest'
import app from '../src/app'

describe('Book Controller', () => {
  it('should be able to list all books', async () => {
    const res = await request(app).get('/api/book')

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
  })

  it('should be able to filter by query param', async () => {
    const res = await request(app).get('/api/book?title=book&price=15')

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
  })

  it('should be able to filter by query param', async () => {
    const res = await request(app).get('/api/book?description=The great book')

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(0)
  })
})
