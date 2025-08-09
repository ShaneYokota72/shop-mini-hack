import React, {useState, useEffect} from 'react'

interface JudgingProps {
  navigate?: (path: string | number) => void
}

export function Judging({ navigate }: JudgingProps) {
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
    if (navigate) {
      navigate('/results')
    }
  }

  const handleGoBack = () => {
    if (navigate) {
      navigate(-1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 pt-12 px-4 pb-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={handleGoBack}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            ⚖️ Judging in Progress
          </h1>
          <p className="text-gray-600">
            Our expert panel is evaluating your submission. Please wait while we process your entry.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Evaluation in Progress</h2>
            <p className="text-gray-500">Your submission is being carefully reviewed</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300 ease-out"
                style={{width: `${progress}%`}}
              ></div>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">{currentStep}</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">🔍 Judging Criteria:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Creativity & Innovation:</strong> Originality and unique approach</li>
              <li>• <strong>Technical Excellence:</strong> Quality of implementation</li>
              <li>• <strong>User Experience:</strong> Usability and design quality</li>
              <li>• <strong>Problem Solving:</strong> How well it addresses the challenge</li>
              <li>• <strong>Overall Impact:</strong> Potential real-world value</li>
            </ul>
          </div>
        </div>

        {progress >= 100 && (
          <div className="text-center">
            <button 
              onClick={handleViewResults}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              View Results 🎉
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 