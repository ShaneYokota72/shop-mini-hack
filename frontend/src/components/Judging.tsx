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

export function Judging() {
  const navigation = useNavigateWithTransition()
  const [judgedCount, setJudgedCount] = useState<number>(1)
  const [judgeItems, setJudgeItems] = useState<JudgingItem[]>([])

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
        <h1 className="text-2xl font-bold text-white text-center mt-12">
          Which is the better Concert Fit?
        </h1>
        <p className="">{judgedCount}/3</p>

        <div className="flex items-center justify-center mt-8">
          <JudgeCard 
            title={judgeItems[0]?.title || "Loading..."}
            handleJudged={handleJudged}
            imageData={judgeItems[0]?.generated_image || "https://via.placeholder.com/150"}
            isLeft={true}
          />

          <div className="min-h-[400px] h-max w-[2px] rounded-full bg-white"/>

          <JudgeCard 
            title={judgeItems[1]?.title || "Loading..."}
            handleJudged={handleJudged}
            imageData={judgeItems[1]?.generated_image || "https://via.placeholder.com/150"}
            isLeft={false}
          />
        </div>

        <button
          onClick={() => handleJudged(1)}
          className="mt-6 text-white bg-[#3E3E3E] rounded-full py-2 px-4"
        >
          Too tough
        </button>
      </div>
    </div>
  )
} 