import { useEffect, useState } from 'react'
import CanvasImageView from './CanvasImageView'
import {useNavigateWithTransition, NAVIGATION_TYPES, DATA_NAVIGATION_TYPE_ATTRIBUTE} from '@shopify/shop-minis-react'

export default function Winner() {
  const navigation = useNavigateWithTransition()
  const [winners, setWinners] = useState<any[]>([])
  const [winnerInView, setWinnerInView] = useState<number>(0)

  useEffect(() => {
    const fetchWinners = async () => {
      console.log('Fetching winners...')
      const response = await fetch('http://localhost:8080/api/getWinners')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      const sortedData = data.data.sort((a: any, b: any) => b.elo - a.elo)
      const topThree = sortedData.slice(0, 3)
      console.log('Top 3 Winners:', topThree)
      setWinners(topThree)
    }
    fetchWinners()
  },[])

  const handleNextWinner = () => {
    if(winnerInView >= 2) {
      document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.forward);
      navigation('/results')
      return
    }
    setWinnerInView(winnerInView + 1)
  }

  const handlePreviousWinner = () => {
    if(winnerInView <= 0) {
      document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.backward);
      navigation('/results')
      return
    }
    setWinnerInView(winnerInView - 1)
  }
  
  return (
    <div className='min-h-screen bg-[#0D0D0D] px-2 text-white flex flex-col items-center'>
      {winners[winnerInView] ? (
          <>
            <CanvasImageView 
              canvasImage={winners[winnerInView].img} 
              genImage={winners[winnerInView].generated_image}
            />
            <p className='text-6xl font-semibold mt-12 mb-6'>
              {
                winnerInView === 0 ? '🥇' 
                : winnerInView === 1 ? '🥈'
                : '🥉'
              }
              {winners[winnerInView].title}
            </p>
            <div className="bg-black border-t border-gray-800 pb-8">
              <div className="flex items-center justify-between space-x-4 mt-6">
                <button
                  onClick={handlePreviousWinner}
                  className="text-white bg-[#3E3E3E] rounded-full py-2 px-4"
                >
                  Back
                </button>
                <button className="text-black bg-[#FFFFFF] rounded-full py-2 px-4">
                  View Products
                </button>
                <button
                  onClick={handleNextWinner}
                  className="text-white bg-[#5433EB] rounded-full py-2 px-4"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-32">
            <svg className="animate-spin h-12 w-12 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="text-lg text-gray-300">Loading winners...</span>
          </div>
        )
      }
    </div>
  )
}
