import React, { useEffect, useState } from 'react'
import {useNavigateWithTransition, NAVIGATION_TYPES, DATA_NAVIGATION_TYPE_ATTRIBUTE} from '@shopify/shop-minis-react'
import peopleImage from '/people.png?url'

interface CardData {
  emoji: string;
  subtitle: string;
  title: string;
}

const cardData: CardData[] = [
  {
    emoji: "🪜",
    subtitle: "You placed in",
    title: "Top 3%"
  },
  {
    emoji: "🔥",
    subtitle: "You are on a",
    title: "2-Day Streak"
  },
  {
    emoji: "🤼",
    subtitle: "You placed better than",
    title: "89% of your friends"
  }
];

export function Results() {
  const navigation = useNavigateWithTransition()
  const [result, setResult] = React.useState<any>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/getAll')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        data.data.sort((a: any, b: any) => b.elo - a.elo)
        let winner = data.data[0]
        winner.rank = 'Best Submission 🥇'
        winner.category = 'Make the best fit for $50'
        winner.total_submissions = data.data.length
        winner.winner_name = winner.display_name || 'Daniel Kim'
        setResult(winner);
      } catch (error) {
        console.error('Error fetching results:', error)
      }
    }
    fetchResults()
  }, [])

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cardData.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cardData.length) % cardData.length);
  };

  const handleViewWinners = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/getAll')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      const sortedData = data.data.sort((a: any, b: any) => b.elo - a.elo)
      const topThree = sortedData.slice(0, 3)
      console.log('Top 3 Winners:', topThree)
    } catch (error) {
      console.error('Error fetching winners:', error)
    }
  };

  const renderCard = (index: number, position: 'left' | 'center' | 'right') => {
    const card = cardData[index];
    const isCenter = position === 'center';
    
    return (
      <div
        key={index}
        className={`
          relative flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out flex-shrink-0
          ${isCenter ? 'w-[160px] h-[160px] scale-100 z-10' : 'w-[160px] h-[160px] scale-75 z-0'}
        `}
        style={{
          borderRadius: '10px',
          backgroundColor: '#5433EB',
          margin: '0 8px'
        }}
      >

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-2">
          <div
            style={{
              color: '#FFF',
              textAlign: 'center',
              fontFamily: '"Instrument Sans", sans-serif',
              fontSize: '60px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: 'normal'
            }}
          >
            {card.emoji}
          </div>
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.60)',
              textAlign: 'center',
              fontFamily: '"Instrument Sans", sans-serif',
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: 'normal',
              marginTop: '4px'
            }}
          >
            {card.subtitle}
          </div>
          <div
            style={{
              color: '#FFF',
              textAlign: 'center',
              fontFamily: '"Instrument Sans", sans-serif',
              fontSize: '20px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: 'normal',
              marginTop: '2px'
            }}
          >
            {card.title}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#000] relative overflow-x-hidden">
      {/* Friends icon top right */}
      <div className="absolute top-4 right-6 z-20">
        <img src="/friends.svg" alt="Friends" className="w-8 h-8" />
      </div>

      {/* Main content centered */}
      <div className="flex flex-col items-center justify-start min-h-screen pt-16 px-4 max-w-full">
        {/* Trophy */}
        <img src="/trophy.svg" alt="Trophy" className="w-16 h-16 mb-6" />
        
        {/* You crushed it! */}
        <h1
          style={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: '"Instrument Sans", sans-serif',
            fontSize: '32px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: 'normal',
            marginBottom: '40px'
          }}
        >
          You crushed it!
        </h1>

        {/* Carousel - Fixed container width */}
        <div className="flex items-center justify-center mb-6 w-full max-w-sm overflow-hidden">
          <div className="flex items-center justify-center transition-transform duration-300 ease-in-out">
            {renderCard((currentCardIndex - 1 + cardData.length) % cardData.length, 'left')}
            {renderCard(currentCardIndex, 'center')}
            {renderCard((currentCardIndex + 1) % cardData.length, 'right')}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={prevCard}
            className="w-[29px] h-[29px] rounded-full border border-white border-[1.5px] bg-transparent flex items-center justify-center"
          >
            <img src="/left.svg" alt="Previous" className="w-3 h-3" />
          </button>
          <button
            onClick={nextCard}
            className="w-[29px] h-[29px] rounded-full border border-white border-[1.5px] bg-transparent flex items-center justify-center"
          >
            <img src="/right.svg" alt="Next" className="w-3 h-3" />
          </button>
        </div>

        {/* Share button */}
        <div className="mb-6">
          <button className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center">
            <img src="/share.svg" alt="Share" className="w-5 h-5" />
          </button>
        </div>

        {/* Friends played section */}
        <div
          className="flex flex-col items-center justify-center mb-6"
          style={{
            width: '230px',
            height: '103px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.30)'
          }}
        >
          <img src="/people.svg" alt="People" className="mb-2" />
          <div
            style={{
              color: '#FFF',
              textAlign: 'center',
              fontFamily: '"Instrument Sans", sans-serif',
              fontSize: '15.259px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: 'normal'
            }}
          >
            3 friends played
          </div>
        </div>

        {/* View Winners button */}
        <button
          onClick={handleViewWinners}
          style={{
            borderRadius: '20px',
            background: '#5433EB',
            width: '126px',
            height: '36px',
            color: '#FFF',
            textAlign: 'center',
            fontFamily: '"Instrument Sans", sans-serif',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: 'normal',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          View Winners
        </button>
      </div>
    </div>
  )
}