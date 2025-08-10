import React from 'react'
import {ArrowRight} from 'lucide-react'
import {useNavigateWithTransition, NAVIGATION_TYPES, DATA_NAVIGATION_TYPE_ATTRIBUTE} from '@shopify/shop-minis-react'


const IMAGES_PATH = [
  'https://cdn.shopify.com/s/files/1/0582/1648/0813/products/burrata_hat.jpg?v=1725129175&width=2048',
  'https://cdn.shopify.com/s/files/1/0810/2618/7562/files/3792625715044681494_2048_custom.jpg?v=1749577471&width=2048',
  'https://cdn.shopify.com/s/files/1/1456/8506/files/30g-OrganicSuperior-Front.jpg?v=1700488938&width=2048',
  'https://cdn.shopify.com/s/files/1/0522/6912/1736/files/W206040-130_Classic-4Drawer-Dresser_Bianca-White_Lifestyle_01_1.jpg?v=1751319674&width=2048',
  'https://cdn.shopify.com/s/files/1/0459/0744/3880/files/summer_pearl_necklace.jpg?v=1694698436&width=2048',
  'https://cdn.shopify.com/s/files/1/0762/6571/8069/files/stancebedroombrighter_1.png?v=1735613145&format=webp&width=2048',
  'https://cdn.shopify.com/s/files/1/0023/0021/5405/files/BrooklynCandleStudio-Santorini-Vertical-Resized.jpg?v=1701983506&width=2048',
  'https://cdn.shopify.com/s/files/1/2037/3509/files/818eb6ffe674d7308b378058171fe14b0f4964760c4c43bf28cc2e76353848e1.jpg?v=1754586715&width=2048',
]

export function Landing() {
  const navigation = useNavigateWithTransition()
  const handleStartChallenge = () => {
    document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.forward);
    navigation('/whiteboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#0D0D0D] pt-12 pb-6">
      <div className="max-w-md mx-auto text-center">
        <div className='absolute z-0 inset-0'>
          {
            IMAGES_PATH.map((image, index) => {
              const row = Math.floor(index / 2)
              const col = index % 2

              const baseTop = 5 + row * 24
              const baseLeft = 12 + col * 52

              const offset = () => (Math.random() - 0.5) * 12
              const top = baseTop + offset()
              const left = baseLeft + offset()
              
              return (
                <img 
                  key={index} 
                  src={image} 
                  alt={image} 
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
          <p className='text-lg top-36 text-[#d6cfcf] drop-shadow-xl drop-shadow-black'>Make the best outfit for the concert! 🎤</p>
          <ArrowRight 
            className="bg-[#5433EB] rounded-full p-2 w-12 h-12 transition-transform transform hover:scale-110"
            onClick={handleStartChallenge}
          />
        </div>
      </div>
    </div>
  )
} 