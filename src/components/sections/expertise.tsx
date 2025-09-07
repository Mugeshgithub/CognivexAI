'use client';

import { motion } from 'framer-motion';
import { 
  SiSnowflake, 
  SiDatabricks, 
  SiWix, 
  SiSquarespace, 
  SiFramer, 
  SiFigma, 
  SiFirebase,
  SiMetabase
} from 'react-icons/si';
import { FaRobot, FaDatabase, FaBrain, FaCode, FaGoogle, FaCogs } from 'react-icons/fa';

// Icon mapping with proper brand icons
const getIcon = (tool: string) => {
  const iconMap: { [key: string]: JSX.Element } = {
    'Snowflake': <SiSnowflake className="w-4 h-4 mr-2" />,
    'Databricks': <SiDatabricks className="w-4 h-4 mr-2" />,
    'DataRobot': <FaBrain className="w-4 h-4 mr-2" />,
    'Metabase': <SiMetabase className="w-4 h-4 mr-2" />,
    'Wix': <SiWix className="w-4 h-4 mr-2" />,
    'Squarespace': <SiSquarespace className="w-4 h-4 mr-2" />,
    'Framer': <SiFramer className="w-4 h-4 mr-2" />,
    'Figma': <SiFigma className="w-4 h-4 mr-2" />,
    'CursorAI': <FaCode className="w-4 h-4 mr-2" />,
    'Firebase Studio': <SiFirebase className="w-4 h-4 mr-2" />,
    'Gemini CLI': <FaGoogle className="w-4 h-4 mr-2" />,
    'n8n': <FaCogs className="w-4 h-4 mr-2" />,
  };
  return iconMap[tool] || null;
};

export default function OurExpertise() {
  const expertiseCategories = [
    {
      title: 'Data & AI Platforms',
      description: 'Expertise in modern data cloud & AI workflows',
      tools: ['Snowflake', 'Databricks', 'DataRobot', 'Metabase']
    },
    {
      title: 'Web Design & Creative Platforms',
      description: 'Clean, modern sites for creatives & SMBs',
      tools: ['Wix', 'Squarespace', 'Framer', 'Figma']
    },
    {
      title: 'Full-Stack Development & Automation',
      description: 'AI-powered custom builds & apps',
      tools: ['CursorAI', 'Firebase Studio', 'Gemini CLI', 'n8n']
    }
  ];

  return (
    <section className="relative w-full py-16 md:py-20 lg:py-24 bg-black">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="w-full max-w-6xl mx-auto">
            {/* Title matching other sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center mb-20 md:mb-24"
            >
              <h2 className="text-[2.5rem] md:text-[3rem] font-bold text-orange-400/40 leading-none tracking-tight uppercase">
                Our Expertise
              </h2>
            </motion.div>

            {/* Integrated content flow */}
            <div className="space-y-12">
              {expertiseCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Category header - simplified */}
                  <div className="text-center mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      {category.title}
                    </h3>
                  </div>
                  
                  {/* Scrolling tools with integrated design */}
                  <div className="relative overflow-hidden py-4">
                    <div className={`flex ${index === 0 ? 'animate-scroll-right' : index === 1 ? 'animate-scroll-left' : 'animate-scroll-right'}`}>
                      {[...Array(3)].map((_, setIndex) => (
                        <div key={setIndex} className="flex flex-shrink-0">
                          {category.tools.map((tool, toolIndex) => {
                            const icon = getIcon(tool);
                            return (
                              <span
                                key={`${setIndex}-${toolIndex}`}
                                className="inline-flex items-center justify-center w-48 px-4 py-2 bg-transparent border border-orange-400/30 rounded-full text-sm text-white hover:text-white hover:border-orange-400 hover:bg-orange-400/10 transition-all duration-300 flex-shrink-0 mr-12"
                              >
                                <span className="text-orange-400 mr-2">{icon}</span>
                                {tool}
                              </span>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for seamless infinite scroll */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        @keyframes scroll-right {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
          width: 300%;
          will-change: transform;
        }
        
        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
          width: 300%;
          will-change: transform;
        }
        
        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
