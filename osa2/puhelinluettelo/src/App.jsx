import { useState, useEffect, use } from 'react'
import numbersService from './services/numbers'

const FilterInput = ({ onChange, value }) => {
  return (
  <>
  filter: <input onChange={onChange} value={value}/>
  </>
)
}

const AddInputs = ({ nameValue, numberValue, nameFunc, numberFunc }) => {
  return (
    <>
    <div>name: <input value={nameValue} onChange={nameFunc} /></div>
    <div>number: <input value={numberValue} onChange={numberFunc} /></div>
    <div><button type="submit">add</button></div>
    </>
  )
}

const Display = ({ persons, filter, setPersons, setNotification }) => {
  let pList = [...persons]
    if (filter.length > 0) {
      pList = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    }
    return (
      <>
      <ul>
      {pList.map(person => <li key={person.name}>
        {person.name} {person.number}
        <button onClick={() => {
          if (window.confirm(`Delete ${person.name}?`)) {
            numbersService.remove(person.id).then(() => {
              setPersons(persons.filter(x => x.id !== person.id))
              setNotification(`Deleted ${person.name}`)
              setTimeout(() => {setNotification(null)}, 5000)
            })
          }
        }}>delete</button>
      </li>)}
      </ul>
      </>
    )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const hook = () => {
    numbersService.getAll().then(data => setPersons(data))
  }
  useEffect(hook, [])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)
  
  const handleFilterEdit = (event) => {
    event.preventDefault()
    setFilter(event.target.value)
  }

  const handleNameEdit = (event) => {
    event.preventDefault()
    setNewName(event.target.value)
  }

  const handleNumberEdit = (event) => {
    event.preventDefault()
    setNewNumber(event.target.value)
  }

  const handleSave = (event) => {
    event.preventDefault()
    if (persons.some(x => x.name === newName)) {
      if (window.confirm(`${newName} is already added, do you want to replace?`)) {
        const person = persons.find(x => x.name === newName)
        const updatedPerson = {...person, number: newNumber}
        numbersService.update(person.id, updatedPerson)
          .then( () => {
            const freshPersons = [...persons]
            freshPersons[persons.indexOf(person)] = updatedPerson
            setPersons(freshPersons)
            setNewName('')
            setNewNumber('')
            setNotification(`Updated ${newName}`)
            setTimeout(() => {setNotification(null)}, 5000)
          })
          .catch( () => {
            setError(`${person.name} has already been removed`)
            setTimeout(() => {setError(null)}, 5000)
          })
      } else return // user cancelled
    } else { // actually new name
      numbersService.create({name: newName, number: newNumber})
        .then(data => {
          setPersons(persons.concat(data))
          setNewName('')
          setNewNumber('')
          setNotification(`Added ${newName}`)
          setTimeout(() => {setNotification(null)}, 5000)
        })
        .catch(error => {
          setError(error.response.data.error)
          setTimeout(() => {setError(null)}, 5000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Error message={error} />
      <FilterInput onChange={handleFilterEdit} value={filter} />
      <h2>Add a new</h2>
      <form onSubmit={handleSave}>
        <AddInputs 
          nameValue={newName} 
          numberValue={newNumber} 
          nameFunc={handleNameEdit} 
          numberFunc={handleNumberEdit}
        />
      </form>
      <h2>Numbers</h2>
      <Display persons={persons} filter={filter} setPersons={setPersons} setNotification={setNotification} />
    </div>
  )

}

export default App