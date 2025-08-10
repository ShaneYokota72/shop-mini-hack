import { useEffect, useState } from "react"

export default function JudgeCard({
    title,
    handleJudged,
    imageData,
    isLeft,
}: {
    title: string,
    handleJudged: (item: number) => void,
    imageData: string,
    isLeft: boolean
}) {
  const [isSelected, setIsSelected] = useState(false)
  const [finishedSelection, setFinishedSelection] = useState(false)

  useEffect(() => {
    setIsSelected(false)
    setFinishedSelection(false)
  },[])

  const handleClick = () => {
    setFinishedSelection(true)
    setIsSelected(true)
    setTimeout(() => {}, 300)
    handleJudged(isLeft ? 1 : 2)
  }

  return (
    // rounded-lg bg-green-300/25
    <div className={`!w-full p-2 flex flex-col items-center ${finishedSelection && isSelected ? 'bg-green-300/25' : ''} rounded-lg transition-all duration-300`}>
      <div className='w-full h-auto aspect-[9/13] rounded-2xl bg-gray-400 '>
        <img src={imageData} alt={title} className='w-full h-full rounded-2xl object-contain'/>
      </div>
      <p className='text-xl text-center font-semibold my-4 h-14'>{title}</p>
        <button
        onClick={handleClick}
        className="text-white bg-[#5433EB] rounded-full py-2 px-4"
      >
        {isLeft ? 'Left' : 'Right'}
      </button>
    </div>
  )
}
