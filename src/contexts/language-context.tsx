'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  en: {
    // Header
    'header.manifesto': 'Manifesto',
    'header.careers': 'Careers',
    'header.discover': 'Discover',
    'header.music.pause': 'Pause Music',
    'header.music.play': 'Play Music',
    'header.music.next': 'Next Track',
    'header.music.controls': 'Music Controls:',
    
    // Common
    'common.loading': 'Loading...',
    'common.sending': 'Sending...',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    
    // Chatbot
    'chatbot.greeting': 'Zephyr here!',
    'chatbot.assistant': 'Your CognivexAI Assistant',
    'chatbot.placeholder': 'Ask me anything...',
    'chatbot.send': 'Send',
    'chatbot.clear': 'Clear Chat',
    'chatbot.thinking': 'Thinking...',
    'chatbot.error': 'Something went wrong. Please try again.',
    
    // Hero Section
    'hero.tagline.empowering': 'Empowering minds,',
    'hero.tagline.engineering': 'engineering magic.',
    'hero.scroll': 'Scroll to explore',
    
    // Products Section
    'products.about.title': 'About Cognivex',
    'products.about.description': 'We are an emerging AI innovation studio, passionately exploring the frontiers of technology. Our journey spans across multiple domains - from intelligent chatbots and AI automation to full-stack web development and data analysis powered by artificial intelligence.',
    'products.solutions.title': 'AI Solutions',
    'products.services.smart-agents.title': 'Smart Agents & AI Concierge',
    'products.services.smart-agents.description': '24/7 AI assistants that replace front desk and customer service',
    'products.services.data-analysis.title': 'AI Data Analysis & Insights',
    'products.services.data-analysis.description': 'Customer behavior analysis and predictive business insights',
    'products.services.automation.title': 'AI Process Automation',
    'products.services.automation.description': 'Workflow automation with n8n and intelligent integrations',
    'products.services.web-dev.title': 'Web Design & Development',
    'products.services.web-dev.description': 'Modern, responsive websites and full-stack applications',
    'products.services.marketing.title': 'AI-Powered Marketing Automation',
    'products.services.marketing.description': 'Email campaigns, social media, and lead nurturing automation',
    'products.services.custom.title': 'Custom AI Solutions',
    'products.services.custom.description': 'Tailored AI and automation for your specific business needs',
    'products.chart.title': 'AI-Powered Web Apps',
    'products.chart.subtitle': 'Intelligent Automation & Analytics',
    'products.chart.traditional': 'Traditional',
    'products.chart.ai-powered': 'AI-Powered',
    'products.chart.manual-process': 'Manual Process',
    'products.chart.smart-automation': 'Smart Automation',
    'products.chart.process-speed': 'Process Speed',
    'products.chart.faster-execution': 'Faster Execution',
    'products.chart.data-insights': 'Data Insights',
    'products.chart.live-analytics': 'Live Analytics',
    
    // Journey Section
    'journey.title': 'Journey',
    'journey.section1.header': 'THE AI POLYMATH EMERGES',
    'journey.section1.text': "The year is 2025. We stand at the intersection of multiple AI domains. From data analysis to vision-based AI, from creative platforms to community solutions - we're building the future where AI serves every aspect of human endeavor.",
    'journey.section2.header': 'VISION AI REVOLUTION',
    'journey.section2.text': 'Our breakthrough came with the Vision AI Assistant - the first real-time screen analysis tool that sees what you see. No more screenshots, no more context switching. Just pure AI assistance.',
    'journey.section3.header': 'THE POLYMATH APPROACH',
    'journey.section3.text': 'Unlike single-focus AI companies, we excel across multiple domains. Data analysis, web design, product development, and AI innovation - all working together to create comprehensive solutions.',
    'journey.section4.header': 'BUILDING THE FUTURE',
    'journey.section4.text': 'Today, CognivexAI represents the future of AI development. Where versatility meets innovation, where multiple domains converge to solve complex problems.',
    
    // About Section
    'about.section1.header': 'THE AI POLYMATH EMERGES',
    'about.section1.text': "The year is 2025. We stand at the intersection of multiple AI domains. From data analysis to vision-based AI, from creative platforms to community solutions - we're building the future where AI serves every aspect of human endeavor.",
    'about.section2.header': 'VISION AI REVOLUTION',
    'about.section2.text': 'Our breakthrough came with the Vision AI Assistant - the first real-time screen analysis tool that sees what you see. No more screenshots, no more context switching. Just pure AI assistance.',
    'about.section3.header': 'THE POLYMATH APPROACH',
    'about.section3.text': 'Unlike single-focus AI companies, we excel across multiple domains. Data analysis, web design, product development, and AI innovation - all working together to create comprehensive solutions.',
    'about.section4.header': 'BUILDING THE FUTURE',
    'about.section4.text': 'Today, CognivexAI represents the future of AI development. Where versatility meets innovation, where multiple domains converge to solve complex problems.',
    
    // Contact Section
    'contact.header': 'Your next breakthrough is waiting. Let\'s build something extraordinary together.',
    'contact.title': 'Let\'s Connect',
    'contact.subtitle': 'We\'d love to hear from you',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message (Optional)',
    'contact.form.submit': 'Send Message',
    'contact.form.sending': 'Sending Message...',
    'contact.form.response-time': 'We typically respond within 24 hours during business days.',
    
    // Footer
    'footer.tagline.ai': 'AI solutions',
    'footer.tagline.empowering': 'Empowering minds,',
    'footer.tagline.engineering': 'engineering magic.',
    'footer.sections.useful': 'USEFUL',
    'footer.sections.journey': 'Journey',
    'footer.sections.legal': 'LEGAL',
    'footer.sections.updates': 'UPDATES',
    'footer.copyright': '© 2024 CognivexAI. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    
    // Language toggle
    'language.en': 'EN',
    'language.fr': 'FR',
    'language.toggle': 'Toggle Language',
  },
  fr: {
    // Header
    'header.manifesto': 'Manifeste',
    'header.careers': 'Carrières',
    'header.discover': 'Découvrir',
    'header.music.pause': 'Pause Musique',
    'header.music.play': 'Jouer Musique',
    'header.music.next': 'Piste Suivante',
    'header.music.controls': 'Contrôles Musicaux:',
    
    // Common
    'common.loading': 'Chargement...',
    'common.sending': 'Envoi...',
    'common.submit': 'Soumettre',
    'common.cancel': 'Annuler',
    'common.close': 'Fermer',
    'common.save': 'Sauvegarder',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    
    // Chatbot
    'chatbot.greeting': 'Zephyr ici !',
    'chatbot.assistant': 'Votre Assistant CognivexAI',
    'chatbot.placeholder': 'Posez-moi n\'importe quoi...',
    'chatbot.send': 'Envoyer',
    'chatbot.clear': 'Effacer Chat',
    'chatbot.thinking': 'Réflexion...',
    'chatbot.error': 'Quelque chose s\'est mal passé. Veuillez réessayer.',
    
    // Hero Section
    'hero.tagline.empowering': 'Autonomiser les esprits,',
    'hero.tagline.engineering': 'ingénierie magique.',
    'hero.scroll': 'Défiler pour explorer',
    
    // Products Section
    'products.about.title': 'À propos de Cognivex',
    'products.about.description': 'Nous sommes un studio d\'innovation IA émergent, explorant passionnément les frontières de la technologie. Notre parcours s\'étend sur plusieurs domaines - des chatbots intelligents et l\'automatisation IA au développement web full-stack et l\'analyse de données alimentée par l\'intelligence artificielle.',
    'products.solutions.title': 'Solutions IA',
    'products.services.smart-agents.title': 'Agents Intelligents & Conciergerie IA',
    'products.services.smart-agents.description': 'Assistants IA 24/7 qui remplacent l\'accueil et le service client',
    'products.services.data-analysis.title': 'Analyse de Données IA & Insights',
    'products.services.data-analysis.description': 'Analyse du comportement client et insights prédictifs business',
    'products.services.automation.title': 'Automatisation des Processus IA',
    'products.services.automation.description': 'Automatisation des workflows avec n8n et intégrations intelligentes',
    'products.services.web-dev.title': 'Conception & Développement Web',
    'products.services.web-dev.description': 'Sites web modernes et responsifs et applications full-stack',
    'products.services.marketing.title': 'Automatisation Marketing Alimentée par l\'IA',
    'products.services.marketing.description': 'Campagnes email, réseaux sociaux et automatisation de la qualification des leads',
    'products.services.custom.title': 'Solutions IA Personnalisées',
    'products.services.custom.description': 'IA et automatisation sur mesure pour vos besoins business spécifiques',
    'products.chart.title': 'Applications Web Alimentées par l\'IA',
    'products.chart.subtitle': 'Automatisation & Analytique Intelligentes',
    'products.chart.traditional': 'Traditionnel',
    'products.chart.ai-powered': 'Alimenté par l\'IA',
    'products.chart.manual-process': 'Processus Manuel',
    'products.chart.smart-automation': 'Automatisation Intelligente',
    'products.chart.process-speed': 'Vitesse du Processus',
    'products.chart.faster-execution': 'Exécution Plus Rapide',
    'products.chart.data-insights': 'Insights Données',
    'products.chart.live-analytics': 'Analytique en Temps Réel',
    
    // Journey Section
    'journey.title': 'Parcours',
    'journey.section1.header': 'L\'IA POLYMATH ÉMERGE',
    'journey.section1.text': 'L\'année est 2025. Nous nous trouvons à l\'intersection de multiples domaines IA. De l\'analyse de données à l\'IA basée sur la vision, des plateformes créatives aux solutions communautaires - nous construisons l\'avenir où l\'IA sert chaque aspect de l\'effort humain.',
    'journey.section2.header': 'RÉVOLUTION VISION IA',
    'journey.section2.text': 'Notre percée est venue avec l\'Assistant Vision IA - le premier outil d\'analyse d\'écran en temps réel qui voit ce que vous voyez. Plus de captures d\'écran, plus de changement de contexte. Juste une assistance IA pure.',
    'journey.section3.header': 'L\'APPROCHE POLYMATH',
    'journey.section3.text': 'Contrairement aux entreprises IA à focus unique, nous excellons dans plusieurs domaines. Analyse de données, conception web, développement de produits et innovation IA - tous travaillant ensemble pour créer des solutions complètes.',
    'journey.section4.header': 'CONSTRUIRE L\'AVENIR',
    'journey.section4.text': 'Aujourd\'hui, CognivexAI représente l\'avenir du développement IA. Où la polyvalence rencontre l\'innovation, où plusieurs domaines convergent pour résoudre des problèmes complexes.',
    
    // About Section
    'about.section1.header': 'L\'IA POLYMATH ÉMERGE',
    'about.section1.text': 'L\'année est 2025. Nous nous trouvons à l\'intersection de multiples domaines IA. De l\'analyse de données à l\'IA basée sur la vision, des plateformes créatives aux solutions communautaires - nous construisons l\'avenir où l\'IA sert chaque aspect de l\'effort humain.',
    'about.section2.header': 'RÉVOLUTION VISION IA',
    'about.section2.text': 'Notre percée est venue avec l\'Assistant Vision IA - le premier outil d\'analyse d\'écran en temps réel qui voit ce que vous voyez. Plus de captures d\'écran, plus de changement de contexte. Juste une assistance IA pure.',
    'about.section3.header': 'L\'APPROCHE POLYMATH',
    'about.section3.text': 'Contrairement aux entreprises IA à focus unique, nous excellons dans plusieurs domaines. Analyse de données, conception web, développement de produits et innovation IA - tous travaillant ensemble pour créer des solutions complètes.',
    'about.section4.header': 'CONSTRUIRE L\'AVENIR',
    'about.section4.text': 'Aujourd\'hui, CognivexAI représente l\'avenir du développement IA. Où la polyvalence rencontre l\'innovation, où plusieurs domaines convergent pour résoudre des problèmes complexes.',
    
    // Contact Section
    'contact.header': 'Votre prochaine percée vous attend. Construisons ensemble quelque chose d\'extraordinaire.',
    'contact.title': 'Connectons-nous',
    'contact.subtitle': 'Nous aimerions avoir de vos nouvelles',
    'contact.form.name': 'Nom',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message (Optionnel)',
    'contact.form.submit': 'Envoyer le Message',
    'contact.form.sending': 'Envoi du Message...',
    'contact.form.response-time': 'Nous répondons généralement dans les 24 heures pendant les jours ouvrables.',
    
    // Footer
    'footer.tagline.ai': 'Solutions IA',
    'footer.tagline.empowering': 'Autonomiser les esprits,',
    'footer.tagline.engineering': 'ingénierie magique.',
    'footer.sections.useful': 'UTILE',
    'footer.sections.journey': 'Parcours',
    'footer.sections.legal': 'LÉGAL',
    'footer.sections.updates': 'MISES À JOUR',
    'footer.copyright': '© 2024 CognivexAI. Tous droits réservés.',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions d\'Utilisation',
    
    // Language toggle
    'language.en': 'EN',
    'language.fr': 'FR',
    'language.toggle': 'Changer de Langue',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLang = localStorage.getItem('cognivex-language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
      setCurrentLanguage(savedLang);
    }
  }, []);

  const setLanguage = (newLanguage: 'en' | 'fr') => {
    setCurrentLanguage(newLanguage);
    localStorage.setItem('cognivex-language', newLanguage);
    
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLanguage;
    }
  };

  const t = (key: keyof typeof translations.en): string => {
    const translation = translations[currentLanguage][key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${currentLanguage}`);
      return key;
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{
      language: currentLanguage,
      setLanguage: setLanguage,
      t,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 