'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Palette, Code, Bot, BarChart3, TrendingUp } from 'lucide-react';

export default function Services() {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  const services = [
    {
      title: 'Web Development & Design',
      description: 'Professional websites and portfolios for creative professionals'
    },
    {
      title: 'AI Automation Services',
      description: 'Intelligent workflows that save you 10+ hours per week'
    },
    {
      title: 'Data Analysis & Insights',
      description: 'Transform your business data into actionable growth strategies'
    },
    {
      title: 'AI Integration Services',
      description: 'Smart chatbots and AI assistants for your business'
    },
    {
      title: 'Business Process Optimization',
      description: 'Streamline operations and boost efficiency with AI'
    },
    {
      title: 'Custom Development',
      description: 'Tailored solutions built specifically for your business needs'
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [services.length]);

  return (
    <div className="relative w-full overflow-hidden bg-black">
      {/* Our Process Section */}
      <section className="relative w-full py-16 md:py-20 lg:py-24 flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {/* Title - Center aligned, orange, capital letters, transparent */}
            <motion.h2 
              className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-[3rem] font-bold text-orange-400/40 leading-none tracking-tight mb-12 sm:mb-16 md:mb-20 lg:mb-24"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              OUR SERVICES
            </motion.h2>
              
            {/* Animated Process Flow */}
            <div className="relative max-w-6xl mx-auto">
              {/* Animated Ball - Hidden on mobile */}
              <motion.div
                className="absolute top-1/2 left-0 w-4 h-4 sm:w-6 sm:h-6 bg-orange-400 rounded-full shadow-lg z-10 hidden sm:block"
                animate={{
                  x: [0, 200, 400, 600, 800, 1000],
                  y: [0, -30, 0, -30, 0, -30, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                }}
                style={{
                  transform: "translateY(-50%)"
                }}
              />
              
              {/* Process Steps with Flow Lines */}
              <div className="relative">
                {/* Flow Line - Hidden on mobile */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400/60 via-orange-400/40 to-orange-400/20 transform -translate-y-1/2 hidden sm:block" />
                
                {/* Process Steps - Stack on mobile */}
                <div className="flex flex-col sm:flex-row justify-between items-center relative z-20 gap-4 sm:gap-0">
                  {[
                    {
                      step: `1. UNDERSTAND`,
                      description: "We analyze your business needs",
                      icon: Search
                    },
                    {
                      step: `2. DESIGN`, 
                      description: "Create beautiful, converting websites",
                      icon: Palette
                    },
                    {
                      step: `3. DEVELOP`,
                      description: "Build intelligent, responsive solutions",
                      icon: Code
                    },
                    {
                      step: `4. AUTOMATE`,
                      description: "Set up AI workflows for efficiency",
                      icon: Bot
                    },
                    {
                      step: `5. ANALYZE`,
                      description: "Provide data insights for growth",
                      icon: BarChart3
                    },
                    {
                      step: `6. OPTIMIZE`,
                      description: "Continuously improve based on results",
                      icon: TrendingUp
                    }
                  ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={index}
                        className="flex flex-col items-center text-center max-w-[120px] sm:max-w-[150px] w-full sm:w-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        {/* Process Node */}
                        <div className="relative mb-3 sm:mb-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-orange-400/60 rounded-full flex items-center justify-center mb-2 sm:mb-3 hover:border-orange-400 hover:bg-orange-400/10 transition-all duration-300">
                            <IconComponent className="w-5 h-5 sm:w-7 sm:h-7 text-orange-400" />
                          </div>
                          {/* Pulse Effect */}
                          <motion.div
                            className="absolute inset-0 w-16 h-16 border-2 border-orange-400/30 rounded-full"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.3
                            }}
                          />
                        </div>
                        
                        {/* Step Content */}
                        <div>
                          <h3 className="text-xs sm:text-sm md:text-base font-bold text-orange-400 mb-1 sm:mb-2">
                            {item.step}
                          </h3>
                          <p className="text-xs sm:text-xs md:text-sm text-gray-300 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          
            {/* Services Carousel Section - Centered */}
            <div className="flex justify-center items-center mt-12 sm:mt-16 md:mt-20">
              <motion.div
                className="relative h-[300px] sm:h-[350px] md:h-[400px] w-full max-w-2xl flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                {/* Carousel Container */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.title}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{
                        opacity: index === currentServiceIndex ? 1 : 0,
                        scale: index === currentServiceIndex ? 1 : 0.8,
                        y: index === currentServiceIndex ? 0 : 20,
                        zIndex: index === currentServiceIndex ? 10 : 1
                      }}
                      transition={{ 
                        duration: 0.6, 
                        ease: "easeInOut"
                      }}
                    >
                      <motion.h3 
                        className="text-lg md:text-xl font-bold text-white mb-8 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {service.title}
                      </motion.h3>
                      <motion.p 
                        className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {service.description}
                      </motion.p>
                    </motion.div>
                  ))}
                  
                  {/* Carousel Navigation Dots */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    {services.map((_, index) => (
                      <motion.button
                        key={index}
                        className={`w-4 h-4 rounded-full transition-all duration-300 ${
                          index === currentServiceIndex 
                            ? 'bg-orange-400 scale-125' 
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                        onClick={() => setCurrentServiceIndex(index)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                  
                  {/* Carousel Navigation Arrows */}
                  <motion.button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-all duration-300 z-20"
                    onClick={() => setCurrentServiceIndex((prev) => (prev - 1 + services.length) % services.length)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-all duration-300 z-20"
                    onClick={() => setCurrentServiceIndex((prev) => (prev + 1) % services.length)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
