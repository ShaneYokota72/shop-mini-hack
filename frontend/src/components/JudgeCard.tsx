export default function JudgeCard({
    title,
    handleJudged,
    imageData
}: {
    title: string,
    handleJudged: (item: number) => void,
    imageData: string
}) {
  return (
    <div className='flex flex-col justify-between items-center'>
        <p className='text-2xl'>{title}</p>
        <div className='w-60 h-60 rounded-2xl bg-gray-600 border-1 border-white' onClick={() => handleJudged(1)}>
          <img src={imageData} alt={title} className='w-full h-full rounded-2xl object-contain'/>
        </div>
    </div>
  )
}
