import React from 'react'
import { useNavigateWithTransition, Button } from '@shopify/shop-minis-react'

const DATA_NAVIGATION_TYPE_ATTRIBUTE = 'data-navigation-type';
const NAVIGATION_TYPES = {
  forward: 'forward',
  backward: 'backward'
} as const;

export function Results() {
  const navigate = useNavigateWithTransition()
  
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
    document.documentElement.setAttribute('data-navigation-type', 'forward');
    navigate('/');
  }

  const handleGoBack = () => {
    document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.backward);
    navigate(-1);
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
          <Button onClick={handleGoBack}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            🏆 Challenge Results
          </h1>
          <p className="text-gray-600">
            See how you performed in the creative challenge
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{results.rank.split(' ')[1]}</div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">{results.rank.split(' ')[0]} Medal!</h2>
            <p className="text-xl text-gray-600 mb-4">Overall Score: <span className="font-bold text-blue-600">{results.overallScore}/100</span></p>
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
              {results.category}
            </div>
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
          <Button onClick={handleStartNew}>
            Start New Challenge 🚀
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            🎉 Congratulations on completing the challenge!
          </p>
        </div>
      </div>
    </div>
  )
} 