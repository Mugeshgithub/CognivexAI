
'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const journeyContent = [
    {
      header: 'THE AI POLYMATH EMERGES',
      text: 'In 2025, CognivexAI steps beyond boundaries — moving fluidly between data, design, and intelligent automation. Our mission: to create AI that enhances every aspect of human endeavor.',
      position: 'left'
    },
    {
      header: 'BREAKING NEW GROUND',
      text: 'Data Sanity → Our first leap into end-to-end data automation, turning hours of analysis into minutes. Community Chatbot → A new way for service providers and seekers to connect, powered by AI. Vision AI Assistant → Real-time screen analysis that sees what you see, eliminating screenshots and context switching.',
      position: 'right'
    },
    {
      header: 'THE POLYMATH APPROACH',
      text: 'Unlike single-focus companies, CognivexAI thrives across multiple domains — combining data analysis, web development, product design, and intelligent automation into holistic solutions.',
      position: 'left'
    },
    {
      header: 'BUILDING THE FUTURE',
      text: 'This is just the beginning. As we evolve, CognivexAI continues to expand its polymath ecosystem — where versatility meets innovation, and AI becomes a true partner in human creativity and problem-solving.',
      position: 'right'
    },
  ];

  return (
    <section
      key="journey"
      id="journey"
      ref={containerRef}
      className="relative w-full h-[500vh] bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
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
              const sectionStart = index * 0.2;
              const sectionEnd = sectionStart + 0.2;
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
                    top: `${10 + index * 20}%`,
                    maxWidth: '500px',
                  }}
                >
                  {/* Section Header */}
                  <motion.h3 
                    className="text-base md:text-lg font-bold text-orange-400 mb-3 tracking-wider"
                    initial={{ opacity: 0, x: item.position === 'left' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {item.header}
                  </motion.h3>
                  
                  {/* Section Content */}
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
                  
                  {/* Section Separator Dot */}
                  <motion.div 
                    className={`absolute ${item.position === 'left' ? 'right-0' : 'left-0'} top-1/2 transform -translate-y-1/2 w-3 h-3 bg-orange-400 rounded-full`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  />
                  
                  {/* Connection Line */}
                  <motion.div 
                    className={`absolute ${item.position === 'left' ? 'right-1.5' : 'left-1.5'} top-1/2 w-0.5 h-16 bg-gradient-to-b ${item.position === 'left' ? 'from-orange-400 to-transparent' : 'from-transparent to-orange-400'}`}
                    initial={{ height: 0 }}
                    animate={{ height: '4rem' }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
