const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny', {skip: (req, res) => req.method === 'POST'}))

morgan.token('postcontent', function (req, res) { return JSON.stringify(req.body) })
const postlogger = morgan(':method :url :status :res[content-length] - :response-time ms :postcontent')
app.post(/\/*/, postlogger, (req, res, next) => {
    next()
})

function generateId() {
    return Math.floor(Math.random() * 1000) + ""
}

let persons = [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": "1"
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": "2"
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": "3"
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": "4"
    }
  ]

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else response.sendStatus(404)
  })


app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number
    if (!name) {
        response.status(400).send("Missing name")
        return
    }
    if (!number) {
        response.status(400).send("Missing number")
        return
    }
    if (persons.find(person => person.name === name)) {
        response.status(400).send("Name already exists")
        return
    }
    
    const id = generateId()
    const person = {name, number, id}
    persons.push(person)
    response.status(201).send(person)

})

app.delete('/api/persons/:id', (request, response) => {
const id = request.params.id
const person = persons.find(person => person.id === id)
if (person) {
    persons = persons.filter(person => person.id !== id)
    response.sendStatus(204)
} else response.sendStatus(404)
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        const name = request.body.name
        const number = request.body.number
        if (!name) {
            response.status(400).send("Missing name")
            return
        }
        if (!number) {
            response.status(400).send("Missing number")
            return
        }
        person.name = name
        person.number = number
        response.sendStatus(204)

    } else response.sendStatus(404)
    })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})