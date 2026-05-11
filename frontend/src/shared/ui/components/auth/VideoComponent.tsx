'use client';
import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { VideoPreviewImg } from '@/assets';

export default function VideoComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="relative w-full h-full min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${VideoPreviewImg.src})` }}
      >
        <div className="relative z-5 h-full flex flex-col items-center justify-center text-white text-center px-10">
          <h2 className="text-[42px] font-bold mb-2!">Welcome to Drivee®</h2>
          <p className="text-[25px] text-gray-200 mb-1!">the best global carsharing marketplace</p>
          <p className="text-sm text-gray-300 mb-8!">
            Have a car? Earn money as a Host. Rent your dream car as a Guest.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 bg-white text-black font-medium px-6 py-3 rounded-full hover:bg-gray-300 transition"
          >
            Play Video Intro
            <Play size={16} fill="black" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-5 bg-black/80 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video mx-4!"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-white! hover:text-gray-300 transition"
            >
              <X size={28} />
            </button>
            <iframe
              src="https://www.youtube.com/embed/N-MNIe3Nu2s?autoplay=1"
              className="w-full h-full rounded-xl my-auto!"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
