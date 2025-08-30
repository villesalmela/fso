import { test, describe } from 'node:test'
import { strictEqual, deepStrictEqual, partialDeepStrictEqual } from 'node:assert'
import { app } from '../app.js'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { User } from '../models/user.js'

const api = supertest(app)

test.before(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.TEST_MONGODB_URI)
  }
})


test.beforeEach(async () => {
    await User.deleteMany({})
})

describe('users', () => {
    test('user create ok', async () => {
        const newUser = {
            username: 'test',
            name: 'Test',
            password: 'testpass'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        const users = await User.find({})
        strictEqual(users.length, 1)
        deepStrictEqual(users[0].username, newUser.username)
        deepStrictEqual(users[0].name, newUser.name)
    })

    test('user create invalid username', async () => {
        const newUser = {
            username: 'te',
            name: 'Test',
            password: 'testpass'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
            .expect({ error: 'User validation failed: username: username must be at least 3 characters long' })

    })
    test('user create invalid password', async () => {
        const newUser = {
            username: 'test',
            name: 'Test',
            password: 'te'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
            .expect({ error: 'password too short (min 3 characters)' })

    })

    test('user create duplicates', async () => {
        const newUser = {
            username: 'test',
            name: 'Test',
            password: 'testpass'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
            .expect({ error: 'username must be unique' })

    })
})

test.after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
})