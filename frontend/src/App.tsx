import React, {useState} from 'react'
import {useDeeplink} from '@shopify/shop-minis-react'

// Import all page components
import {Landing} from './components/Landing'
import {Whiteboard} from './components/Whiteboard'
import {Submission} from './components/Submission'
import {Judging} from './components/Judging'
import {Results} from './components/Results'

export function App() {
  const deeplinkData = useDeeplink()
  const [currentPage, setCurrentPage] = useState('/')
  
  // Try to get path from deeplink, fallback to state
  const path = deeplinkData?.path || currentPage

  // Debug log to see what we're getting
  console.log('Deeplink data:', deeplinkData)
  console.log('Current path:', path)
  console.log('Current page state:', currentPage)

  // Navigation function that we'll pass to components
  const navigate = (newPath: string | number) => {
    console.log('Navigate called with:', newPath)
    if (typeof newPath === 'number') {
      // Handle back navigation
      setCurrentPage('/')
    } else {
      setCurrentPage(newPath)
    }
  }

  // Route to appropriate component based on path
  const renderPage = () => {
    console.log('Rendering page for path:', path)
    
    switch (path) {
      case '/whiteboard':
        return <Whiteboard navigate={navigate} />
      case '/submission':
        return <Submission navigate={navigate} />
      case '/judging':
        return <Judging navigate={navigate} />
      case '/results':
        return <Results navigate={navigate} />
      case '/':
        return <Landing navigate={navigate} />
      case '':
      default:
        return <Landing navigate={navigate} />
    }
  }

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  )
}
