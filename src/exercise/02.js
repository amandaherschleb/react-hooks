// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = ''}) {

  // using a function here allows it to only be called once
  // on additional renderings the initial value is not called
  // only need to use a function if calling an expensive operation 
  // not needed if just using initialName prop
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name') || initialName
  )

  // useEffect runs everytime a re-render happens if called without second arg
  React.useEffect(() => {
    window.localStorage.setItem('name', name)
  }, [name]) // now only called when name changes

  function handleChange(event) {
    setName(event.target.value)
  }
  
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
