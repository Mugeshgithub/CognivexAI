
'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/language-context';
import { useState, useEffect } from 'react';

interface Product {
  title: string;
  description: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;
  };
}

const approachSteps: Product[] = [
  {
    title: 'Discovery & Planning',
    description: 'Understanding your needs and goals',
    position: { top: '10%', left: '50%', transform: 'translate(-50%, -50%)' },
  },
  {
    title: 'Collaborative Design',
    description: 'Working together to create solutions',
    position: { top: '50%', left: '10%', transform: 'translate(-50%, -50%)' },
  },
  {
    title: 'Iterative Development',
    description: 'Building, testing, and refining',
    position: { top: '75%', left: '40%', transform: 'translate(-50%, -50%)' },
  },
  {
    title: 'Continuous Learning',
    description: 'Adapting and improving with each project',
    position: { top: '50%', left: '70%', transform: 'translate(-50%, -50%)' },
  },
  {
    title: 'Ongoing Support',
    description: 'Ensuring your success long-term',
    position: { top: '20%', left: '20%', transform: 'translate(-50%, -50%)' },
  },
];

export default function Products() {
  const { t, language } = useLanguage();
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  
  // Debug: Show current language
  console.log('Products component - Current language:', language);
  console.log('Products component - Translation test:', t('products.about.title'));

  const services = [
    {
      title: t('products.services.smart-agents.title'),
      description: t('products.services.smart-agents.description')
    },
    {
      title: t('products.services.data-analysis.title'),
      description: t('products.services.data-analysis.description')
    },
    {
      title: t('products.services.automation.title'),
      description: t('products.services.automation.description')
    },
    {
      title: t('products.services.web-dev.title'),
      description: t('products.services.web-dev.description')
    },
    {
      title: t('products.services.marketing.title'),
      description: t('products.services.marketing.description')
    },
    {
      title: t('products.services.custom.title'),
      description: t('products.services.custom.description')
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [services.length]);

  const ProductElement = ({ product }: { product: Product }) => (
    <motion.div
      className="absolute backdrop-blur-md bg-black/20 border border-gray-800/50 rounded-xl p-6 w-72 h-32 flex flex-col justify-center cursor-pointer group"
      style={{ ...product.position }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.5 }}
      whileHover={{ 
        scale: 1.02, 
        y: -3,
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      <h3 className="text-lg font-medium text-gray-300 mb-2 group-hover:text-white transition-colors duration-200">{product.title}</h3>
      <p className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors duration-200">{product.description}</p>
      <motion.div
        className="absolute top-3 right-3 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  );

  return (
    <section id="products" className="relative w-full min-h-screen py-8 md:py-12 lg:py-16 flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* About Cognivex Section */}
      <div className="w-full mb-12 md:mb-16 px-4 md:px-8 lg:px-12">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="font-headline text-xl md:text-2xl lg:text-3xl font-medium text-white/90 mb-6 md:mb-8 text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {t('products.about.title')}
          </motion.h2>
          <div className="w-full text-sm md:text-base text-gray-300 leading-relaxed">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="transition-transform duration-200 max-w-4xl mx-auto text-center"
            >
              {t('products.about.description')}
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* What We Offer Section */}
      <div className="container mt-8 md:mt-12">
        <motion.div
          className="text-center max-w-6xl mx-auto px-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="font-headline text-xl md:text-2xl lg:text-3xl font-medium text-white/90 mb-4 md:mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {t('products.solutions.title')}
          </motion.h2>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Services Carousel - Left Side */}
          <motion.div
            className="relative h-[400px] flex items-center justify-center"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {/* Carousel Container */}
            <div className="relative w-full max-w-md h-full flex items-center justify-center">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
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
                    className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {service.title}
                  </motion.h3>
                  <motion.p 
                    className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {service.description}
                  </motion.p>
                </motion.div>
              ))}
              
              {/* Carousel Navigation Dots */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {services.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
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
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-all duration-300 z-20"
                onClick={() => setCurrentServiceIndex((prev) => (prev - 1 + services.length) % services.length)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <motion.button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-all duration-300 z-20"
                onClick={() => setCurrentServiceIndex((prev) => (prev + 1) % services.length)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
          
          {/* Interactive Space Experience - Right Side */}
          <motion.div
            className="relative h-[500px] md:h-[600px] rounded-xl overflow-hidden cursor-pointer group"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Dark Theme Background */}
            
            {/* Client ROI Calculator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white mb-1">{t('products.chart.title')}</h3>
                <div className="text-xs text-orange-300">{t('products.chart.subtitle')}</div>
              </div>
              
              {/* AI Web Apps Chart */}
              <div className="relative h-24 mb-4">
                {/* Chart Grid */}
                <div className="absolute inset-0">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full h-px bg-gray-600/20"
                      style={{ top: `${25 * i}%` }}
                    />
                  ))}
                </div>
                
                {/* App Performance Bars */}
                <div className="relative h-full flex items-end justify-center space-x-6 px-4">
                  {/* Traditional Apps */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-white mb-1">{t('products.chart.traditional')}</div>
                    <div className="flex items-end space-x-1">
                      <div className="w-4 h-8 bg-white/60 rounded-t-sm animate-pulse"></div>
                      <div className="w-4 h-4 bg-white/40 rounded-t-sm animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{t('products.chart.manual-process')}</div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex items-center">
                    <div className="text-orange-400 text-xl">→</div>
                  </div>
                  
                  {/* AI-Powered Apps */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-white mb-1">{t('products.chart.ai-powered')}</div>
                    <div className="flex items-end space-x-1">
                      <div className="w-4 h-6 bg-white/80 rounded-t-sm animate-pulse"></div>
                      <div className="w-4 h-12 bg-white/60 rounded-t-sm animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{t('products.chart.smart-automation')}</div>
                  </div>
                </div>
              </div>
              
              {/* Key Benefits */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-gradient-to-r from-orange-500/20 to-orange-400/20 rounded-lg p-2 border border-orange-400/30">
                  <div className="text-xs text-orange-300 mb-1">{t('products.chart.process-speed')}</div>
                  <div className="text-sm font-bold text-orange-400">10x</div>
                  <div className="text-xs text-gray-400">{t('products.chart.faster-execution')}</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500/20 to-orange-400/20 rounded-lg p-2 border border-orange-400/30">
                  <div className="text-xs text-orange-300 mb-1">{t('products.chart.data-insights')}</div>
                  <div className="text-sm font-bold text-orange-400">Real-time</div>
                  <div className="text-xs text-gray-400">{t('products.chart.live-analytics')}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
