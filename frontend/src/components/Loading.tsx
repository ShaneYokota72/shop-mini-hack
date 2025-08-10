import { useEffect, useState } from 'react'
import {useNavigateWithTransition, NAVIGATION_TYPES, DATA_NAVIGATION_TYPE_ATTRIBUTE} from '@shopify/shop-minis-react'

export function Loading() {
  const navigation = useNavigateWithTransition()
  const [dots, setDots] = useState(1)

  useEffect(() => {
    // Animate dots
    const interval = setInterval(() => {
      setDots(prev => (prev % 3) + 1)
    }, 500)

    // Check if AI generation is complete
    const checkGeneration = () => {
      const generationStatus = sessionStorage.getItem('generationStatus')
      if (generationStatus === 'complete') {
        document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.forward);
        navigation('/submission')
      } else {
        // Check again in a bit
        setTimeout(checkGeneration, 100)
      }
    }

    checkGeneration()

    return () => clearInterval(interval)
  }, [navigation])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <div className="text-center">
        <div className="text-6xl mb-8">🎨</div>
        <h1 className="text-2xl font-bold mb-4">Creating your AI model</h1>
        <p className="text-gray-400 mb-8">Making you look amazing for the concert{'.'.repeat(dots)}</p>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}