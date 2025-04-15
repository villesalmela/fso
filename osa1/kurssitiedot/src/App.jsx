const Header = ({course}) => {
  return (
    <h1>{course.name}</h1>
  )
}

const Part = ({course, i}) => {
  const {name, exercises} = course.parts[i]
  return (
    <p>{name} {exercises}</p>
  )
}

const Content = ({course}) => {
  
  return (
    <>
      <Part course={course} i={0} />
      <Part course={course} i={1} />
      <Part course={course} i={2} />
    </>
  )
}



const Total = ({course}) => {
  const parts = course.parts
  return (
    <p>Number of exercises {parts[0].exercises + parts[1].exercises + parts[2].exercises}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default App