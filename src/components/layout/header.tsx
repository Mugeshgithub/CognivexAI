'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { AnimatedLogo } from '@/components/ui/animated-logo';
import { Menu, X, Play, Pause, Monitor, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const navLinks = [
  { href: '#products', label: 'About' },
  { href: '#contact', label: 'Contact' },
  { href: '#', label: 'Projects', isButton: true },
];

// Case study data (same as in chatbot)
const caseStudyCategories = [
  {
    title: 'Web Development',
    projects: [
      {
        id: 'aniefiok',
        name: 'Aniefiok',
        description: 'Music Portfolio with Admin Panel',
        industry: 'Creative',
        url: 'https://aniefoik.vercel.app/',
        type: 'website',
        features: ['Admin Panel Integration', 'Live Performance Updates', 'Music Streaming']
      },
      {
        id: 'devika',
        name: 'Devika Sinha',
        description: 'Fine Art Photography with Store',
        industry: 'Art & Photography',
        url: 'https://www.devikasinha.com/',
        type: 'website',
        features: ['Picture Store', 'CMS Integration', 'E-commerce']
      },
      {
        id: 'dimitra',
        name: 'Dimitra Polic',
        description: 'Creative Photography Portfolio',
        industry: 'Photography',
        url: 'https://www.dimitrapolic.com/',
        type: 'external',
        features: ['CMS Integration', 'Portfolio Management', 'Responsive Design']
      },
      {
        id: 'steffff',
        name: 'Steffff',
        description: 'Photography Portfolio with Store',
        industry: 'Photography',
        url: 'https://www.steffff.com/',
        type: 'website',
        features: ['Picture Store', 'Portfolio Gallery', 'Print Sales']
      },
      {
        id: 'ashwith',
        name: 'Ashwith S Pai',
        description: 'Documentary Photography Portfolio',
        industry: 'Documentary Photography',
        url: 'https://www.ashwithspai.com/',
        type: 'external',
        features: ['Gallery System', 'Motorsport Photography', 'Portfolio Showcase']
      },
      {
        id: 'narmadha',
        name: 'Narmadha',
        description: 'Story Spark - AI Story Creation',
        industry: 'AI Content Creation',
        url: 'https://studio--story-spark-a2jdn.us-central1.hosted.app/',
        type: 'website',
        features: ['AI Story Generation', 'Story Book Publishing', 'Content Automation']
      }
    ]
  },
  {
    title: 'Data Analysis',
    projects: [
      {
        id: 'whatsthestory',
        name: 'What\'s The Story',
        description: 'Startup Journey Analysis & No-Code Platform',
        industry: 'Business Intelligence',
        url: '/Wats.pdf',
        type: 'pdf',
        features: ['One Year Analysis', 'Startup Metrics', 'No-Code Platform Development']
      },
      {
        id: 'french-market-analysis',
        name: 'French Market Analysis',
        description: 'Data Analysis using Snowflake & Metabase',
        industry: 'Market Research',
        url: '/French Market Analysis.mov',
        type: 'video',
        features: ['Snowflake Analytics', 'Metabase Visualization', 'French Market Insights']
      }
    ]
  }
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.3;
    audio.loop = true;
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(error => {
        console.error('Failed to play audio:', error);
      });
      setIsPlaying(true);
    }
  };

  const selectProject = (projectId: string) => {
    let project = null;
    for (const category of caseStudyCategories) {
      project = category.projects.find(p => p.id === projectId);
      if (project) break;
    }
    
    if (project) {
      setSelectedProject(projectId);
      setCurrentUrl(project.url);
    }
  };

  const closeProjects = () => {
    setIsProjectsOpen(false);
    setSelectedProject(null);
    setCurrentUrl('');
  };

  return (
    <header className="fixed top-0 z-40 w-full animate-fade-in bg-background/80 backdrop-blur-sm border-b border-border/20">
       <div className="container flex h-16 md:h-20 items-center justify-between px-4">
         <Link href="/" className="flex items-center space-x-2">
            <AnimatedLogo className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-lg md:text-xl font-bold text-white">
              CognivexAI
            </span>
         </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            link.isButton ? (
              <button
                key={link.label}
                onClick={() => setIsProjectsOpen(true)}
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </button>
            ) : (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
            )
          ))}
          
          {/* Simple Music Control */}
          <Button
            onClick={toggleMusic}
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-orange-400 hover:text-orange-300 hover:bg-orange-500/20"
            title={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Mobile Music Control */}
          <Button
            onClick={toggleMusic}
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-orange-400 hover:text-orange-300 hover:bg-orange-500/20"
            title={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-b border-border/20">
          <nav className="container px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              link.isButton ? (
                <button
                  key={link.label}
                  onClick={() => {
                    setIsProjectsOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-foreground/80 transition-colors hover:text-foreground py-2 text-left"
                >
                  {link.label}
                </button>
              ) : (
              <Link
                key={link.href}
                href={link.href}
                className="block text-foreground/80 transition-colors hover:text-foreground py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
              )
            ))}
          </nav>
        </div>
      )}
      
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src="/space-ambient-cinematic-351304.mp3"
        preload="metadata"
      />

      {/* Projects Browser Modal */}
      {isProjectsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2" style={{ top: '80px', height: 'calc(100vh - 80px)' }}>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-6xl h-full flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg backdrop-blur-sm">
                  <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Our Projects</h2>
                  <p className="text-xs text-gray-300">Explore our portfolio of innovative solutions</p>
                </div>
              </div>
              <Button
                onClick={closeProjects}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 flex min-h-0">
              {/* Project List */}
              <div className="w-32 sm:w-48 md:w-64 lg:w-72 border-r border-white/10 p-1.5 sm:p-2 md:p-3 overflow-y-auto">
                <div className="space-y-2 sm:space-y-3">
                  {caseStudyCategories.map((category) => (
                    <div key={category.title} className="space-y-1 sm:space-y-2">
                      <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                        {category.title}
                      </h3>
                      <div className="space-y-1">
                        {category.projects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => selectProject(project.id)}
                            className={`w-full text-left p-1 sm:p-1.5 md:p-2 rounded-lg border transition-all duration-300 backdrop-blur-sm ${
                              selectedProject === project.id
                                ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 shadow-lg shadow-orange-500/20'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-300 hover:text-white'
                            }`}
                          >
                            <div className="text-xs font-medium mb-0.5 sm:mb-1">{project.name}</div>
                            <div className="text-xs text-gray-400 mb-0.5 sm:mb-1 line-clamp-1 sm:line-clamp-2">{project.description}</div>
                            <div className="flex flex-wrap gap-0.5 sm:gap-1">
                              {project.features.slice(0, 2).map((feature, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-0.5 sm:px-1 md:px-1.5 py-0.5 bg-white/10 rounded-full text-gray-300"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browser */}
              <div className="flex-1 flex flex-col p-2 sm:p-3">
                {selectedProject ? (
                  <div className="flex-1 relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 bg-white overflow-hidden rounded-xl">
                      {(() => {
                        // Find project across all categories
                        let project = null;
                        for (const category of caseStudyCategories) {
                          project = category.projects.find(p => p.id === selectedProject);
                          if (project) break;
                        }
                        
                        if (!project) return null;
                        
                        if (project.type === 'pdf') {
                          return (
                            <iframe
                              src={`${project.url}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                              className="w-full h-full border-0"
                              title="PDF Viewer"
                              loading="lazy"
                              style={{
                                transform: 'scale(1)',
                                transformOrigin: 'top left',
                                width: '100%',
                                height: '100%'
                              }}
                            />
                          );
                        } else if (project.type === 'video') {
                          return (
                            <video
                              src={currentUrl || ''}
                              className="w-full h-full object-contain bg-black"
                              controls
                              preload="metadata"
                            >
                              Your browser does not support the video tag.
                            </video>
                          );
                        } else if (project.type === 'external') {
                          return (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                              <div className="text-center p-8">
                                <div className="mb-4">
                                  <ExternalLink className="h-16 w-16 mx-auto text-orange-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">External Website</h3>
                                <p className="text-gray-600 mb-4">This website cannot be embedded due to security restrictions.</p>
                                <a
                                  href={currentUrl || ''}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Open in New Tab
                                </a>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="w-full h-full overflow-hidden">
                              <iframe
                                src={currentUrl || ''}
                                className="w-full h-full border-0"
                                title="Case Study Browser"
                                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                style={{
                                  transform: 'scale(0.75)',
                                  transformOrigin: 'top left',
                                  width: '133.33%',
                                  height: '133.33%',
                                  overflow: 'hidden'
                                }}
                              />
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="text-center">
                      <div className="p-3 bg-orange-500/20 rounded-full mb-3 backdrop-blur-sm">
                        <Monitor className="h-8 w-8 mx-auto text-orange-400" />
                      </div>
                      <h3 className="text-base font-medium text-white mb-1">Select a Project</h3>
                      <p className="text-xs text-gray-300">Choose from our categorized portfolio to view detailed projects</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}