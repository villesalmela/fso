import jwt from 'jsonwebtoken'
import { compare } from 'bcrypt'
import { Router } from 'express'
import { User } from '../models/user.js'


const loginRouter = Router()

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await compare(password, user.passwordHash) // probably vulnerable to timing attack

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .json({ token, username: user.username, name: user.name })
})

export { loginRouter }