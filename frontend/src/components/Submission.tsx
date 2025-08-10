import React, { useState, useEffect } from 'react'
import { useCurrentUser } from '@shopify/shop-minis-react'
import {useNavigateWithTransition, NAVIGATION_TYPES, DATA_NAVIGATION_TYPE_ATTRIBUTE} from '@shopify/shop-minis-react'

export function Submission() {
  const [title, setTitle] = useState('')
  const [canvasImage, setCanvasImage] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const navigation = useNavigateWithTransition()
  // Get current user from Shopify Shop Minis
  const { currentUser } = useCurrentUser()

  useEffect(() => {
    console.log('Submission component mounted')
    
    // Get the canvas image from sessionStorage
    const storedImage = sessionStorage.getItem('canvasImage')
    console.log('Retrieved image from sessionStorage:', !!storedImage)
    console.log('Image length:', storedImage?.length || 0)
    
    if (storedImage) {
      setCanvasImage(storedImage)
      console.log('Canvas image set in state')
    } else {
      console.error('No image found in sessionStorage')
    }
  }, [])

  const handleGoBack = () => {
    document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.backward);
    navigation(-1)
  }

  const handleSubmit = () => {
    if (title.trim() && canvasImage) {
      setShowPreview(true)
    }
  }

  // Generate a proper UUID v4
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const handleFinalSubmit = async () => {
    if (!title.trim() || !canvasImage) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('http://localhost:8080/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: generateUUID(),
          img: canvasImage,
          title: title.trim(),
          displayName: currentUser?.displayName || 'Anonymous User'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Submission failed')
      }

      const result = await response.json()
      console.log('Submission successful:', result)

      // Clean up stored image after successful submission
      sessionStorage.removeItem('canvasImage')

      // Navigate to judging page
      document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.forward);
      navigation('/judging')
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
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
            disabled={isSubmitting}
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

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-sm">
                  ❌ {submitError}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowPreview(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
                disabled={isSubmitting}
              >
                Edit
              </button>
              <button 
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className={`font-medium py-3 px-4 rounded-lg transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit 🚀'
                )}
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