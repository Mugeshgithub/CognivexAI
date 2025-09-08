'use client';

import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 flex flex-col items-center justify-center bg-black">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Horizontal Layout - Title and Content Side by Side */}
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-center">
              {/* Title Column - Left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="lg:col-span-1 text-center lg:text-left"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-[3rem] font-bold text-orange-400/40 leading-none tracking-tight uppercase">
                  About
                </h2>
              </motion.div>

              {/* Content Column - Right */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <div className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed space-y-4 sm:space-y-6">
                  {/* First paragraph */}
                  <p>
                    CognivexAI is a fast-growing AI innovation studio that blends creativity with intelligence.
                  </p>
                  
                  {/* Second paragraph */}
                  <p>
                    We help creative professionals and businesses thrive through modern websites, intelligent automation, and data-driven insights.
                  </p>
                  
                  {/* Vision paragraph */}
                  <p className="relative">
                    <span className="text-orange-400/80 drop-shadow-[0_0_8px_rgba(251,146,60,0.3)]">
                      But our vision goes further.
                    </span>
                    <span className="text-gray-300">
                      Beyond services, we're building breakthrough AI products — from automated data analysis to community-driven chatbots and screen-aware assistants — designed to transform how humans work and create.
                    </span>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}