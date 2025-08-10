import React, { useEffect, useState } from "react"
import JudgeCard from "./JudgeCard"
import {useNavigateWithTransition, NAVIGATION_TYPES, DATA_NAVIGATION_TYPE_ATTRIBUTE} from '@shopify/shop-minis-react'

type JudgingItem = {
  "id": string,
  "uid": string,
  "img": string,
  "elo": number,
  "updatedAt": string,
  "title": string,
  "display_name": string | null,
  "generated_image": string
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center text-white">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
    </div>
    <p className="mt-4 text-lg font-medium">Loading concert fits...</p>
  </div>
)

export function Judging() {
  const navigation = useNavigateWithTransition()
  const [judgedCount, setJudgedCount] = useState<number>(1)
  const [judgeItems, setJudgeItems] = useState<JudgingItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<number | null>(null)

  const getJudgeItems = async () => {
    const response = await fetch('http://localhost:8080/api/getTwoLeastRecentlyUsed')
    const data = await response.json()
    return data.data
  }

  const handleJudged = async (chosenItem: Number) => {
    setSelectedCard(chosenItem as number)
    setIsTransitioning(true)

    // Wait for selection animation
    await new Promise(resolve => setTimeout(resolve, 800))

    // send judge api call
    await fetch('http://localhost:8080/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        winnerId: chosenItem === 1 ? judgeItems[0].id : judgeItems[1].id,
        loserId: chosenItem === 1 ? judgeItems[1].id : judgeItems[0].id
      })
    })

    // if 3 items judged, check AI generation status
    if (judgedCount >= 3) {
      const generationStatus = sessionStorage.getItem('generationStatus')
      
      if (generationStatus === 'complete') {
        // AI is ready, go directly to submission
        document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.forward);
        navigation('/submission')
      } else {
        // AI still processing, go to loading page
        document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.forward);
        navigation('/loading')
      }
      return
    }

    // Fade out current items
    setIsTransitioning(true)
    await new Promise(resolve => setTimeout(resolve, 300))

    // Fetch new items
    const newItems = await getJudgeItems()
    setJudgeItems(newItems)

    // Reset states and fade in new items
    setSelectedCard(null)
    setIsTransitioning(false)

    // update judged count
    setJudgedCount(prev => prev + 1)
  }

  useEffect(() => {
    getJudgeItems().then(items => {
      setJudgeItems(items)
      setIsLoading(false)
    }).catch(error => {
      console.error('Error fetching judge items:', error)
      setIsLoading(false)
    })
  },[])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] px-2 text-white">
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white text-center mt-12">
          Which is the better Concert Fit?
        </h1>
        <div className="mt-2 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">{judgedCount}/3</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i <= judgedCount ? 'bg-[#5433EB]' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-center transition-all duration-300 ${
          isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}>
          <JudgeCard 
            title={judgeItems[0]?.title || "Loading..."}
            handleJudged={handleJudged}
            imageData={judgeItems[0]?.generated_image || "https://via.placeholder.com/150"}
            isLeft={true}
            isSelected={selectedCard === 1}
            isDisabled={isTransitioning}
          />

          <div className="min-h-[400px] h-max w-[2px] rounded-full bg-white/30 mx-4"/>

          <JudgeCard 
            title={judgeItems[1]?.title || "Loading..."}
            handleJudged={handleJudged}
            imageData={judgeItems[1]?.generated_image || "https://via.placeholder.com/150"}
            isLeft={false}
            isSelected={selectedCard === 2}
            isDisabled={isTransitioning}
          />
        </div>

        <button
          onClick={() => handleJudged(1)}
          disabled={isTransitioning}
          className={`mt-8 text-white bg-[#3E3E3E] rounded-full py-3 px-6 transition-all duration-200 ${
            isTransitioning 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-[#4E4E4E] active:scale-95'
          }`}
        >
          Too tough to choose
        </button>
      </div>
    </div>
  )
}