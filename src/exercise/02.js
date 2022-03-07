// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// custom hooks start with use
// custom hook = a function that uses hooks
// third arg is an object of options 
function useLocalStorageState(
  key, 
  defaultValue = '', 
  { serialize = JSON.stringify, deserialize = JSON.parse } = {},
) {
  // using a function here allows it to only be called once
  // on additional renderings the initial value is not called
  // only need to use a function if calling an expensive operation 
  // not needed if just using initialName prop
  const [state, setState] = React.useState(() => {
      const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  // if key changes we want to remove the old key from local storage
  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state]) // only called when key or state change
  
  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

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
