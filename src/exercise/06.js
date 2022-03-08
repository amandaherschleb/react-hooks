// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

import {PokemonForm, PokemonInfoFallback, PokemonDataView, fetchPokemon} from '../pokemon'

// passing in FallbackComponent makes this more reusable
class ErrorBoundary extends React.Component {
  state = {
    error: null
  }

  static getDerivedStateFromError(error) {
    // update state with error
    return {error}
  }

  render() {
    const {error} = this.state
    if (error) {
      return <this.props.FallbackComponent error={error} />
    }
    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  // in the future, useReducer would probably be a better solution than one state object
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null
  })

  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    // NOTE: all other keys of state are removed with this update
    setState({status: 'pending'})

    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({
          pokemon: pokemon, 
          status: 'resolved'
        })
      },
      error => {
        setState({
          error,
          status: 'rejected'
        })
      }
    )
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    // error boundary will catch this
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={null} /> // forcing an error by sending null here
  }

  throw new Error('This should not be possible')
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
