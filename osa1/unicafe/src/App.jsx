import { useState } from 'react'

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const plusOne = ({variable, setter}) => () => setter(variable + 1)
const avg = ({good, neutral, bad}) => (good - bad) / (good + neutral + bad)
const positive = ({good, neutral, bad}) => (good / (good + neutral + bad)) * 100
const total = ({good, neutral, bad}) => good + neutral + bad

const Statistics = ({good, neutral, bad}) => {
  if (total({good, neutral, bad}) === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <>
    <table><tbody>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={total({good, neutral, bad})} />
      <StatisticLine text="average" value={avg({good, neutral, bad})} />
      <StatisticLine text="positive" value={positive({good, neutral, bad})} />
      </tbody></table>
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={plusOne({variable: good, setter: setGood})} text="good" />
      <Button handleClick={plusOne({variable: neutral, setter: setNeutral})} text="neutral" />
      <Button handleClick={plusOne({variable: bad, setter: setBad})} text="bad" />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App