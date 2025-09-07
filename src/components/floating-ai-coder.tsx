'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

const FloatingVisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(1247);
  const [onlineUsers, setOnlineUsers] = useState(23);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to scale and opacity
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.9]);

  // Simulate real-time visitor updates
  useEffect(() => {
    // Initial visibility
    const timer = setTimeout(() => setIsVisible(true), 1000);
    
    // Update visitor count every 15-30 seconds
    const visitorInterval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 15000 + Math.random() * 15000);
    
    // Update online users every 5-10 seconds
    const onlineInterval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(15, Math.min(35, prev + change));
      });
    }, 5000 + Math.random() * 5000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(visitorInterval);
      clearInterval(onlineInterval);
    };
  }, []);

  return (
    <motion.div
      className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 pointer-events-none"
      style={{
        scale,
        opacity,
      }}
    >
      {/* Main Container */}
      <div className="relative">
        {/* Glow Effect - Orange theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-orange-400/5 to-orange-600/10 rounded-xl blur-2xl scale-110"></div>
        
        {/* Visitor Counter Container */}
        <motion.div 
          className="relative bg-gray-900/90 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 w-40 shadow-2xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-orange-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-orange-300 font-medium">Live Stats</span>
          </div>
          
          {/* Visitor Count */}
          <div className="space-y-3">
            <div className="text-center">
              <motion.div 
                className="text-2xl font-bold text-white"
                key={visitorCount}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {visitorCount.toLocaleString()}
              </motion.div>
              <div className="text-xs text-gray-400 mt-1">Total Visitors</div>
            </div>
            
            {/* Online Users */}
            <div className="text-center">
              <motion.div 
                className="text-lg font-semibold text-orange-400"
                key={onlineUsers}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {onlineUsers}
              </motion.div>
              <div className="text-xs text-gray-400 mt-1">Online Now</div>
            </div>
          </div>
          
          {/* Animated Dots */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-orange-400 rounded-full"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${80 + i * 10}%`,
                }}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Live Indicator */}
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg border border-green-400/30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </motion.div>
        
        {/* Pulsing Ring */}
        <motion.div
          className="absolute inset-0 border-2 border-orange-500/20 rounded-xl"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
};

export default FloatingVisitorCounter;
