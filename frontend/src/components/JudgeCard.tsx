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

  useEffect(() => {
    setImageLoaded(false)
  }, [imageData])

  const handleClick = () => {
    if (isDisabled) return
    handleJudged(isLeft ? 1 : 2)
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
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={imageData} 
          alt={title} 
          className={`w-full h-full rounded-2xl object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isSelected ? 'brightness-110' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
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
        {isSelected ? '✓ Selected' : isLeft ? 'Choose Left' : 'Choose Right'}
      </button>
    </div>
  )
}
