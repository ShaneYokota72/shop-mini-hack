import React, { useState, useEffect } from 'react'

interface SubmissionProps {
  navigate?: (path: string | number) => void
}

export function Submission({ navigate }: SubmissionProps) {
  const [title, setTitle] = useState('')
  const [canvasImage, setCanvasImage] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    console.log('Submission component mounted')
    
    // Get the canvas image from sessionStorage
    const storedImage = sessionStorage.getItem('canvasImage')
    console.log('Retrieved image from sessionStorage:', !!storedImage)
    console.log('Image length:', storedImage?.length || 0)
    
    if (storedImage) {
      setCanvasImage(storedImage)
      console.log('Canvas image set in state')
      // Don't clean up immediately for debugging
      // sessionStorage.removeItem('canvasImage')
    } else {
      console.error('No image found in sessionStorage')
    }
  }, [])

  const handleGoBack = () => {
    if (navigate) {
      navigate(-1)
    }
  }

  const handleSubmit = () => {
    if (title.trim() && canvasImage) {
      setShowPreview(true)
    }
  }

  const handleFinalSubmit = () => {
    if (navigate) {
      navigate('/judging')
    }
  }

  const isFormValid = title.trim() && canvasImage

  if (showPreview) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Header */}
        <div className="bg-black shadow-sm p-4">
          <button 
            onClick={() => setShowPreview(false)}
            className="mb-3 text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Back to Edit
          </button>
          <h1 className="text-xl font-medium text-white text-center">
            Preview Submission
          </h1>
        </div>

        {/* Preview Content */}
        <div className="flex-1 p-6">
          <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">"{title}"</h2>
            
            {canvasImage && (
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <img 
                  src={canvasImage} 
                  alt="Canvas creation" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-6">
              <p className="text-green-300 text-sm">
                ✨ Your creative masterpiece is ready for judging!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowPreview(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
              >
                Edit
              </button>
              <button 
                onClick={handleFinalSubmit}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
              >
                Submit 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black shadow-sm p-4">
        <button 
          onClick={handleGoBack}
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-xl font-medium text-white text-center">
          Submit your creation
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto">
          {canvasImage ? (
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3 text-white">Your Canvas Creation:</h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <img 
                  src={canvasImage} 
                  alt="Canvas creation" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 mb-6 text-center">
              <p className="text-gray-400">No canvas image found</p>
              <p className="text-sm text-gray-500 mt-2">Go back and create something on the whiteboard first!</p>
            </div>
          )}

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                Give your creation a title:
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a creative title..."
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-gray-700 text-white placeholder-gray-400"
                autoFocus
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full font-medium py-3 px-6 rounded-lg transition-all duration-300 ${
                isFormValid 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform hover:scale-105 active:scale-95' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Preview & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 