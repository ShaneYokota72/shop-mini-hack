import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import all page components
import { Landing } from './components/Landing'
import { Whiteboard } from './components/Whiteboard/Whiteboard'
import { Submission } from './components/Submission'
import { Judging } from './components/Judging'
import { Results } from './components/Results'

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
        <Route path="/submission" element={<Submission />} />
        <Route path="/judging" element={<Judging />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  )
}
