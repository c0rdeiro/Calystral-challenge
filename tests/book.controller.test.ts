import request from 'supertest'
import app from '../src/app'
import { Books } from '../src/database/book.database'

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

describe('Book Controller auth routes', () => {
  describe('to user that is not the owner', () => {
    let token = ''
    beforeAll(async () => {
      const res = await request(app).post('/api/auth/signIn').send({
        username: 'Francisco',
        password: '1234',
      })

      token = res.body
    })
    it('should deny deletion of a book to an user that is not the owner', async () => {
      const res = await request(app)
        .delete('/api/book/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'book 1',
          description: 'book1 description',
          price: 12.1,
          author: {
            username: 'jon',
            password:
              '$argon2id$v=19$m=65536,t=3,p=4$mp4Sdfqk2B11p7e/zsgJNQ$ytAdkGzmnkAnP/i851MskPL4vAdzw8jAZshUQMroImc',
          },
          coverImage: '',
        })

      expect(res.status).toBe(403)
    })
  })
  describe('to _Darth Vader_', () => {
    let token = ''
    beforeAll(async () => {
      const res = await request(app).post('/api/auth/signIn').send({
        username: '_Darth Vader_',
        password: '1234',
      })

      token = res.body
    })
    it('should deny the creation of a book to the user _Darth Vader_', async () => {
      const res = await request(app)
        .delete('/api/book/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'book 1',
          description: 'book1 description',
          price: 12.1,
          author: {
            username: 'jon',
            password:
              '$argon2id$v=19$m=65536,t=3,p=4$mp4Sdfqk2B11p7e/zsgJNQ$ytAdkGzmnkAnP/i851MskPL4vAdzw8jAZshUQMroImc',
          },
          coverImage: '',
        })

      expect(res.status).toBe(403)
    })
  })
  describe('to book owner', () => {
    let token = ''
    beforeAll(async () => {
      const res = await request(app).post('/api/auth/signIn').send({
        username: 'jon',
        password: '1234',
      })

      token = res.body
    })

    it('should be able to create a book', async () => {
      const countBefore = Books.length
      const res = await request(app)
        .post('/api/book')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'book1',
          description: 'book1 description',
          price: 12.1,
          author: {
            username: 'Francisco',
            password:
              '$argon2id$v=19$m=65536,t=3,p=4$mp4Sdfqk2B11p7e/zsgJNQ$ytAdkGzmnkAnP/i851MskPL4vAdzw8jAZshUQMroImc',
          },
          coverImage: '',
        })

      expect(res.status).toBe(201)
      expect(Books.length).toBe(countBefore + 1)
    })

    it('should deny creation of a book to an unauthenticated user', async () => {
      const res = await request(app)
        .post('/api/book')
        .send({
          title: 'book1',
          description: 'book1 description',
          price: 12.1,
          author: {
            username: 'Francisco',
            password:
              '$argon2id$v=19$m=65536,t=3,p=4$mp4Sdfqk2B11p7e/zsgJNQ$ytAdkGzmnkAnP/i851MskPL4vAdzw8jAZshUQMroImc',
          },
          coverImage: '',
        })

      expect(res.status).toBe(403)
    })

    it('should be able to update a book', async () => {
      const res = await request(app)
        .put('/api/book/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'book 1',
          description: 'book1 description',
          price: 12.1,
          author: {
            username: 'jon',
            password:
              '$argon2id$v=19$m=65536,t=3,p=4$mp4Sdfqk2B11p7e/zsgJNQ$ytAdkGzmnkAnP/i851MskPL4vAdzw8jAZshUQMroImc',
          },
          coverImage: '',
        })

      expect(res.status).toBe(200)
      expect(Books[0].title).toBe('book 1')
    })

    it('should deny the update of a book to an unauthenticated user', async () => {
      const res = await request(app)
        .put('/api/book/1')
        .send({
          title: 'book 1',
          description: 'book1 description',
          price: 12.1,
          author: {
            username: 'jon',
            password:
              '$argon2id$v=19$m=65536,t=3,p=4$mp4Sdfqk2B11p7e/zsgJNQ$ytAdkGzmnkAnP/i851MskPL4vAdzw8jAZshUQMroImc',
          },
          coverImage: '',
        })

      expect(res.status).toBe(403)
    })

    it('should deny deletion of a book to an unauthenticated user', async () => {
      const res = await request(app)
        .delete('/api/book/1')
        .send({
          title: 'book 1',
          description: 'book1 description',
          price: 12.1,
          author: {
            username: 'jon',
            password:
              '$argon2id$v=19$m=65536,t=3,p=4$mp4Sdfqk2B11p7e/zsgJNQ$ytAdkGzmnkAnP/i851MskPL4vAdzw8jAZshUQMroImc',
          },
          coverImage: '',
        })

      expect(res.status).toBe(403)
    })
    it('owner should be able to delete a book', async () => {
      const res = await request(app)
        .delete('/api/book/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'book 1',
          description: 'book1 description',
          price: 12.1,
          author: {
            username: 'jon',
            password:
              '$argon2id$v=19$m=65536,t=3,p=4$mp4Sdfqk2B11p7e/zsgJNQ$ytAdkGzmnkAnP/i851MskPL4vAdzw8jAZshUQMroImc',
          },
          coverImage: '',
        })

      expect(res.status).toBe(200)
    })
  })
})
