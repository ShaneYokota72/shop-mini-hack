import React, { useEffect } from 'react'
import {useNavigateWithTransition, NAVIGATION_TYPES, DATA_NAVIGATION_TYPE_ATTRIBUTE} from '@shopify/shop-minis-react'

export function Results() {
  const navigation = useNavigateWithTransition()
  const [result, setResult] = React.useState<any>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/getAll')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        data.data.sort((a: any, b: any) => b.elo - a.elo)
        let winner = data.data[0]
        winner.rank = 'Best Submission 🥇'
        winner.category = 'Make the best fit for $50'
        winner.total_submissions = data.data.length
        winner.winner_name = winner.display_name || 'Daniel Kim'
        setResult(winner);
      } catch (error) {
        console.error('Error fetching results:', error)
      }
    }
    fetchResults()
  }, [])

  const handleStartNew = () => {
    document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.forward);
    navigation('/')
  }

  const handleGoBack = () => {
    document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.backward);
    navigation(-1)
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-12 px-4 pb-6">
      <div className="max-w-2xl mx-auto">
        {result ? (
          <>
            <div className="mb-6">
              <button 
                onClick={handleGoBack}
                className="mb-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
              >
                ← Back
              </button>
              <h1 className="text-3xl font-bold mb-2 text-white">
                🎉 Challenge Results 🥁
              </h1>
              <p className="text-gray-300">
                Congratulations {result.winner_name}!
              </p>
            </div>

            <div className=" border border-gray-700 rounded-lg shadow-lg p-8 mb-6">
              <div className="text-center mb-2">
                <div className="text-4xl mb-2">🏆</div>
                <h2 className="text-2xl font-bold text-white">{result.rank}</h2>
                <p className="text-gray-300">Category: {result.category}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-900 border border-gray-600 rounded-lg">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-sm font-medium text-gray-300">Submissions</p>
                  <p className="text-lg font-bold text-white">{result.total_submissions}</p>
                </div>
                <div className="text-center p-4 bg-gray-900 border border-gray-600 rounded-lg">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="text-sm font-medium text-gray-300">User Name</p>
                  <p className="text-lg font-bold text-white">{result.winner_name}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-400">Loading results...</p>
          </div>
        )}

        {/* component to show the feedback */}

        <div className="flex space-x-4">
          <button 
            onClick={handleStartNew}
            className="flex-1 text-white border-1 border-white rounded-lg font-semibold py-3 px-6 transition-all duration-300 shadow-lg"
          >
            View potential shop items 🚀
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Thank you for participating! Share your results with friends and try another challenge.
          </p>
        </div>
      </div>
    </div>
  )
}