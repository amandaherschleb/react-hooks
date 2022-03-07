// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// custom hooks start with use
// custom hook = a function that uses hooks
function useLocalStorageState(key, defaultValue = '') {
  // using a function here allows it to only be called once
  // on additional renderings the initial value is not called
  // only need to use a function if calling an expensive operation 
  // not needed if just using initialName prop
  const [state, setState] = React.useState(
    () => window.localStorage.getItem(key) || defaultValue
  )

  React.useEffect(() => {
    window.localStorage.setItem(key, state)
  }, [key, state]) // only called when key or state change
  
  return [state, setState]

}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState()

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
