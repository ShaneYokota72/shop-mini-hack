import React from 'react'
import {Routes, Route} from 'react-router'
// Import all  components
import {Landing} from './components/Landing'
import {Whiteboard} from './components/Whiteboard/Whiteboard'
import {Submission} from './components/Submission'
import {Judging} from './components/Judging'
import {Results} from './components/Results'
import {Calendar} from './components/Calendar'
import {Loading} from './components/Loading'
import Winner from './components/Winner'
import {CalendarPreview} from './components/CalendarPreview'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/whiteboard" element={<Whiteboard />} />
      <Route path="/judging" element={<Judging />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/submission" element={<Submission />} />
      <Route path="/results" element={<Results />} />
      <Route path="/winners" element={<Winner />} />
      <Route path="/calendar/:friendId" element={<Calendar />} />
      <Route path="/calendar-preview/:friendId" element={<CalendarPreview />} />
    </Routes>
  )
}
