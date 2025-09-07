
'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Footer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="relative bg-gray-100 dark:bg-gray-900 py-16 overflow-hidden">
      <div className="container relative z-10">
        {/* Top Section with Dots and Links */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          {/* Left Side - Dots and Tagline */}
          <div className="flex items-start gap-6 mb-8 md:mb-0">
            {/* Dot Pattern */}
            <div className="grid grid-cols-3 gap-1 mt-1">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-gray-400 rounded-full"></div>
              ))}
            </div>
            
            {/* Tagline */}
            <div className="flex flex-col">
              <p className="text-gray-900 dark:text-white text-sm">AI Innovation Studio</p>
              <p className="text-gray-900 dark:text-white text-sm">Empowering minds,</p>
              <p className="text-gray-900 dark:text-white text-sm">engineering magic.</p>
              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
            </div>
          </div>

          {/* Right Side - Navigation Columns */}
          <div className="grid grid-cols-3 gap-12">
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-medium text-gray-400 tracking-widest uppercase">Useful Links</h3>
              <Link href="#products" className="text-gray-900 dark:text-white text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors">About</Link>
              <Link href="#journey" className="text-gray-900 dark:text-white text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Journey</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-medium text-gray-400 tracking-widest uppercase">Legal</h3>
              <Link href="/privacy" className="text-gray-900 dark:text-white text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-900 dark:text-white text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">Terms of Service</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-medium text-gray-400 tracking-widest uppercase">Updates</h3>
              <Link href="https://www.linkedin.com/company/cognivexai/" className="text-gray-900 dark:text-white text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</Link>
            </div>
          </div>
        </div>

        {/* Simple Line */}
        <div className="w-full h-px bg-gray-700 mb-8"></div>
      </div>

      {/* Bottom Section - Smaller Cognivex Logo */}
      <div className="relative">
        {/* Smaller Cognivex Text */}
        <div className="relative">
          <h1 className="text-[6rem] md:text-[8rem] font-bold text-gray-900 dark:text-white leading-none tracking-tight -mt-8">
            COGNIVEXAI
          </h1>
          
          {/* Copyright Symbol */}
          <div className="absolute right-8 bottom-8 text-gray-900 dark:text-white">
            <span className="text-2xl">©</span>
          </div>
          
          {/* Theme Toggle - Clickable */}
          <div className="absolute left-8 bottom-8">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 bg-gray-800 dark:bg-black rounded-lg flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors cursor-pointer border border-gray-600 dark:border-gray-700"
              title={`Switch to ${mounted && theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {mounted && theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
