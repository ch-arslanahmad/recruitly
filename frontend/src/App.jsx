import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import JobCard from './components/JobCard'
import Login from './pages/Login'
import NavBar from './components/NavBar'
import NotFound from './pages/NotFound'
import './App.css'

const initialJobs = [
    { id: 1, title: 'Software Engineer', company: 'Tech Corp', location: 'Remote', salary: '$100k', type: 'full-time' },
    { id: 2, title: 'UI Designer', company: 'Creative Studio', location: 'New York', salary: '$85k', type: 'part-time' },
    { id: 3, title: 'Backend Developer', company: 'DataFlow', location: 'San Francisco', salary: '$120k', type: 'full-time' },
];

function App() {
  const [user, setUser] = useState(() => {
    const session = localStorage.getItem("recruitly_session");
    return session ? JSON.parse(session) : null;
  });

  return (
    <BrowserRouter>
      <NavBar user={user} />
      <Routes>
        
        {
        
          /* For testing component itself we put it in a seperate route */
        
        
        
        }

                <Route path="*" element={<NotFound />} />


        <Route path="/login" element={
          user ? <Navigate to="/" /> : <Login setUser={setUser} />
        } />
        <Route path="/" element={
          user ? <JobCard job={initialJobs[0]} /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
