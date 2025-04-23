import dotenv from 'dotenv'
dotenv.config()

const db = await import('./models/person.js')
const Person = db.Person
import express from 'express'
import logger from './logger.js'

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(logger.tinylogger)
app.post(/\/*/, logger.postlogger, (req, res, next) => {
    next()
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
  .then(result =>
    response.send(`<p>Phonebook has info for ${result} people</p><p>${new Date()}</p>`)
  )
  .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
  .then(result => response.json(result))
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(result => {
      if (result) response.json(result)
      else response.sendStatus(404)
    })
    .catch(error => next(error))
  })

app.post('/api/persons', (request, response, next) => {
    const name = request.body.name
    const number = request.body.number
    if (!name) {
        response.status(400).json({error: "Missing name"})
        return
    }
    if (!number) {
        response.status(400).json({error: "Missing number"})
        return
    }
    Person.exists({name: name})
      .then(result => {
        if (result) {
          response.status(400).json({error: "Name already exists"})
        } else {
          Person.create({name, number})
            .then(result => response.status(201).send(result))
            .catch(error => next(error))
        }
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
Person.findByIdAndDelete(request.params.id)
.then(result => response.sendStatus(204))
.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
  const name = request.body.name
  const number = request.body.number
  if (!name) {
      response.status(400).json({error: "Missing name"})
      return
  }
  if (!number) {
      response.status(400).json({error: "Missing number"})
      return
  }  
  Person.findByIdAndUpdate(request.params.id, {name, number})
  .then(result => {
    if (result) response.sendStatus(204)
    else response.sendStatus(404)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})