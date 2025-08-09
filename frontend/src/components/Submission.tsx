import React, {useState} from 'react'

interface SubmissionProps {
  navigate?: (path: string | number) => void
}

export function Submission({ navigate }: SubmissionProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    email: ''
  })

  const handleGoBack = () => {
    if (navigate) {
      navigate(-1)
    }
  }

  const handleSubmit = () => {
    if (formData.title && formData.category && formData.description && formData.email && navigate) {
      navigate('/judging')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}))
  }

  const isFormValid = formData.title && formData.category && formData.description && formData.email

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
            📝 Submit Your Entry
          </h1>
          <p className="text-gray-600">
            Finalize your submission with the details below.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter a catchy title for your project"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="design">UI/UX Design</option>
                <option value="development">Development</option>
                <option value="innovation">Innovation</option>
                <option value="business">Business Solution</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a detailed description of your project, its features, and what makes it special"
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>📋 Submission Guidelines:</strong> Make sure all required fields are completed. 
              Your submission will be reviewed by our panel of judges based on creativity, 
              innovation, and implementation quality.
            </p>
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
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-colors ${
              isFormValid 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Entry 🎯
          </button>
        </div>
      </div>
    </div>
  )
} 