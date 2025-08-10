import React, {useState} from 'react'
import { DragEndEvent } from '@dnd-kit/core'
import { WhiteboardCanvas, WhiteboardItem } from './WhiteboardCanvas'
import { useProductSearch } from '@shopify/shop-minis-react'
import {useNavigateWithTransition, NAVIGATION_TYPES, DATA_NAVIGATION_TYPE_ATTRIBUTE} from '@shopify/shop-minis-react'

interface SearchImage {
  id: string
  url: string
  alt: string
}

// Dummy images from Unsplash for demo (fallback)
const dummyImages: SearchImage[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=150&h=150&fit=crop', alt: 'Concert dress' },
  { id: '2', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&h=150&fit=crop', alt: 'Fashion boots' },
  { id: '3', url: 'https://images.unsplash.com/photo-1506629905607-62b39f7a0b73?w=150&h=150&fit=crop', alt: 'Leather jacket' },
  { id: '4', url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=150&h=150&fit=crop', alt: 'Band t-shirt' },
  { id: '5', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop', alt: 'Sunglasses' },
  { id: '6', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=150&h=150&fit=crop', alt: 'Denim jeans' },
]

export function Whiteboard() {
  const [items, setItems] = useState<WhiteboardItem[]>([])
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const navigation = useNavigateWithTransition()

  // Use the Shopify product search hook
  const { products, loading, error } = useProductSearch({
    query: submittedQuery,
    first: 20,
  })

  const handleGoBack = () => {
    document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.backward);
    navigation(-1)
  }

  // Alternative canvas capture method using native Canvas API
  const captureCanvasAlternative = async (): Promise<string> => {
    const canvasElement = document.querySelector('[data-whiteboard-canvas]') as HTMLElement
    if (!canvasElement) return ''

    try {
      // Create a new canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return ''

      // Set canvas size
      canvas.width = 400
      canvas.height = 560

      // Fill white background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Get all images in the whiteboard
      const images = canvasElement.querySelectorAll('img')
      
      return new Promise<string>((resolve) => {
        let loadedImages = 0
        const totalImages = images.length

        if (totalImages === 0) {
          resolve(canvas.toDataURL('image/png'))
          return
        }

        images.forEach((img) => {
          const newImg = new Image()
          newImg.crossOrigin = 'anonymous'
          
          newImg.onload = () => {
            // Get the position from the parent div
            const parent = img.closest('[style*="position"]') as HTMLElement
            if (parent) {
              const style = parent.style
              const x = parseInt(style.left) || 0
              const y = parseInt(style.top) || 0
              const width = parseInt(style.width) || 100
              const height = parseInt(style.height) || 100
              
              ctx.drawImage(newImg, x, y, width, height)
            }
            
            loadedImages++
            if (loadedImages === totalImages) {
              resolve(canvas.toDataURL('image/png'))
            }
          }
          
          newImg.onerror = () => {
            loadedImages++
            if (loadedImages === totalImages) {
              resolve(canvas.toDataURL('image/png'))
            }
          }
          
          newImg.src = img.src
        })
      })
    } catch (error) {
      console.error('Alternative canvas capture failed:', error)
      return ''
    }
  }

  const handleNext = async () => {
    console.log('Starting canvas capture...')
    const canvasImage = await captureCanvasAlternative()
    
    console.log('Canvas image captured:', !!canvasImage)
    console.log('Image length:', canvasImage.length)
  
    // Store canvas image immediately
    if (canvasImage) {
      try {
        sessionStorage.setItem('canvasImage', canvasImage)
        sessionStorage.setItem('generationStatus', 'pending')
        console.log('Canvas image stored in sessionStorage')

        // Start AI generation asynchronously (don't await)
        generateAIImage(canvasImage)

      } catch (error) {
        console.error('Failed to store image in sessionStorage:', error)
      }
    } else {
      console.error('No canvas image to store')
    }
    
    // Navigate to judging immediately
    document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.forward);
    navigation('/judging');
  }

  // Separate async function for AI generation
  const generateAIImage = async (canvasImage: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/img2img', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: canvasImage,
          prompt: 'Make a model wearing thiis outfit for a concert'
        })
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('genImage', data.transformedImage || '');
        sessionStorage.setItem('generationStatus', 'complete');
        console.log('AI generation completed');
      } else {
        console.error('Image generation failed:', response.statusText);
        sessionStorage.setItem('generationStatus', 'failed');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      sessionStorage.setItem('generationStatus', 'failed');
    }
  }

  const handleSearchSubmit = () => {
    setSubmittedQuery(searchQuery)
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  // Convert products to SearchImage format
  const productImages: SearchImage[] = products?.map(product => ({
    id: product.id,
    url: product.featuredImage?.url || '',
    alt: product.title || 'Product'
  })) || []

  // Show products if we have a submitted query, otherwise show empty state initially
  const filteredImages = submittedQuery 
    ? productImages.length > 0 
      ? productImages 
      : dummyImages.filter(image => 
          image.alt.toLowerCase().includes(submittedQuery.toLowerCase())
        )
    : [] // Start with empty array - no items shown initially

  const addImageToWhiteboard = (image: SearchImage) => {
    const newItem: WhiteboardItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      imageUrl: image.url,
      x: 200, // Center horizontally (500px whiteboard - 100px item = 400px / 2 = 200px)
      y: 150, // Center vertically (400px whiteboard - 100px item = 300px / 2 = 150px)
      width: 100,
      height: 100
    }
    setItems(prev => [...prev, newItem])
    setShowAddPanel(false)
    setSearchQuery('')
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, delta} = event
    
    if (delta.x === 0 && delta.y === 0) return

    setItems(items => items.map(item => {
      if (item.id === active.id) {
        const newX = Math.max(0, Math.min(item.x + delta.x, 400)) // Max 400px (500-100)
        const newY = Math.max(0, Math.min(item.y + delta.y, 300)) // Max 300px (400-100)
        return {
          ...item,
          x: newX,
          y: newY
        }
      }
      return item
    }))
  }

  const handleItemClick = (itemId: string) => {
    setSelectedItemId(selectedItemId === itemId ? null : itemId)
  }

  const handleDeleteSelected = () => {
    if (selectedItemId) {
      setItems(items => items.filter(item => item.id !== selectedItemId))
      setSelectedItemId(null)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      {/* <div className="bg-black shadow-sm p-4">
        <button 
          onClick={handleGoBack}
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          ←
        </button>
      </div> */}
      <h1 className="text-2xl font-bold text-white text-center">
        Make the best outfit for the concert! 🎤
      </h1>

      {/* Whiteboard Canvas */}
      <WhiteboardCanvas
        items={items}
        onDragEnd={handleDragEnd}
        selectedItemId={selectedItemId}
        onItemSelect={handleItemClick}
      />

      {/* Delete Button - Only shows when item is selected, positioned absolutely */}
      {selectedItemId && (
        <div className="absolute left-1/2 transform -translate-x-1/2 z-20" style={{ bottom: '140px' }}>
          <button
            onClick={handleDeleteSelected}
            className="bg-red-600 hover:bg-red-700 text-white w-12 h-12 rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
          </button>
        </div>
      )}

      {/* Bottom Toolbar */}
      <div className="bg-black border-t border-gray-800 pb-8">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleGoBack}
            className="text-white bg-[#3E3E3E] rounded-full py-2 px-4"
          >
            Close
          </button>
          <div
            onClick={() => setShowAddPanel(true)}
            className="w-12 h-12 bg-white text-black rounded-full text-4xl flex items-center justify-center"
          >
            +
          </div>
          <button
            onClick={handleNext}
            className="text-white bg-[#5433EB] rounded-full py-2 px-4"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Panel Modal */}
      {showAddPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div 
            className="bg-gray-900 rounded-t-2xl w-full max-w-md mx-4 mb-0 transform animate-slide-up border-t border-gray-700"
            style={{ maxHeight: '80vh' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <button 
                onClick={() => setShowAddPanel(false)}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Close
              </button>
              <h3 className="font-medium text-white">Add Items</h3>
              <button 
                onClick={() => setShowAddPanel(false)}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Next
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for clothing items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full p-3 pr-12 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-800 text-white placeholder-gray-400"
                  autoFocus
                />
                <button
                  onClick={handleSearchSubmit}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="px-4 pb-4">
                <div className="text-center text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p>Searching products...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="px-4 pb-4">
                <div className="text-center text-red-400">
                  <p>Error loading products. Showing sample items.</p>
                </div>
              </div>
            )}

            {/* Image Grid */}
            <div className="px-4 pb-6 max-h-80 overflow-y-auto">
              {/* Initial Search Prompt - shown when no search has been submitted */}
              {!submittedQuery && !loading && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-lg font-medium mb-2">Search for what you're looking for</p>
                  <p className="text-sm text-gray-500">Type in the search box and hit the arrow to find products</p>
                </div>
              )}

              {/* Product Grid - shown after search */}
              {(submittedQuery || loading) && (
                <div className="grid grid-cols-3 gap-3">
                  {filteredImages.map(image => (
                    <button
                      key={image.id}
                      onClick={() => addImageToWhiteboard(image)}
                      className="aspect-square rounded-lg overflow-hidden border-2 border-gray-600 hover:border-blue-500 transition-all hover:scale-105 active:scale-95"
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              
              {filteredImages.length === 0 && submittedQuery && !loading && (
                <div className="text-center py-8 text-gray-400">
                  <p>No items found for "{submittedQuery}"</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}