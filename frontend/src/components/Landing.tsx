import {ArrowRight} from 'lucide-react'
import {useNavigateWithTransition, usePopularProducts, IconButton, NAVIGATION_TYPES, DATA_NAVIGATION_TYPE_ATTRIBUTE} from '@shopify/shop-minis-react'
import { useContext } from 'react'
import { TrendOffContext } from '../context/TrendOffContext'

export function Landing() {
  const navigation = useNavigateWithTransition()
  const { products } = usePopularProducts({ first: 8 })
  const { todayPrompt } = useContext(TrendOffContext)

  const handleStartChallenge = async () => {
    document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.forward);
    navigation('/whiteboard')

    // const res = await fetch(`${process.env.TREND_OFF_ENDPOINT}/api/getPrompt`)
    // const data = await res.json()
    // console.log('Fetched prompt data:', data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#0D0D0D] pt-12 pb-6">
      <div className="max-w-md mx-auto text-center">
        <div className='absolute z-0 inset-0'>
          {
            products?.map((product, index) => {
              const row = Math.floor(index / 2)
              const col = index % 2

              const baseTop = 5 + row * 24
              const baseLeft = 12 + col * 52

              const offset = () => (Math.random() - 0.5) * 12
              const top = baseTop + offset()
              const left = baseLeft + offset()

              const src = product.featuredImage?.url
              const alt = product.featuredImage?.altText || product.title
              
              return (
                <img
                  key={index}
                  src={src}
                  alt={alt} 
                  className={"absolute w-24 h-24 object-cover rounded-lg shadow-lg transform transition-transform hover:scale-110 animate-slide-" + (index % 3 + 1)}
                  style={{ top: `${top}%`, left: `${left}%` }}
                />
              )
            })
          }
        </div>
        <div className='absolute z-30 top-0 h-full w-full bg-black opacity-30'/>
        <div className='absolute z-50 text-white top-48 flex flex-col items-center justify-center gap-12'>
          <p className='text-8xl text-[#E4E3DD] drop-shadow-xl/80 drop-shadow-black'>TREND OFF</p>
          <p className='text-lg top-36 text-[#d6cfcf] drop-shadow-xl drop-shadow-black'>{todayPrompt}</p>
          <IconButton Icon={ArrowRight} onClick={handleStartChallenge} buttonStyles='bg-[#5433EB] rounded-full p-2 w-12 h-12 transition-transform transform hover:scale-110' iconStyles='w-8 h-8'/>
        </div>
      </div>
    </div>
  )
} 