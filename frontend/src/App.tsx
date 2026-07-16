import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import NavBar from './components/NavBar'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import './App.css'

function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("recruitly_user");
    return raw ? JSON.parse(raw) : null;
  });

  return (
    <BrowserRouter>
      <NavBar user={user} />
      <Routes>
        <Route path="*" element={<NotFound />} />  {/* Not found if route not defined */}
        <Route path="/login" element={
          user ? <Navigate to="/" /> : <Login setUser={setUser} />
        } />
        <Route path="/" element={
          user ? <Home role={user.role} /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
