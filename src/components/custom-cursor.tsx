'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      if (target) {
        setIsPointer(
          window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer'
        );
      }
    };

    const onMouseEnter = () => {
        setIsVisible(true);
    };

    const onMouseLeave = () => {
        setIsVisible(false);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseenter', onMouseEnter);
    document.body.addEventListener('mouseleave', onMouseLeave);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseenter', onMouseEnter);
      document.body.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible]);

  return (
    <div
      className={cn(
        'fixed w-3 h-3 rounded-full bg-white pointer-events-none z-[9999] transition-transform duration-200 ease-out mix-blend-difference',
        {
          'opacity-100': isVisible,
          'opacity-0': !isVisible,
        }
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) ${isPointer ? 'scale(2.5)' : 'scale(1)'}`,
      }}
    />
  );
}
