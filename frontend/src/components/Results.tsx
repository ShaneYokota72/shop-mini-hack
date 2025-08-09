import React from 'react'

interface ResultsProps {
  navigate?: (path: string | number) => void
}

export function Results({ navigate }: ResultsProps) {
  // Simulate results
  const results = {
    overallScore: 87,
    rank: 'Gold Medal 🥇',
    category: 'UI/UX Design',
    scores: {
      creativity: 92,
      technical: 85,
      userExperience: 89,
      problemSolving: 84,
      impact: 88
    },
    feedback: "Outstanding submission! Your creative vision combined with excellent execution makes this a standout entry. The innovative approach to user experience is particularly impressive."
  }

  const handleStartNew = () => {
    if (navigate) {
      navigate('/')
    }
  }

  const handleGoBack = () => {
    if (navigate) {
      navigate(-1)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 pt-12 px-4 pb-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={handleGoBack}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            🎉 Challenge Results
          </h1>
          <p className="text-gray-600">
            Congratulations! Here are your final results from the judging panel.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{results.rank}</h2>
            <p className="text-gray-600">Category: {results.category}</p>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full text-white text-2xl font-bold mb-4">
              {results.overallScore}
            </div>
            <p className="text-lg font-semibold text-gray-700">Overall Score</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {Object.entries(results.scores).map(([category, score]) => (
              <div key={category} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreColor(score)}`}>
                    {score}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-800 mb-3">📝 Judge's Feedback:</h3>
            <p className="text-blue-700 leading-relaxed">{results.feedback}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm font-medium text-gray-700">Submissions</p>
              <p className="text-lg font-bold text-gray-800">1,247</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm font-medium text-gray-700">Your Rank</p>
              <p className="text-lg font-bold text-gray-800">Top 15%</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={handleStartNew}
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Start New Challenge 🚀
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Thank you for participating! Share your results with friends and try another challenge.
          </p>
        </div>
      </div>
    </div>
  )
} 