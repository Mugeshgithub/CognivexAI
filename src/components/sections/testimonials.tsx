'use client';

import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    name: "Portfolio People Review",
    role: "Complete Website Design",
    company: "4 Photographers Portfolio",
    content: "Exceptional website design that perfectly captured our vision. The portfolio showcases our photography work beautifully with stunning visuals and seamless user experience.",
    rating: 4,
    avatar: "📸"
  },
  {
    id: 2,
    name: "Steve George",
    role: "Data Analysis",
    company: "Cyber Security - Ireland",
    content: "Outstanding data analysis work for the WhatsTheStory project. Deep technical expertise combined with clear communication made complex security insights accessible.",
    rating: 4,
    avatar: "🛡️"
  },
  {
    id: 3,
    name: "Narmadha",
    role: "Full Stack Web Design",
    company: "Software Tester - India",
    content: "Incredible full-stack development skills. The website is not only visually stunning but also technically robust with excellent performance and user experience.",
    rating: 5,
    avatar: "💻"
  },
  {
    id: 4,
    name: "Tech Solutions Inc",
    role: "AI Integration",
    company: "Software Company - USA",
    content: "The AI chatbot integration exceeded our expectations. It handles customer queries efficiently and provides accurate responses 24/7.",
    rating: 4,
    avatar: "🤖"
  },
  {
    id: 5,
    name: "Digital Marketing Pro",
    role: "Web Development",
    company: "Marketing Agency - Canada",
    content: "Fast, responsive, and modern website that perfectly represents our brand. The development process was smooth and professional.",
    rating: 4,
    avatar: "🚀"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative py-16 bg-black overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0">
        {/* Moving circles */}
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-24 h-24 bg-purple-500/20 rounded-full"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/3 w-20 h-20 bg-orange-500/20 rounded-full"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-500/20 rounded-full"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Real feedback from amazing people I've had the privilege to work with
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Testimonials Carousel */}
          <div className="overflow-hidden">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative group"
                  >
                    {/* Card */}
                    <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700 hover:border-gray-500 transition-all duration-300">
                      {/* Quote Icon */}
                      <div className="absolute -top-3 left-6 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Quote className="w-3 h-3 text-white" />
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < testimonial.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-600'
                            }`} 
                          />
                        ))}
                      </div>

                      {/* Content */}
                      <p className="text-gray-200 text-sm leading-relaxed mb-4 line-clamp-4">
                        "{testimonial.content}"
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{testimonial.avatar}</div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">
                            {testimonial.name}
                          </h4>
                          <p className="text-blue-400 font-medium text-xs">
                            {testimonial.role}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {testimonial.company}
                          </p>
                        </div>
                      </div>

                      {/* Hover Effect Border */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-300"></div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-blue-500 w-6' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <span className="text-base font-semibold">Ready to work together?</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
