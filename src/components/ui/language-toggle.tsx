'use client';

import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        "h-8 px-3 rounded-full transition-all duration-300 ease-in-out",
        "bg-gradient-to-r from-blue-500/20 to-purple-500/20",
        "hover:from-blue-500/30 hover:to-purple-500/30",
        "border border-blue-500/30 hover:border-blue-500/50",
        "text-blue-400 hover:text-blue-300",
        "font-mono text-xs font-medium tracking-wider",
        "backdrop-blur-sm shadow-lg",
        "hover:scale-105 active:scale-95"
      )}
      title={t('language.toggle')}
    >
      <Languages className="h-3 w-3 mr-1.5" />
      {language === 'en' ? 'EN' : 'FR'}
    </Button>
  );
}

// Alternative compact version for mobile
export function LanguageToggleCompact() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        "h-8 w-8 p-0 rounded-full transition-all duration-300 ease-in-out",
        "bg-gradient-to-r from-blue-500/20 to-purple-500/20",
        "hover:from-blue-500/30 hover:to-purple-500/30",
        "border border-blue-500/30 hover:border-blue-500/50",
        "text-blue-400 hover:text-blue-300",
        "backdrop-blur-sm shadow-lg",
        "hover:scale-105 active:scale-95"
      )}
      title={t('language.toggle')}
    >
      <Languages className="h-4 w-4" />
    </Button>
  );
} 