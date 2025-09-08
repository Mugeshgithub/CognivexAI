'use client';

import { useEffect, useState } from 'react';

export default function BreakpointDetector() {
  const [screenInfo, setScreenInfo] = useState({
    width: 0,
    height: 0,
    breakpoint: '',
    userAgent: '',
    zoom: 1
  });

  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Determine Tailwind breakpoint
      let breakpoint = 'xs';
      if (width >= 1536) breakpoint = '2xl';
      else if (width >= 1280) breakpoint = 'xl';
      else if (width >= 1024) breakpoint = 'lg';
      else if (width >= 768) breakpoint = 'md';
      else if (width >= 640) breakpoint = 'sm';
      
      // Calculate zoom level
      const zoom = Math.round((window.outerWidth / window.innerWidth) * 100) / 100;
      
      setScreenInfo({
        width,
        height,
        breakpoint,
        userAgent: navigator.userAgent,
        zoom
      });
    };

    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);
    
    return () => window.removeEventListener('resize', updateScreenInfo);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50 font-mono">
      <div>Width: {screenInfo.width}px</div>
      <div>Height: {screenInfo.height}px</div>
      <div>Breakpoint: {screenInfo.breakpoint}</div>
      <div>Zoom: {screenInfo.zoom}x</div>
      <div className="text-xs opacity-70 mt-1">
        {screenInfo.userAgent.includes('Chrome') ? 'Chrome' : 
         screenInfo.userAgent.includes('Firefox') ? 'Firefox' : 
         screenInfo.userAgent.includes('Safari') ? 'Safari' : 'Other'}
      </div>
    </div>
  );
}
