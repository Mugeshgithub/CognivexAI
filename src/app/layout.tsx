
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  return (
    <html suppressHydrationWarning>
      <head>
        <title>CognivexAI</title>
        <meta name="description" content="A discovery engine for everyone." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-white dark:bg-background">
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
            </div>
            <SplashScreen isVisible={loading} onFinished={() => setLoading(false)} />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
