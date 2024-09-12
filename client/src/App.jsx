import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TestChat from './components/TestChat'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TestChat/>
    </>
  )
}

export default App
