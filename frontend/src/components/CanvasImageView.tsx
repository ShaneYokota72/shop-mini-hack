import React, { useState, useEffect } from 'react';

export default function CanvasImageView({
    canvasImage,
    genImage,
}: {
    canvasImage: string;
    genImage: string;
}) {
  const [isCanvasView, setIsCanvasView] = useState(true);
  const [generationStatus, setGenerationStatus] = useState<string>('pending');

  useEffect(() => {
    // Check generation status from sessionStorage
    const status = sessionStorage.getItem('generationStatus') || 'pending';
    setGenerationStatus(status);

    // If we have a generated image, switch to it by default
    if (genImage && status === 'complete') {
      setIsCanvasView(false);
    }

    // Poll for completion if still pending
    if (status === 'pending') {
      const checkStatus = () => {
        const currentStatus = sessionStorage.getItem('generationStatus') || 'pending';
        setGenerationStatus(currentStatus);
        
        if (currentStatus === 'complete') {
          const newGenImage = sessionStorage.getItem('genImage');
          if (newGenImage) {
            setIsCanvasView(false); // Auto-switch to AI image when ready
          }
        } else if (currentStatus === 'pending') {
          setTimeout(checkStatus, 1000); // Check again in 1 second
        }
      };
      setTimeout(checkStatus, 100);
    }
  }, [genImage]);

  const hasAIImage = genImage && generationStatus === 'complete';

  return (
    <>
        {/* Enhanced Tab Switcher */}
        <div className="flex justify-center mx-auto mb-6 mt-6">
          <div className="bg-gray-800 rounded-full p-1 flex">
            <button
              onClick={() => setIsCanvasView(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isCanvasView
                  ? 'bg-white text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Canvas
            </button>
            <button
              onClick={() => hasAIImage && setIsCanvasView(false)}
              disabled={!hasAIImage}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                !isCanvasView && hasAIImage
                  ? 'bg-white text-black shadow-lg'
                  : hasAIImage
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 cursor-not-allowed'
              }`}
            >
              AI Model
              {generationStatus === 'pending' && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              )}
              {generationStatus === 'complete' && hasAIImage && (
                <span className="text-green-400">✓</span>
              )}
              {generationStatus === 'failed' && (
                <span className="text-red-400">✗</span>
              )}
            </button>
          </div>
        </div>

        {/* Image Display Area */}
        <div className='text-white'>
            {isCanvasView ? (
                <div className="relative">
                  <img 
                    src={canvasImage} 
                    alt="Canvas creation" 
                    className="mx-auto w-[85%] rounded-3xl aspect-[9/13] object-cover"
                  />
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded-full text-xs text-white">
                    Your Design
                  </div>
                </div>
            ) : hasAIImage ? (
                <div className="relative">
                  <img 
                    src={genImage} 
                    alt="Generated creation" 
                    className="mx-auto w-[85%] rounded-3xl aspect-[9/13] object-cover"
                  />
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded-full text-xs text-white">
                    AI Model
                  </div>
                </div>
            ) : (
                <div className="mx-auto w-[85%] rounded-3xl aspect-[9/13] bg-gray-800 flex flex-col items-center justify-center border-2 border-dashed border-gray-600">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-gray-400 text-center px-4 text-lg font-medium mb-2">
                    {generationStatus === 'pending' ? 'Creating your AI model...' : 
                     generationStatus === 'failed' ? 'AI generation failed' : 
                     'AI image not available'}
                  </p>
                  <p className="text-gray-500 text-center px-4 text-sm mb-4">
                    {generationStatus === 'pending' ? 'This usually takes 10-30 seconds' : 
                     generationStatus === 'failed' ? 'You can still submit with your canvas' : 
                     'Switch to Canvas to see your design'}
                  </p>
                  {generationStatus === 'pending' && (
                    <div className="w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
            )}
        </div>
    </>
  )
}
