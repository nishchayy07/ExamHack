import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Results from './pages/Results'
import Profile from './pages/Profile'
import AnimatedBackground from './components/AnimatedBackground'

function App() {
  return (
    <Router>
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
