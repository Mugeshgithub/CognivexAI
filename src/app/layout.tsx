
'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import Chatbot from '@/components/elevenlabs-voice-chatbot';
import SplashScreen from '@/components/splash-screen';
import { useState, useEffect } from 'react';
import CustomCursor from '@/components/custom-cursor';
import BreakpointDetector from '@/components/debug/breakpoint-detector';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  return (
    <html suppressHydrationWarning>
             <head>
               <meta charSet="utf-8" />
               <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, shrink-to-fit=no" />
               <title>CognivexAI</title>
               <meta name="description" content="A discovery engine for everyone." />
               <link rel="preconnect" href="https://fonts.googleapis.com" />
               <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
               <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
               <style dangerouslySetInnerHTML={{
                 __html: `
                   @font-face {
                     font-family: 'Inter';
                     font-display: swap;
                     font-weight: 400 700;
                   }
                   @font-face {
                     font-family: 'Space Grotesk';
                     font-display: swap;
                     font-weight: 400 700;
                   }
                 `
               }} />
               <script dangerouslySetInnerHTML={{
                 __html: `
                   // Force consistent zoom and prevent browser scaling
                   (function() {
                     // Wait for DOM to be ready
                     if (document.readyState === 'loading') {
                       document.addEventListener('DOMContentLoaded', initZoomControl);
                     } else {
                       initZoomControl();
                     }
                     
                     function initZoomControl() {
                       // Check if elements exist before accessing
                       if (document.documentElement && document.body) {
                         // Reset zoom on load
                         document.documentElement.style.zoom = '1';
                         document.body.style.zoom = '1';
                         
                         // Prevent zoom changes
                         let lastZoom = 1;
                         const observer = new MutationObserver(function(mutations) {
                           mutations.forEach(function(mutation) {
                             if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                               if (document.documentElement) {
                                 const currentZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
                                 if (Math.abs(currentZoom - lastZoom) > 0.01) {
                                   document.documentElement.style.zoom = '1';
                                   if (document.body) {
                                     document.body.style.zoom = '1';
                                   }
                                 }
                                 lastZoom = currentZoom;
                               }
                             }
                           });
                         });
                         
                         if (document.documentElement) {
                           observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
                         }
                         if (document.body) {
                           observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
                         }
                       }
                     }
                   })();
                 `
               }} />
             </head>
      <body className="font-body antialiased bg-white dark:bg-background" style={{ position: 'relative', minHeight: '100%', top: '0px' }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CustomCursor />
          <div className={`${loading ? 'opacity-0' : 'animate-fade-in opacity-100'}`}>
            <Header />
            <main>{children}</main>
            <Footer />
            <Chatbot />
            <Toaster />
            <BreakpointDetector />
          </div>
          <SplashScreen isVisible={loading} onFinished={() => setLoading(false)} />
        </ThemeProvider>
      </body>
    </html>
  );
}
