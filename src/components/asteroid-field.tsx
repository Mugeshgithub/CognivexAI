'use client';

import React, { useRef, useEffect } from 'react';

export function AsteroidField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing asteroids to prevent duplication on re-renders
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const createAsteroid = () => {
      const asteroid = document.createElement('div');
      asteroid.className = 'asteroid-rock';
      
      // Make asteroids larger and more visible
      const size = Math.random() * 120 + 60; // size between 60px and 180px
      asteroid.style.width = `${size}px`;
      asteroid.style.height = `${size}px`;

      // Position asteroids within the container bounds
      const maxX = container.clientWidth - size;
      const maxY = container.clientHeight - size;
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;
      asteroid.style.left = `${x}px`;
      asteroid.style.top = `${y}px`;
      
      // Randomize animation properties
      const duration = Math.random() * 30 + 25; // duration between 25s and 55s
      const delay = Math.random() * -20; // negative delay to start at different points
      asteroid.style.animationDuration = `${duration}s`;
      asteroid.style.animationDelay = `${delay}s`;
      
      container.appendChild(asteroid);
    };

    const numAsteroids = 5; // Reduced for better visibility
    for (let i = 0; i < numAsteroids; i++) {
      createAsteroid();
    }
  }, []);

  return (
    <div ref={containerRef} className="asteroid-field-container relative w-full h-full overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
          .asteroid-field-container {
            perspective: 1000px;
            position: relative;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, #1a1a1a 0%, #000000 100%);
          }
          
          .asteroid-rock {
            position: absolute;
            background: linear-gradient(145deg, #5a5a5a, #3a3a3a);
            border-radius: 50%;
            background-image: 
              radial-gradient(circle at 25% 25%, #7a7a7a 0%, #5a5a5a 40%, #3a3a3a 80%, #2a2a2a 100%);
            box-shadow: 
              inset -6px -6px 12px rgba(0,0,0,0.8),
              4px 4px 12px rgba(0,0,0,0.6),
              0 0 20px rgba(255,255,255,0.2);
            transform-style: preserve-3d;
            animation-name: asteroid-float;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            will-change: transform;
            opacity: 0.95;
          }
          
          @keyframes asteroid-float {
            0% {
              transform: translateZ(-200px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(0.8);
              opacity: 0.6;
            }
            25% {
              transform: translateZ(100px) rotateX(90deg) rotateY(90deg) translateY(-30px) scale(1.1);
              opacity: 1;
            }
            50% {
              transform: translateZ(200px) rotateX(180deg) rotateY(180deg) translateY(0px) scale(1.2);
              opacity: 1;
            }
            75% {
              transform: translateZ(100px) rotateX(270deg) rotateY(270deg) translateY(30px) scale(1.1);
              opacity: 1;
            }
            100% {
              transform: translateZ(-200px) rotateX(360deg) rotateY(360deg) translateY(0px) scale(0.8);
              opacity: 0.6;
            }
          }
        `
      }} />
    </div>
  );
} 