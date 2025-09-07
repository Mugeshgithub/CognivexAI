'use client';

import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Aniefiok ASUQUE",
      role: "Producer/Composer/Pianist",
      company: "Paris, France",
      content: `Advanced Portfolio with Admin Control\n\nThe website is impressive and I really love the work. The admin control system allows me to easily update and delete my live performance information and collaborations with other artists. The attention to detail and the way everything flows together is amazing. You've created something truly special that stands out from the crowd.`,
      rating: 5,
      avatar: "🎹",
      workLink: "https://aniefoik.vercel.app/"
    },
    {
      id: 2,
      name: "Narmadha",
      role: "Software Tester",
      company: "India",
      content: `Full-Stack AI Web Application\n\nCognivexAI built a great web app that changed how I create stories. It's intuitive and the AI integration works well. They handled everything from the user interface to the backend nicely. Now I can focus on my creativity instead of struggling with technical stuff.`,
      rating: 5,
      avatar: "✨",
      workLink: "https://studio--story-spark-a2jdn.us-central1.hosted.app/"
    },
    {
      id: 3,
      name: "Devika Sinha",
      role: "Fine Art Photographer",
      company: "Paris, France",
      content: `Portfolio with Shop Prints\n\nThe website looks absolutely stunning and I'm really happy with everything. My parents also saw the new version of the website yesterday and they loved it. The design perfectly captures my artistic vision and the user experience is seamless. Thank you so much for the excellent work!`,
      rating: 5,
      avatar: "🎨",
      workLink: "https://www.devikasinha.com/"
    },
    {
      id: 4,
      name: "Stefff",
      role: "Photographer/Director",
      company: "Paris, France",
      content: `Portfolio with Shop Prints\n\nI asked Mugesh to build my website and he did it perfectly. Always great response time and always willing to make things work. Great experience working with Mugesh.`,
      rating: 5,
      avatar: "📸",
      workLink: "https://www.steffff.com/"
    },
    {
      id: 5,
      name: "Dimitra Polic",
      role: "Photographer",
      company: "Paris, France",
      content: `Creative Portfolio Website\n\nThe website looks really nice. The design perfectly captures the essence of my work and the user experience is smooth and intuitive. Great job on bringing my portfolio to life!`,
      rating: 5,
      avatar: "📷",
      workLink: "https://www.dimitrapolic.com/"
    },
    {
      id: 6,
      name: "Ashwith S Pai",
      role: "Documentary Photographer",
      company: "Paris, France",
      content: `Creative Portfolio Website\n\nGood work! The website perfectly showcases my motorsport photography with excellent gallery functionality and smooth user experience. Great job on the creative portfolio!`,
      rating: 5,
      avatar: "🏁",
      workLink: "https://www.ashwithspai.com/"
    },
    {
      id: 7,
      name: "Steve George",
      role: "Data Analysis Specialist",
      company: "Cyber Security - Ireland",
      content: "Outstanding data analysis work for the WhatsTheStory project. Deep technical expertise combined with clear communication made complex security insights accessible.",
      rating: 4,
      avatar: "🛡️"
    }
  ];

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

                      {/* Author Info - Moved to top */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-full overflow-hidden">
                          {testimonial.id === 1 ? (
                            <img 
                              src="/My Pics 6.jpeg" 
                              alt={testimonial.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : testimonial.id === 2 ? (
                            <img 
                              src="/WhatsApp Image 2025-09-07 at 03.38.51.jpeg" 
                              alt={testimonial.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : testimonial.id === 5 ? (
                            <img 
                              src="/Remove background project (3)-min.png" 
                              alt={testimonial.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : testimonial.id === 6 ? (
                            <img 
                              src="/aswith.jpeg" 
                              alt={testimonial.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-2xl">{testimonial.avatar}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm">
                            {testimonial.name}
                          </h4>
                          <p className="text-blue-400 font-medium text-xs">
                            {testimonial.role}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {testimonial.company}
                          </p>
                          {testimonial.workLink && (
                            <a 
                              href={testimonial.workLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 text-xs mt-1 transition-colors duration-200"
                            >
                              View Work ↗
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Project Type */}
                      <div className="mb-4">
                        <h4 className="text-orange-400 font-semibold text-sm">
                          {testimonial.content.split('\n\n')[0]}
                        </h4>
                      </div>

                      {/* Content */}
                      <p className="text-gray-200 text-sm leading-relaxed mb-4 line-clamp-4">
                        "{testimonial.content.split('\n\n')[1]}"
                      </p>

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

