await import('./utils/config.js')
import express, { json } from 'express'
import { blogsRouter } from './controllers/blogs.js'
import { usersRouter } from './controllers/users.js'
import { loginRouter } from './controllers/login.js'
import { tokenExtractor } from './utils/middleware.js'


import mongoose from 'mongoose'
let MONGODB_URI
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
} else {
  MONGODB_URI = process.env.MONGODB_URI
}
mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

const app = express()

app.use(json())
app.use(tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

export { app }