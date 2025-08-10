import React, { useState } from 'react'
import { useNavigateWithTransition, NAVIGATION_TYPES, DATA_NAVIGATION_TYPE_ATTRIBUTE } from '@shopify/shop-minis-react'

interface Friend {
  id: string;
  name: string;
  placement: string;
  image: string;
}

interface FriendsProps {
  isOpen: boolean;
  onClose: () => void;
}

const friendsData: Friend[] = [
  {
    id: '1',
    name: 'Daniel Kim',
    placement: 'Placed top 3%',
    image: '/daniel.svg'
  },
  {
    id: '2',
    name: 'Shane Yokota',
    placement: 'Placed top 68%',
    image: '/shane.svg'
  },
  {
    id: '3',
    name: 'Sunny Jayaram',
    placement: 'Placed top 10%',
    image: '/sunny.svg'
  },
  {
    id: '4',
    name: 'Allie Speers',
    placement: 'Placed top 32%',
    image: '/allie.svg' 
  },
  {
    id: '5',
    name: 'Harley Zhang',
    placement: 'Placed top 58%',
    image: '/harley.svg' 
  }
];

export function Friends({ isOpen, onClose }: FriendsProps) {
  const navigation = useNavigateWithTransition()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFriends = friendsData.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewCalendar = (friendId: string) => {
    document.documentElement.setAttribute(DATA_NAVIGATION_TYPE_ATTRIBUTE, NAVIGATION_TYPES.forward);
    navigation(`/calendar/${friendId}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Popup - Full screen width */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div
          style={{
            width: '100%',
            height: '766px',
            borderRadius: '10px 10px 0 0',
            background: '#000',
            border: '1px solid #3E3E3E'
          }}
          className="flex flex-col p-6"
        >
          {/* Search Bar - Centered */}
          <div className="mb-6 flex justify-center">
            <div
              style={{
                width: '348px',
                height: '37px',
                borderRadius: '10px',
                background: '#3E3E3E'
              }}
              className="flex items-center px-3 gap-2"
            >
              <img src="/search.svg" alt="Search" className="w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'rgba(255, 255, 255, 0.60)',
                  fontFamily: '"Instrument Sans", sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Friends List - Centered container */}
          <div className="flex-1 overflow-y-auto flex justify-center">
            <div className="w-full max-w-md space-y-4">
              {filteredFriends.map((friend) => (
                <div key={friend.id} className="flex items-center gap-4">
                  {/* Profile Picture */}
                  <img
                    src={friend.image}
                    alt={friend.name}
                    className="w-[42px] h-[42px] rounded-full object-cover"
                  />
                  
                  {/* Name and Placement */}
                  <div className="flex-1">
                    <div
                      style={{
                        color: '#FFF',
                        fontFamily: '"Instrument Sans", sans-serif',
                        fontSize: '20px',
                        fontWeight: 400,
                        lineHeight: 'normal'
                      }}
                    >
                      {friend.name}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.50)',
                        fontFamily: '"Instrument Sans", sans-serif',
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: 'normal'
                      }}
                    >
                      {friend.placement}
                    </div>
                  </div>
                  
                  {/* View Button */}
                  <button
                    onClick={() => handleViewCalendar(friend.id)}
                    style={{
                      width: '95px',
                      height: '32px',
                      borderRadius: '20px',
                      background: '#3E3E3E',
                      border: 'none',
                      color: '#FFF',
                      fontFamily: '"Instrument Sans", sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 