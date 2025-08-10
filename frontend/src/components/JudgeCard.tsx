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
  return (
    <div className='!w-full mx-2 flex flex-col items-center'>
        <div className='w-full h-auto aspect-[9/13] rounded-2xl bg-gray-400 '>
          <img src={imageData} alt={title} className='w-full h-full rounded-2xl object-contain'/>
        </div>
        <p className='text-xl text-center font-semibold my-4 h-14'>{title}</p>
         <button
          onClick={() => handleJudged(isLeft ? 1 : 2)}
          className="text-white bg-[#5433EB] rounded-full py-2 px-4"
        >
          {isLeft ? 'Left' : 'Right'}
        </button>
    </div>
  )
}
