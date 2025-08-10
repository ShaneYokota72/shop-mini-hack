import { useEffect, useState } from "react"

export default function JudgeCard({
    title,
    handleJudged,
    imageData,
    isLeft,
    isSelected = false,
    isDisabled = false,
}: {
    title: string,
    handleJudged: (item: number) => void,
    imageData: string,
    isLeft: boolean,
    isSelected?: boolean,
    isDisabled?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [optimizedImageSrc, setOptimizedImageSrc] = useState<string>("")

  useEffect(() => {
    let mounted = true
    setImageLoaded(false)
    setImageError(false)
    setOptimizedImageSrc("")

    // Optimize image loading for base64 data
    const optimizeImage = async () => {
      if (!imageData || imageData === "https://via.placeholder.com/150") {
        setOptimizedImageSrc(imageData)
        return
      }

      try {
        // If it's already a data URL, use it directly but preload
        if (imageData.startsWith('data:image/')) {
          // Create a temporary image to preload and validate
          const tempImg = new Image()
          tempImg.onload = () => {
            if (mounted) {
              setOptimizedImageSrc(imageData)
            }
          }
          tempImg.onerror = () => {
            if (mounted) {
              setImageError(true)
              setOptimizedImageSrc("https://via.placeholder.com/400x520/1f1f1f/ffffff?text=Failed+to+load")
            }
          }
          tempImg.src = imageData
        } else {
          // If it's a URL, use it directly
          setOptimizedImageSrc(imageData)
        }
      } catch (error) {
        console.error('Error optimizing image:', error)
        if (mounted) {
          setImageError(true)
          setOptimizedImageSrc("https://via.placeholder.com/400x520/1f1f1f/ffffff?text=Failed+to+load")
        }
      }
    }

    optimizeImage()

    return () => {
      mounted = false
    }
  }, [imageData])

  const handleClick = () => {
    if (isDisabled) return
    handleJudged(isLeft ? 1 : 2)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
    setOptimizedImageSrc("https://via.placeholder.com/400x520/1f1f1f/ffffff?text=Image+Error")
  }

  return (
    <div className={`
      w-full p-3 flex flex-col items-center rounded-xl transition-all duration-500 ease-out
      ${isSelected 
        ? 'bg-green-400/20 border-2 border-green-400/50 scale-105 shadow-lg shadow-green-400/20' 
        : isHovered && !isDisabled
        ? 'bg-white/5 scale-102 shadow-lg'
        : 'bg-transparent'
      }
      ${isDisabled ? 'pointer-events-none' : 'cursor-pointer'}
    `}
    onMouseEnter={() => !isDisabled && setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onClick={handleClick}
    >
      <div className='w-full h-auto aspect-[9/13] rounded-2xl bg-gray-800/50 relative overflow-hidden'>
        {/* Loading State */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-2"></div>
            <span className="text-xs text-white/60">Loading image...</span>
          </div>
        )}
        
        {/* Error State */}
        {imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-8 h-8 text-red-400 mb-2">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-red-400">Failed to load</span>
          </div>
        )}

        {/* Main Image */}
        {optimizedImageSrc && (
          <img 
            src={optimizedImageSrc}
            alt={title}
            className={`w-full h-full rounded-2xl object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isSelected ? 'brightness-110' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="eager" // Load images immediately for better UX
            decoding="async" // Async decoding for better performance
          />
        )}

        {/* Selection Checkmark */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      <p className={`text-lg text-center font-medium my-4 h-14 flex items-center transition-all duration-300 ${
        isSelected ? 'text-green-400' : 'text-white'
      }`}>
        {title}
      </p>
      
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          text-white rounded-full py-2 px-6 font-medium transition-all duration-200
          ${isDisabled 
            ? 'bg-gray-600 cursor-not-allowed opacity-50' 
            : isSelected
            ? 'bg-green-500 shadow-lg scale-105'
            : 'bg-[#5433EB] hover:bg-[#6347FF] active:scale-95'
          }
        `}
      >
        {isSelected ? '✓ Selected' : isLeft ? 'Left' : 'Right'}
      </button>
    </div>
  )
}
