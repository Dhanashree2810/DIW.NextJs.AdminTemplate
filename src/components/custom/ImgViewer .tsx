'use client';
import { useState } from 'react';
import { AiFillCloseCircle } from "react-icons/ai";
import Image from "next/image";

export default function ImgViewer({ imageShowUrl }: any) {
  const [scale, setScale] = useState(1);
  const scaleStep = 0.1;
  const [imageShowDialog, setImageShowDialog] = useState(false);

  const handleScroll = (event: any) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      setScale((prevScale) => prevScale + scaleStep);
    } else {
      setScale((prevScale) => Math.max(1, prevScale - scaleStep));
    }
  };

  return (
    <>
      <div
        className="flex items-center space-x-4 cursor-pointer"
        style={{ height: '2.75em', width: '2.75em' }}
        onClick={() => setImageShowDialog(true)}
      >
        <Image src={imageShowUrl} alt="Image Preview" className="object-cover" width={44} height={44} />
      </div>

      {imageShowDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative w-full h-full max-w-full max-h-full my-16 p-4">
            <div
              className="absolute top-4 right-4 cursor-pointer text-white"
              onClick={() => setImageShowDialog(false)}
            >
              <AiFillCloseCircle className="h-8 w-8 text-white" />
            </div>

            <div className="w-full h-full flex justify-center items-center pt-16 pb-16">
              <img
                src={imageShowUrl}
                onWheel={handleScroll}
                style={{ transform: `scale(${scale})`, transition: 'transform 0.2s' }}
                className="w-auto h-auto max-h-full max-w-full"
                alt="Full screen"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
