const Header = ({course}) => {
    return (
      <h1>{course.name}</h1>
    )
  }
  
  const Part = ({name, exercises}) => {
    return (
      <p>{name} {exercises}</p>
    )
  }
  
  const Content = ({course}) => {
    
    return (
        course.parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />)
    )
  }
  
  
  
  const Total = ({course}) => {
    return (
      <p>Number of exercises {
      course.parts.map(part => part.exercises).reduce((total, current) => total + current)
      }</p>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
      </div>
    )
  }

export default Course