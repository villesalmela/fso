import jwt from 'jsonwebtoken'

const tokenExtractor = (request, response, next) => {
  const token = request.get('authorization')
  if (token && token.startsWith('Bearer ')) {
    request.token = token.replace('Bearer ', '')
  } else {
    request.token = null
  }

  next()
}

const userExtractor = (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  request.user = decodedToken
  next()
}

export { tokenExtractor, userExtractor }