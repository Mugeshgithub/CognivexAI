
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
             </head>
      <body className="font-body antialiased bg-white dark:bg-background relative min-h-screen">
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
