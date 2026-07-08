import { useState } from 'react'
import AuthModel from './components/AuthModel'

function App() {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <h1>Recruitly</h1>
      <button onClick={() => setShowAuth(true)}>Sign In</button>
      <AuthModel isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  )
}

export default App
