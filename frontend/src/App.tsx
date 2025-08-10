import {Routes, Route} from 'react-router'

// Import all page components
import {Landing} from './components/Landing'
import {Whiteboard} from './components/Whiteboard/Whiteboard'
import {Submission} from './components/Submission'
import {Judging} from './components/Judging'
import {Results} from './components/Results'
import {Loading} from './components/Loading'
import Winner from './components/Winner'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/whiteboard" element={<Whiteboard />} />
      <Route path="/judging" element={<Judging />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/submission" element={<Submission />} />
      <Route path="/results" element={<Results />} />
      <Route path="/winners-1" element={<Winner />} />
      <Route path="/winners-2" element={<Winner />} />
      <Route path="/winners-3" element={<Winner />} />
    </Routes>
  )
}
