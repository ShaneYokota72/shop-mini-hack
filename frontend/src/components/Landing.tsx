import React from 'react'

interface LandingProps {
  navigate?: (path: string) => void
}

export function Landing({ navigate }: LandingProps) {
  const handleStartChallenge = () => {
    console.log('Start challenge clicked')
    if (navigate) {
      navigate('/whiteboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-12 px-4 pb-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            🎨 Creative Challenge
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Welcome to the ultimate creative challenge! Show off your skills through our interactive flow.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Challenge Flow</h2>
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center">1</span>
              <span className="text-gray-600">Whiteboard your ideas</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-gray-300 text-white rounded-full text-sm flex items-center justify-center">2</span>
              <span className="text-gray-600">Submit your creation</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-gray-300 text-white rounded-full text-sm flex items-center justify-center">3</span>
              <span className="text-gray-600">Judging phase</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-gray-300 text-white rounded-full text-sm flex items-center justify-center">4</span>
              <span className="text-gray-600">See results</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleStartChallenge}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Start Challenge 🚀
        </button>
      </div>
    </div>
  )
} 