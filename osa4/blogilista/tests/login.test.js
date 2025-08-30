import { test, describe } from 'node:test'
import { strictEqual, deepStrictEqual, partialDeepStrictEqual } from 'node:assert'
import { app } from '../app.js'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { User } from '../models/user.js'

const api = supertest(app)

const newUser = {
  username: 'test',
  name: 'Test',
  password: 'testpass'
}

test.before(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.TEST_MONGODB_URI)
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
})

describe('login', () => {
    test('login ok', async () => {
        const credentials = {
            username: 'test',
            password: 'testpass'
        }

        const response = await api
            .post('/api/login')
            .send(credentials)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        strictEqual(response.body.username, credentials.username)
        strictEqual(response.body.name, newUser.name)
        deepStrictEqual(typeof response.body.token, 'string')
    })

    test('login fails with wrong password', async () => {
        const credentials = {
            username: 'test',
            password: 'wrongpass'
        }

        const response = await api
            .post('/api/login')
            .send(credentials)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        partialDeepStrictEqual(response.body, { error: 'invalid username or password' })
    })

    test('login fails with nonexisting user', async () => {
        const credentials = {
            username: 'nonexisting',
            password: 'somepass'
        }

        const response = await api
            .post('/api/login')
            .send(credentials)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        partialDeepStrictEqual(response.body, { error: 'invalid username or password' })
    })
})

test.after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
})