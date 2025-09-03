
'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const journeyContent = [
  {
    header: '01. THE AI POLYMATH EMERGES',
    text: "In 2025, CognivexAI stepped onto the world stage at the crossroads of every major AI discipline. From data analysis to vision-based AI, from creative platforms to community-driven solutions — we're shaping a future where AI enhances every dimension of human potential.",
    position: 'left'
  },
  {
    header: '02. VISION AI REVOLUTION',
    text: "Our breakthrough moment arrived with the Vision AI Assistant — the world's first real-time, on-screen analysis companion. No more screenshots, no more context switching. Just instant AI support that sees what you see.",
    position: 'right'
  },
  {
    header: '03. THE POLYMATH APPROACH',
    text: "While many focus on a single AI niche, we thrive across domains. Data intelligence, web design, product innovation, and AI research — all working together to deliver complete, future-proof solutions.",
    position: 'left'
  },
  {
    header: '04. BUILDING THE FUTURE',
    text: "Today, CognivexAI stands as a vision of AI’s future — a place where versatility meets innovation, and where different domains unite to solve complex, meaningful challenges.",
    position: 'right'
  },
];

const CosmicBlackHole = ({ scrollYProgress }: { scrollYProgress: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Animation continues throughout the entire scroll duration
  const spaceProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const center = { x: width / 2, y: height / 2 };
    const maxRadius = Math.min(width, height) * 0.5;
    
    const drawCosmicJourney = (progress: number) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      // Smooth easing for space travel
      const easedProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      if (easedProgress <= 0) return;

      // Draw distant galaxies (background) - continue throughout
      const galaxyCount = 8;
      for (let i = 0; i < galaxyCount; i++) {
        const angle = (i / galaxyCount) * Math.PI * 2;
        const distance = maxRadius * 1.2 + Math.sin(progress * 10 + i) * 20;
        const x = center.x + Math.cos(angle) * distance;
        const y = center.y + Math.sin(angle) * distance;
        
        // Galaxy glow - continues throughout
        const galaxySize = 15 + Math.sin(progress * 5 + i) * 5;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, galaxySize);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(100, 150, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(50, 100, 200, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, galaxySize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw black hole (central void) - grows throughout
      const blackHoleRadius = 20 + easedProgress * 80; // Larger final size
      const gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, blackHoleRadius);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(center.x, center.y, blackHoleRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw accretion disk (spinning around black hole) - continues throughout
      const diskRadius = blackHoleRadius + 20;
      const diskWidth = 30;
      for (let i = 0; i < 360; i += 5) {
        const angle = (i * Math.PI / 180) + (progress * 10);
        const radius = diskRadius + Math.sin(angle * 3) * 10;
        const x = center.x + Math.cos(angle) * radius;
        const y = center.y + Math.sin(angle) * radius;
        
        const opacity = 0.8 * Math.sin(angle * 2) * (1 - Math.abs(radius - diskRadius) / diskWidth);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw stars (AI nodes) being pulled into black hole - continues throughout
      const starCount = 12;
      for (let i = 0; i < starCount; i++) {
        const angle = (i / starCount) * Math.PI * 2;
        const distance = maxRadius * (1 - easedProgress) + Math.sin(progress * 5 + i) * 30;
        const x = center.x + Math.cos(angle) * distance;
        const y = center.y + Math.sin(angle) * distance;
        
        // Star glow - continues throughout
        const starSize = 3 + Math.sin(progress * 3 + i) * 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, starSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Star trail (being pulled into black hole) - continues throughout
        const trailLength = 5;
        for (let j = 1; j <= trailLength; j++) {
          const trailDistance = distance + j * 10;
          const trailX = center.x + Math.cos(angle) * trailDistance;
          const trailY = center.y + Math.sin(angle) * trailDistance;
          const trailOpacity = (1 - j / trailLength) * 0.5;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${trailOpacity})`;
          ctx.beginPath();
          ctx.arc(trailX, trailY, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw cosmic dust particles - continues throughout
      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * maxRadius * 0.8;
        const x = center.x + Math.cos(angle) * distance;
        const y = center.y + Math.sin(angle) * distance;
        
        const particleOpacity = 0.3 + Math.sin(progress * 2 + i) * 0.2;
        ctx.fillStyle = `rgba(255, 255, 255, ${particleOpacity})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const unsubscribe = spaceProgress.onChange((p) => {
      requestAnimationFrame(() => drawCosmicJourney(p));
    });

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      center.x = width / 2;
      center.y = height / 2;
      drawCosmicJourney(spaceProgress.get());
    };
    
    window.addEventListener('resize', handleResize);
    drawCosmicJourney(spaceProgress.get());

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, [spaceProgress]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleScroll = () => {
      const { top, bottom } = containerRef.current!.getBoundingClientRect();
      const inView = top < window.innerHeight && bottom > 0;
      
      if (inView && audio.paused) {
        audio.play().catch(error => {
          // Autoplay was prevented.
          console.log("Autoplay prevented:", error);
        });
      } else if (!inView && !audio.paused) {
        audio.pause();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  return (
    <section id="about" className="relative h-[400vh] w-full" ref={containerRef}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <audio ref={audioRef} src="path/to/your/alpha-music.mp3" loop playsInline />
        <CosmicBlackHole scrollYProgress={scrollYProgress} />
        
        {/* Text overlay with sequential fades - one disappears before next appears */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full max-w-7xl mx-auto px-8 relative">
            {journeyContent.map((item, index) => {
              // Sequential text timing - each text gets its own section
              const sectionStart = index * 0.25; // Each section gets 25% of scroll
              const sectionEnd = sectionStart + 0.25;
              const fadeInStart = sectionStart;
              const fadeInEnd = sectionStart + 0.1; // Fade in over 10% of scroll
              const fadeOutStart = sectionEnd - 0.1; // Start fading out 10% before section ends
              const fadeOutEnd = sectionEnd;
              
              const opacity = useTransform(scrollYProgress, 
                [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd], 
                [0, 1, 1, 0]
              );
              
              const y = useTransform(scrollYProgress,
                [fadeInStart, fadeInEnd],
                ['10px', '0px']
              );
             
              return (
                <motion.div 
                  key={index} 
                  className={`absolute p-4 ${item.position === 'left' ? 'left-8' : 'right-8'}`}
                  style={{ 
                    opacity,
                    y,
                    top: `${20 + index * 18}%`,
                    maxWidth: '450px',
                  }}
                >
                  <h3 className="text-lg md:text-xl font-bold mb-3 text-white tracking-tight">
                    {item.header}
                  </h3>
                  <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
