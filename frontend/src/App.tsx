import {Routes, Route} from 'react-router'
// Import all  components
import {Landing} from './components/Landing'
import {Whiteboard} from './components/Whiteboard/Whiteboard'
import {Submission} from './components/Submission'
import {Judging} from './components/Judging'
import {Results} from './components/Results'
import {Calendar} from './components/Calendar'
import Winner from './components/Winner'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/whiteboard" element={<Whiteboard />} />
      <Route path="/submission" element={<Submission />} />
      <Route path="/judging" element={<Judging />} />
      <Route path="/results" element={<Results />} />
      <Route path="/calendar/:friendId" element={<Calendar />} />
      <Route path="/winners-1" element={<Winner />} />
      <Route path="/winners-2" element={<Winner />} />
      <Route path="/winners-3" element={<Winner />} />
    </Routes>
  )
}
