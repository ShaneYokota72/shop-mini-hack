import React, {useState} from 'react'

interface WhiteboardProps {
  navigate?: (path: string | number) => void
}

export function Whiteboard({ navigate }: WhiteboardProps) {
  const [ideas, setIdeas] = useState('')

  const handleGoBack = () => {
    console.log('Go back clicked')
    if (navigate) {
      navigate(-1)
    }
  }

  const handleProceedToSubmission = () => {
    console.log('Proceed to submission clicked')
    if (ideas.trim() && navigate) {
      navigate('/submission')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12 px-4 pb-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={handleGoBack}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            🎨 Whiteboard Your Ideas
          </h1>
          <p className="text-gray-600">
            Sketch out your creative concept. Describe your vision in detail.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Creative Vision
            </label>
            <textarea
              value={ideas}
              onChange={(e) => setIdeas(e.target.value)}
              placeholder="Describe your creative idea, concept, or design. What makes it unique? How would you implement it?"
              className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="text-sm text-gray-500 mb-4">
            {ideas.length}/1000 characters
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Tips for a great submission:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Be specific about your concept</li>
              <li>• Explain the problem you're solving</li>
              <li>• Describe the user experience</li>
              <li>• Mention any unique features or innovations</li>
            </ul>
          </div>
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={handleGoBack}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Previous
          </button>
          <button 
            onClick={handleProceedToSubmission}
            disabled={!ideas.trim()}
            className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-colors ${
              ideas.trim() 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Proceed to Submission
          </button>
        </div>
      </div>
    </div>
  )
} 