
'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/contexts/language-context';
import Chatbot from '@/components/elevenlabs-voice-chatbot';
import SplashScreen from '@/components/splash-screen';
import { useState, useEffect } from 'react';
import CustomCursor from '@/components/custom-cursor';
import BreakpointDetector from '@/components/debug/breakpoint-detector';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
               {/* Google Analytics */}
               <script async src="https://www.googletagmanager.com/gtag/js?id=G-TDRL4H24ZZ"></script>
               <script
                 dangerouslySetInnerHTML={{
                   __html: `
                     window.dataLayer = window.dataLayer || [];
                     function gtag(){dataLayer.push(arguments);}
                     gtag('js', new Date());
                     gtag('config', 'G-TDRL4H24ZZ');
                     
                     // Enhanced click tracking
                     document.addEventListener('click', function(event) {
                       const element = event.target;
                       const tagName = element.tagName.toLowerCase();
                       const text = element.textContent?.trim().substring(0, 100) || '';
                       const href = element.href || '';
                       const className = element.className || '';
                       
                       // Track different types of clicks
                       if (tagName === 'a') {
                         gtag('event', 'click', {
                           event_category: 'link',
                           event_label: text || href,
                           link_url: href,
                           link_text: text
                         });
                       } else if (tagName === 'button') {
                         gtag('event', 'click', {
                           event_category: 'button',
                           event_label: text || className,
                           button_text: text,
                           button_class: className
                         });
                       } else if (element.closest('button, a, [role="button"]')) {
                         const clickableElement = element.closest('button, a, [role="button"]');
                         gtag('event', 'click', {
                           event_category: 'interaction',
                           event_label: clickableElement.textContent?.trim().substring(0, 100) || 'unknown',
                           element_type: clickableElement.tagName.toLowerCase()
                         });
                       }
                     });
                   `,
                 }}
               />
             </head>
      <body className="font-body antialiased bg-white dark:bg-background relative min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
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
            <Analytics />
            <SpeedInsights />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
