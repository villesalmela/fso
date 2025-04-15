import { useState } from 'react'

const getRandomInt = (max) => Math.floor(Math.random() * max)

const giveNext = (setSelected, anecdotes) => {
  setSelected(getRandomInt(anecdotes.length))
}

const vote = (selected, votes, setVotes, setLargest) => {
  const new_votes = [...votes]
  ++new_votes[selected]
  setVotes(new_votes)
  setLargest(findLargest(new_votes))
}

const findLargest = (votes) => {
  let largest = 0
  for (let i = 1; i < votes.length; ++i) {
    if (votes[i] > votes[largest]) {
      largest = i
    }
  }
  return (largest)
}

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  const [largest, setLargest] = useState(0)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button onClick={() => giveNext(setSelected, anecdotes)} text="give next" />
      <Button onClick={() => vote(selected, votes, setVotes, setLargest)} text="vote" />
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[largest]}</p>
      <p>has {votes[largest]} votes</p>
    </div>
  )
}

export default App