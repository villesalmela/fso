import { test, describe } from 'node:test'
import { strictEqual, deepStrictEqual, partialDeepStrictEqual } from 'node:assert'
import { app } from '../app.js'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { Blog } from '../models/blog.js'
import { User } from '../models/user.js'

const blogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    }
  ]
const api = supertest(app)


const invalid_id = '123455cad2c02abc3e512345'
let valid_token
let valid_user_id

test.before(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.TEST_MONGODB_URI)
  }
  
  await User.deleteMany({})
  const newUser = {
        username: 'blogtest',
        name: 'Test',
        password: 'testpass'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .then(async (res) => {
          valid_user_id = res.body.id
        })
    const credentials = {
        username: 'blogtest',
        password: 'testpass'
    }
    await api
        .post('/api/login')
        .send(credentials)
        .expect(200)
        .then(async (res) => {
          valid_token = res.body.token
        })
    blogs.forEach(blog => blog.user = valid_user_id)

})


  test.beforeEach(async () => {
    await Blog.deleteMany({})  
    await Blog.insertMany(blogs)
  })
describe('blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct amount of blogs', async () => {
    const response = await api.get('/api/blogs').expect(200)
    strictEqual(response.body.length, 6)
  })

  test('has id', async () => {
    const response = await api.get('/api/blogs').expect(200)
    strictEqual(typeof response.body[0].id, 'string')
  })

  test('post ok', async () => {
    let new_blog = {title: "title1", author: "author1", url: "url1", likes: 1, user: valid_user_id}
    let res = await api.get('/api/blogs')
    strictEqual(res.body.length, 6)
    
    res = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${valid_token}`)
    .send(new_blog)
    .expect(201)
    partialDeepStrictEqual(res.body, new_blog)

    res = await api.get('/api/blogs')
    strictEqual(res.body.length, 7)
    
  })

  test('post without token', async () => {
    let new_blog = {title: "title1", author: "author1", url: "url1", likes: 1, user: valid_user_id}
    let res = await api.get('/api/blogs')
    strictEqual(res.body.length, 6)
    
    res = await api
    .post('/api/blogs')
    .send(new_blog)
    .expect(401)

    res = await api.get('/api/blogs')
    
  })

  test('missing likes ok', async () => {
    let new_blog_send = {title: "title1", author: "author1", url: "url1", user: valid_user_id}
    let new_blog_rcv = {title: "title1", author: "author1", url: "url1", likes: 0, user: valid_user_id}
    
    let res = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${valid_token}`)
    .send(new_blog_send)
    .expect(201)
    partialDeepStrictEqual(res.body, new_blog_rcv)
  })

  test('missing title fail', async () => {
    let new_blog = {author: "author1", url: "url1", likes: 1}
    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${valid_token}`)
    .send(new_blog)
    .expect(400)
  })

  test('missing url fail', async () => {
    let new_blog = {title: "title1", author: "author1", likes: 1}
    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${valid_token}`)
    .send(new_blog)
    .expect(400)
  })

  test('delete ok', async () => {
    let ret = await api.get('/api/blogs')
    const length_before = ret.body.length
    const valid_id = ret.body[0].id

    await api
      .delete(`/api/blogs/${valid_id}`)
      .set('Authorization', `Bearer ${valid_token}`)
      .expect(204)

    ret = await api.get('/api/blogs')
    const length_after = ret.body.length
    strictEqual(length_before, length_after + 1)
  })

  test('delete missing id fail', async () => {
    let ret = await api.get('/api/blogs')
    const length_before = ret.body.length

    await api
      .delete(`/api/blogs/${invalid_id}`)
      .set('Authorization', `Bearer ${valid_token}`)
      .expect(404)

    ret = await api.get('/api/blogs')
    const length_after = ret.body.length
    strictEqual(length_before, length_after)
  })

  test('update ok', async () => {
    let ret = await api.get('/api/blogs')
    const length_before = ret.body.length
    const valid_id = ret.body[0].id
    const likes_old = ret.body[0].likes
    const blog_old = ret.body[0]
    const blog_new = {...blog_old}
    blog_new.likes = likes_old + 5

    const blog_new_send = {...blog_new}
    blog_new_send.user = blog_old.user.id

    await api.put(`/api/blogs/${valid_id}`)
    .set('Authorization', `Bearer ${valid_token}`)
    .send(blog_new_send)
    .expect(204)

    ret = await api.get('/api/blogs')
    const length_after = ret.body.length
    strictEqual(length_before, length_after)

    ret = await api.get(`/api/blogs/${valid_id}`)
    deepStrictEqual(ret.body, blog_new)
  })

  test('update missing id fail', async () => {
    let ret = await api.get('/api/blogs')
    const length_before = ret.body.length
    const valid_id = ret.body[0].id
    const likes_old = ret.body[0].likes
    const blog_old = ret.body[0]
    const blog_new = {...blog_old}
    blog_new.likes = likes_old + 5

    const blog_new_send = {...blog_new}
    blog_new_send.user = blog_old.user.id

    await api.put(`/api/blogs/${invalid_id}`)
    .set('Authorization', `Bearer ${valid_token}`)
    .send(blog_new_send)
    .expect(404)

    ret = await api.get('/api/blogs')
    const length_after = ret.body.length
    strictEqual(length_before, length_after)

    ret = await api.get(`/api/blogs/${valid_id}`)
    deepStrictEqual(ret.body, blog_old)
  })
  
  test.after(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    await mongoose.connection.close()
  })
})