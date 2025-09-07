'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen({ isVisible, onFinished }: { isVisible: boolean, onFinished: () => void }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Show logo for 1.5 seconds
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 1500);

      // Complete fade out after 2 seconds total
      const finishTimer = setTimeout(() => {
        onFinished();
      }, 2000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [isVisible, onFinished]);

  if (!isVisible) {
    return null;
  }
  
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-1000 ease-in-out ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <h1 className="font-headline text-6xl font-bold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl text-black">
          CognivexAI
        </h1>
        <span className="absolute -right-4 -top-1 text-2xl md:-right-6 md:-top-2 md:text-3xl lg:-right-8 lg:top-0 lg:text-4xl text-black">
          ©
        </span>
      </div>
    </div>
  );
}




