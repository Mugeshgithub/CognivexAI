
'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/contexts/language-context';

const NeuralNetwork3D = ({ scrollYProgress }: { scrollYProgress: any }) => {
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
    const maxRadius = Math.min(width, height) * 0.4;
    
    // 3D Neural Network Nodes
    const nodes = [
      { x: center.x - 100, y: center.y - 80, z: 0, layer: 0 },
      { x: center.x + 100, y: center.y - 80, z: 0, layer: 0 },
      { x: center.x - 60, y: center.y, z: 50, layer: 1 },
      { x: center.x + 60, y: center.y, z: 50, layer: 1 },
      { x: center.x, y: center.y + 80, z: 100, layer: 2 },
    ];
    
    const drawNeuralNetwork = (progress: number) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      // Simplified easing for better performance
      const easedProgress = progress;
      
      if (easedProgress <= 0) return;

      // Draw 3D connections between nodes
      ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)'; // Orange connections
      ctx.lineWidth = 2;
      
      // Connect nodes in layers
      for (let i = 0; i < nodes.length - 1; i++) {
        const node1 = nodes[i];
        const node2 = nodes[i + 1];
        
        // 3D perspective calculation
        const depth1 = node1.z + Math.sin(progress * 4 + i) * 20;
        const depth2 = node2.z + Math.sin(progress * 4 + i + 1) * 20;
        
        const scale1 = 1 / (1 + depth1 / 200);
        const scale2 = 1 / (1 + depth2 / 200);
        
        const x1 = center.x + (node1.x - center.x) * scale1;
        const y1 = center.y + (node1.y - center.y) * scale1;
        const x2 = center.x + (node2.x - center.x) * scale2;
        const y2 = center.y + (node2.y - center.y) * scale2;
        
        // Draw connection with 3D effect
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = 'rgba(255, 165, 0, 0.8)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw 3D nodes with depth
      nodes.forEach((node, index) => {
        const depth = node.z + Math.sin(progress * 3 + index) * 30;
        const scale = 1 / (1 + depth / 200);
        
        const x = center.x + (node.x - center.x) * scale;
        const y = center.y + (node.y - center.y) * scale;
        const size = (8 + Math.sin(progress * 2 + index) * 3) * scale;
        
        // 3D node with gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 165, 0, 0.2)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 3D glow effect
        ctx.shadowColor = 'rgba(255, 165, 0, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw floating data particles
      const particleCount = 20;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + progress * 2;
        const distance = maxRadius * 0.6 + Math.sin(progress * 3 + i) * 30;
        const x = center.x + Math.cos(angle) * distance;
        const y = center.y + Math.sin(angle) * distance;
        
        const particleSize = 2 + Math.sin(progress * 2 + i) * 1;
        ctx.fillStyle = `rgba(255, 165, 0, ${0.6 + Math.sin(progress + i) * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw 3D grid background
      const gridSize = 50;
      const gridDepth = 100;
      ctx.strokeStyle = 'rgba(255, 165, 0, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < width; i += gridSize) {
        const depth = Math.sin(progress * 2) * gridDepth;
        const scale = 1 / (1 + depth / 200);
        const y = center.y + depth * scale;
        
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      
      for (let i = 0; i < height; i += gridSize) {
        const depth = Math.cos(progress * 2) * gridDepth;
        const scale = 1 / (1 + depth / 200);
        const x = center.x + depth * scale;
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
    };

    const unsubscribe = spaceProgress.onChange((p) => {
      requestAnimationFrame(() => drawNeuralNetwork(p));
    });

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      center.x = width / 2;
      center.y = height / 2;
      drawNeuralNetwork(spaceProgress.get());
    };
    
    window.addEventListener('resize', handleResize);
    drawNeuralNetwork(spaceProgress.get());

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, [spaceProgress]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default function CosmicJourney() {
  const { t } = useLanguage();
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
      if (!containerRef.current) return;
      const { top, bottom } = containerRef.current.getBoundingClientRect();
      const inView = top < window.innerHeight && bottom > 0;
      
      if (inView && audio.paused) {
        audio.play().catch(error => {
          console.log("Autoplay prevented:", error);
        });
      } else if (!inView && !audio.paused) {
        audio.pause();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  const journeyContent = [
    {
      header: t('journey.section1.header'),
      text: t('journey.section1.text'),
      position: 'left'
    },
    {
      header: t('journey.section2.header'),
      text: t('journey.section2.text'),
      position: 'right'
    },
    {
      header: t('journey.section3.header'),
      text: t('journey.section3.text'),
      position: 'left'
    },
    {
      header: t('journey.section4.header'),
      text: t('journey.section4.text'),
      position: 'right'
    },
  ];

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative w-full h-[400vh] bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <audio ref={audioRef} src="path/to/your/alpha-music.mp3" loop playsInline />
        <NeuralNetwork3D scrollYProgress={scrollYProgress} />
        
        {/* Orange Accent Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full animate-ping opacity-60"
              style={{
                top: `${15 + i * 12}%`,
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
        
        {/* Orange Glow Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-orange-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full max-w-7xl mx-auto px-8 relative">
            {/* Large Journey Title - Right Corner, Centered */}
            <motion.h1 
              className="absolute right-8 top-1/2 transform -translate-y-1/2 text-[6rem] md:text-[8rem] font-bold text-white/20 leading-none tracking-tight pointer-events-none"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              JOURNEY
            </motion.h1>
            
            {journeyContent.map((item, index) => {
              const sectionStart = index * 0.25;
              const sectionEnd = sectionStart + 0.25;
              const fadeInStart = sectionStart;
              const fadeInEnd = sectionStart + 0.05; // Faster fade in
              const fadeOutStart = sectionEnd - 0.05; // Faster fade out
              const fadeOutEnd = sectionEnd;
              
              const opacity = useTransform(scrollYProgress, 
                [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd], 
                [0, 1, 1, 0]
              );
              
              const y = useTransform(scrollYProgress,
                [fadeInStart, fadeInEnd],
                ['5px', '0px'] // Reduced movement
              );
             
              return (
                <motion.div 
                  key={index} 
                  className={`absolute p-6 ${item.position === 'left' ? 'left-8' : 'right-8'}`}
                  style={{ 
                    opacity,
                    y,
                    top: `${20 + index * 18}%`,
                    maxWidth: '500px',
                  }}
                >
                  <p className="text-sm md:text-base text-white/90 font-light leading-relaxed tracking-wide">
                    {item.text.split('.').map((sentence, idx) => (
                      <span key={idx}>
                        {sentence}
                        {idx < item.text.split('.').length - 1 && (
                          <span className="text-orange-400">.</span>
                        )}
                      </span>
                    ))}
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
