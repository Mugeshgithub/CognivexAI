'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { AnimatedLogo } from '@/components/ui/animated-logo';
import { Menu, X, Play, Pause } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const navLinks = [
  { href: '#products', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
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
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
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
              <Link
                key={link.href}
                href={link.href}
                className="block text-foreground/80 transition-colors hover:text-foreground py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
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
    </header>
  );
}