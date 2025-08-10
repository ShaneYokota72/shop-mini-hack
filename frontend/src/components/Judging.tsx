import React, { useEffect, useState } from "react"
import JudgeCard from "./JudgeCard"
import {useNavigateWithTransition, NAVIGATION_TYPES, DATA_NAVIGATION_TYPE_ATTRIBUTE} from '@shopify/shop-minis-react'

interface JudgingProps {
  navigate?: (path: string | number) => void
}

type JudgingItem = {
  "id": string,
  "uid": string,
  "img": string,
  "elo": number,
  "updatedAt": string,
  "title": string,
  "display_name": string | null
}

export function Judging({ navigate }: JudgingProps) {
  const navigation = useNavigateWithTransition()
  const [judgedCount, setJudgedCount] = useState<number>(1)
  const [judgeItems, setJudgeItems] = useState<JudgingItem[]>([])
  const navigation = useNavigateWithTransition()

  const handleGoBack = () => {
    if (navigate) {
      navigate(-1)
    } else {
      document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.backward);
      navigation(-1)
    }
  }

  const getJudgeItems = async () => {
    const response = await fetch('http://localhost:8080/api/getTwoLeastRecentlyUsed')
    const data = await response.json()
    return data.data
  }

  const handleJudged = async (chosenItem: Number) => {
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

    // if 3 items judged, navigate to results
    if (judgedCount >= 3) {
      document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.forward);
      navigation('/results')
      return
    }

    // otherwise, fetch new items
    const newItems = await getJudgeItems()
    setJudgeItems(newItems)

    // update judged count
    setJudgedCount(prev => prev + 1)
  }

  const handleTooTough = async () => {
    if(judgedCount >= 3) {
      document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.forward);
      navigation('/results')
    }
    const newItems = await getJudgeItems()
    setJudgeItems(newItems)
    setJudgedCount(prev => prev + 1)
  }

  useEffect(() => {
    getJudgeItems().then(items => {
      setJudgeItems(items)
    }).catch(error => {
      console.error('Error fetching judge items:', error)
    })
  },[])

  return (
    <div className="min-h-screen bg-[#0D0D0D] px-2 text-white">
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center">
        <div className='flex justify-between items-center w-full mb-4'>  
          <button 
            onClick={handleGoBack}
            className="fixed hover:text-purple-200 text-left"
          >
            ← Back
          </button>
          <p className='font-semibold text-2xl mx-auto'>Which do you prefer?</p>
          <p className="absolute right-3 text-right">{judgedCount}/3</p>
        </div>

        <JudgeCard 
          title={judgeItems[0]?.title || "Loading..."}
          handleJudged={handleJudged}
          imageData={judgeItems[0]?.img || "https://via.placeholder.com/150"}
        />

        <p className='mt-2'>OR</p>

        <JudgeCard 
          title={judgeItems[1]?.title || "Loading..."}
          handleJudged={handleJudged}
          imageData={judgeItems[1]?.img || "https://via.placeholder.com/150"}
        />

        <div className='h-[1px] w-4/5 my-4 bg-white rounded-full'/>

        <div className='border-1 rounded-lg border-white p-2' onClick={handleTooTough}>
          <p>Too tough</p>
        </div>
      </div>
    </div>
  )
} 