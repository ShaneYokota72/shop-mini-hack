import React, { useState } from 'react';

export default function CanvasImageView({
    canvasImage,
    genImage,
}: {
    canvasImage: string;
    genImage: string;
}) {
  const [isCanvasView, setIsCanvasView] = useState(true);

  return (
    <>
        <div className='flex mx-auto text-white text-2xl font-semibold gap-24'>
            <p onClick={() => setIsCanvasView(true)} className={`${isCanvasView ? '' : 'text-slate-400'}`}>Canvas</p>
            <p onClick={() => setIsCanvasView(false)} className={`${!isCanvasView ? '' : 'text-slate-400'}`}>Image</p>
        </div>

        <div className='text-white mt-4'>
            {isCanvasView ? (
                <img 
                src={canvasImage} 
                alt="Canvas creation" 
                className="mx-auto w-[85%] rounded-3xl aspect-[9/13] object-cover"
                />
            ) : (
                <img 
                src={genImage} 
                alt="Generated creation" 
                className="mx-auto w-[85%] rounded-3xl aspect-[9/13] object-cover"
                />
            )}
        </div>
    </>
  )
}