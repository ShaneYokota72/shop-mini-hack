import React, { useState } from 'react';

export default function CanvasImageView({
    canvasImage,
    genImage,
    isCanvasView: initialIsCanvasView = false
}: {
    canvasImage: string;
    genImage: string | undefined;
    isCanvasView?: boolean;
}) {
  const [isCanvasView, setIsCanvasView] = useState(initialIsCanvasView);

  return (
    <>
        <div className='h-fit flex items-center justify-center mx-auto pt-4 text-white text-2xl font-semibold gap-24'>
            <p onClick={() => setIsCanvasView(true)} className={`${isCanvasView ? '' : 'text-slate-400'}`}>Canvas</p>
            <p onClick={() => setIsCanvasView(false)} className={`${!isCanvasView ? '' : 'text-slate-400'}`}>Image</p>
        </div>

        <div className='text-white mt-4 flex-1 flex items-center justify-center'>
            {
                isCanvasView ? (
                    <img src={canvasImage} alt="Canvas Image" className="mx-auto rounded-3xl max-h-full max-w-[85%] object-contain" />
                ) : (
                    <img src={genImage} alt="Generated Image" className="mx-auto rounded-3xl max-h-full max-w-[85%] object-contain" />
                )
            }
        </div>
    </>
  )
}