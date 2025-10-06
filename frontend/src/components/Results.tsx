import { useContext, useEffect, useState } from 'react'
import {useNavigateWithTransition, NAVIGATION_TYPES, DATA_NAVIGATION_TYPE_ATTRIBUTE, Button} from '@shopify/shop-minis-react'
import { Trophy, User } from 'lucide-react'
import { TrendOffContext } from '../context/TrendOffContext';
import useEmblaCarousel from 'embla-carousel-react'
import { NextButton, PrevButton, usePrevNextButtons } from './EmberCarouselButton';
interface Fact {
  emoji: string;
  subtitle: string;
  text: string;
}

export function Results() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    startIndex: 0,
  })
  const navigation = useNavigateWithTransition()
  const [facts, setFacts] = useState<Fact[]>([]);
  const { user } = useContext(TrendOffContext);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const handleViewWinners = async () => {
    document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.forward);
    navigation('/winners')
  }

  useEffect(() => {
    const fetchResultFacts = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_TREND_OFF_ENDPOINT}/api/result-facts?uid=${user?.id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const result = await response.json();
          setFacts(result.facts);
        } catch (error) {
          console.error('Error fetching result facts:', error);
        }
    }
    fetchResultFacts();
  },[])

  return (
    <div className="min-h-screen bg-[#000] relative overflow-x-hidden">
      <div className="flex flex-col items-center justify-start min-h-screen pt-8 px-4 max-w-full">
        <Trophy className='w-16 h-16 mb-6 text-white'/>

        <h1 className='text-white text-center font-bold text-3xl mb-6'>
          You crushed it!
        </h1>
        {
          facts.length > 0 && (
            <p className='text-white text-center mb-6 px-4'>Here are some fun facts!</p>
          )
        }

        <section className="embla">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {facts.length > 0 ? (
                facts.map((fact, index) => (
                  <div className="embla__slide" key={index}>
                    <div className="text-center text-5xl mb-4">{fact.emoji}</div>
                    <div className="text-center text-2xl font-semibold">{fact.subtitle}</div>
                    <div className="text-center">{fact.text}</div>
                  </div>
                ))
              ) : (
                <div className='px-4'>
                  <div className="w-56 h-56 flex flex-col gap-2 items-center justify-center p-4 bg-[#5433EB] rounded-2xl text-white">
                    <div className="text-center text-5xl mb-4">😆</div>
                    <div className="text-center text-2xl font-semibold">Welcome Back!</div>
                    <div className="text-center">We've missed you! Time to trend off again!</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {
            facts.length > 1 && (
              <div className="embla__controls">
                <div className="embla__buttons">
                  <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} className={`w-8 h-8 text-white ${!emblaApi?.canScrollPrev() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} />
                  <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} className={`w-8 h-8 text-white ${!emblaApi?.canScrollNext() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} />
                </div>
              </div>
            )
          }
        </section>

        {/* <div className='flex flex-col items-center justify-center gap-4 bg-white/10 w-4/5 h-fit p-2 rounded-2xl mt-8 mb-8'>
          <p className='text-2xl text-white'>Coming Soon!</p>
          <div className='flex'>
            <div className='bg-[#b4a6f6] p-2 w-14 h-14 rounded-full flex items-center justify-center border border-black'>
              <User className='w-8 h-8'/>
            </div>
            <div className='-ml-2 bg-[#b4a6f6] p-2 w-14 h-14 rounded-full flex items-center justify-center border border-black'>
              <User className='w-8 h-8'/>
            </div>
            <div className='-ml-2 bg-[#b4a6f6] p-2 w-14 h-14 rounded-full flex items-center justify-center border border-black'>
              <User className='w-8 h-8'/>
            </div>
          </div>
          <p className='text-white'>X friends played</p>
        </div> */}

        <Button onClick={handleViewWinners} className='rounded-full !w-fit mt-8 mx-auto px-4 py-2'>View Winners</Button>
      </div>
    </div>
  )
}