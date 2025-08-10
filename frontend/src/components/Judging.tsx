import React, { useState, useEffect } from 'react'
import { useNavigateWithTransition, Button } from '@shopify/shop-minis-react'

const DATA_NAVIGATION_TYPE_ATTRIBUTE = 'data-navigation-type';
const NAVIGATION_TYPES = {
  forward: 'forward',
  backward: 'backward'
} as const;

export function Judging() {
  const navigate = useNavigateWithTransition()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('Receiving submission...')

  const judgingSteps = [
    'Receiving submission...',
    'Initial review...',
    'Evaluating creativity...',
    'Assessing technical merit...',
    'Scoring innovation...',
    'Final deliberation...',
    'Preparing results...'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 800)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const stepIndex = Math.floor((progress / 100) * judgingSteps.length)
    setCurrentStep(judgingSteps[Math.min(stepIndex, judgingSteps.length - 1)])
  }, [progress])

  const handleViewResults = () => {
    document.documentElement.setAttribute('data-navigation-type', 'forward');
    navigate('/results');
  }

  const handleGoBack = () => {
    document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.backward);
    navigate(-1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 pt-12 px-4 pb-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button onClick={handleGoBack}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            ⚖️ Judging in Progress
          </h1>
          <p className="text-gray-600">
            Our expert judges are reviewing your submission
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">👨‍⚖️</div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">Evaluation in Progress</h2>
            <p className="text-gray-600">Your submission is being carefully reviewed</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center mt-4 text-gray-600 font-medium">{currentStep}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-4 text-gray-700">🔍 Evaluation Criteria:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-xl">💡</span>
                <span className="text-sm text-gray-600">Creativity & Innovation</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xl">⚙️</span>
                <span className="text-sm text-gray-600">Technical Execution</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xl">👤</span>
                <span className="text-sm text-gray-600">User Experience</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xl">🎯</span>
                <span className="text-sm text-gray-600">Problem Solving</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xl">🎨</span>
                <span className="text-sm text-gray-600">Visual Appeal</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xl">⭐</span>
                <span className="text-sm text-gray-600">Overall Impact</span>
              </div>
            </div>
          </div>

          {progress >= 100 && (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-green-800 mb-2">✅ Judging Complete!</h3>
                <p className="text-green-700">Your results are ready to view.</p>
              </div>
              <Button onClick={handleViewResults}>
                View Results 🏆
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 