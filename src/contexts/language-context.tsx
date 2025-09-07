'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr' | 'de';

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
    'products.about.title': 'About',
    'products.about.description': 'CognivexAI is a fast-growing AI innovation studio that blends creativity with intelligence.\n\nWe help creative professionals and businesses thrive through modern websites, intelligent automation, and data-driven insights.',
    'products.about.vision': 'But our vision goes further. Beyond services, we\'re building breakthrough AI products — from automated data analysis to community-driven chatbots and screen-aware assistants — designed to transform how humans work and create.',
    'products.solutions.title': 'AI Solutions',
    'products.services.title': 'OUR SERVICES',
    'products.process.step1.title': 'UNDERSTAND',
    'products.process.step1.description': 'We analyze your business needs',
    'products.process.step2.title': 'DESIGN',
    'products.process.step2.description': 'Create beautiful, converting websites',
    'products.process.step3.title': 'DEVELOP',
    'products.process.step3.description': 'Build intelligent, responsive solutions',
    'products.process.step4.title': 'AUTOMATE',
    'products.process.step4.description': 'Set up AI workflows for efficiency',
    'products.process.step5.title': 'ANALYZE',
    'products.process.step5.description': 'Provide data insights for growth',
    'products.process.step6.title': 'OPTIMIZE',
    'products.process.step6.description': 'Continuously improve based on results',
    'products.services.smart-agents.title': 'Web Development & Design',
    'products.services.smart-agents.description': 'Professional websites and portfolios for creative professionals',
    'products.services.data-analysis.title': 'AI Automation Services',
    'products.services.data-analysis.description': 'Intelligent workflows that save you 10+ hours per week',
    'products.services.automation.title': 'Data Analysis & Insights',
    'products.services.automation.description': 'Transform your business data into actionable growth strategies',
    'products.services.web-dev.title': 'AI Integration Services',
    'products.services.web-dev.description': 'Smart chatbots and AI assistants for your business',
    'products.services.marketing.title': 'Business Process Optimization',
    'products.services.marketing.description': 'Streamline operations and boost efficiency with AI',
    'products.services.custom.title': 'Custom Development',
    'products.services.custom.description': 'Tailored solutions built specifically for your business needs',
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
    'journey.section1.text': "In 2025, CognivexAI steps beyond boundaries — moving fluidly between data, design, and intelligent automation. Our mission: to create AI that enhances every aspect of human endeavor.",
    'journey.section2.header': 'BREAKING NEW GROUND',
    'journey.section2.text': 'Data Sanity → Our first leap into end-to-end data automation, turning hours of analysis into minutes. Community Chatbot → A new way for service providers and seekers to connect, powered by AI. Vision AI Assistant → Real-time screen analysis that sees what you see, eliminating screenshots and context switching.',
    'journey.section3.header': 'THE POLYMATH APPROACH',
    'journey.section3.text': 'Unlike single-focus companies, CognivexAI thrives across multiple domains — combining data analysis, web development, product design, and intelligent automation into holistic solutions.',
    'journey.section4.header': 'BUILDING THE FUTURE',
    'journey.section4.text': 'This is just the beginning. As we evolve, CognivexAI continues to expand its polymath ecosystem — where versatility meets innovation, and AI becomes a true partner in human creativity and problem-solving.',
    
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
    'contact.success.title': 'Message Sent Successfully! 🚀',
    'contact.success.description': 'Thank you for reaching out! We\'ll get back to you within 24 hours.',
    'contact.error.title': 'Error',
    'contact.error.description': 'Something went wrong. Please try again later.',
    'contact.view-work': 'View Work',
    
    // Testimonials
    'testimonials.project.advanced-portfolio': 'Advanced Portfolio with Admin Control',
    'testimonials.project.full-stack-ai': 'Full Stack AI Platform - Story Creation Tool',
    'testimonials.project.shop-prints': 'Shop Prints Website',
    'testimonials.project.creative-portfolio': 'Creative Portfolio Website',
    'testimonials.role.producer': 'Producer/Composer/Pianist',
    'testimonials.role.software-tester': 'Software Tester/Storyteller',
    'testimonials.role.fine-art-photographer': 'Fine Art Photographer',
    'testimonials.role.photographer-director': 'Photographer/Director',
    'testimonials.role.photographer': 'Photographer',
    'testimonials.role.documentary-photographer': 'Documentary & Motorsport Photographer',
    'testimonials.role.data-analysis': 'Data Analysis',
    
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
    'products.about.title': 'À propos',
    'products.about.description': 'CognivexAI est un studio d\'innovation IA en pleine croissance qui mélange créativité et intelligence.\n\nNous aidons les professionnels créatifs et les entreprises à prospérer grâce à des sites web modernes, une automatisation intelligente et des insights basés sur les données.',
    'products.about.vision': 'Mais notre vision va plus loin. Au-delà des services, nous construisons des produits IA révolutionnaires — de l\'analyse de données automatisée aux chatbots communautaires et assistants conscients de l\'écran — conçus pour transformer la façon dont les humains travaillent et créent.',
    'products.solutions.title': 'Solutions IA',
    'products.services.title': 'NOS SERVICES',
    'products.process.step1.title': 'COMPRENDRE',
    'products.process.step1.description': 'Nous analysons vos besoins business',
    'products.process.step2.title': 'CONCEVOIR',
    'products.process.step2.description': 'Créer des sites web beaux et convertisseurs',
    'products.process.step3.title': 'DÉVELOPPER',
    'products.process.step3.description': 'Construire des solutions intelligentes et responsives',
    'products.process.step4.title': 'AUTOMATISER',
    'products.process.step4.description': 'Mettre en place des workflows IA pour l\'efficacité',
    'products.process.step5.title': 'ANALYSER',
    'products.process.step5.description': 'Fournir des insights données pour la croissance',
    'products.process.step6.title': 'OPTIMISER',
    'products.process.step6.description': 'Améliorer continuellement basé sur les résultats',
    'products.services.smart-agents.title': 'Développement & Design Web',
    'products.services.smart-agents.description': 'Sites web et portfolios professionnels pour créatifs',
    'products.services.data-analysis.title': 'Services d\'Automatisation IA',
    'products.services.data-analysis.description': 'Workflows intelligents qui vous font gagner 10+ heures par semaine',
    'products.services.automation.title': 'Analyse de Données & Insights',
    'products.services.automation.description': 'Transformez vos données business en stratégies de croissance actionables',
    'products.services.web-dev.title': 'Services d\'Intégration IA',
    'products.services.web-dev.description': 'Chatbots intelligents et assistants IA pour votre business',
    'products.services.marketing.title': 'Optimisation des Processus Business',
    'products.services.marketing.description': 'Rationalisez les opérations et boostez l\'efficacité avec l\'IA',
    'products.services.custom.title': 'Développement Personnalisé',
    'products.services.custom.description': 'Solutions sur mesure construites spécifiquement pour vos besoins business',
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
    'journey.section1.text': 'En 2025, CognivexAI dépasse les frontières — naviguant fluidement entre données, design et automatisation intelligente. Notre mission : créer une IA qui améliore chaque aspect de l\'effort humain.',
    'journey.section2.header': 'OUVRIR DE NOUVEAUX HORIZONS',
    'journey.section2.text': 'Data Sanity → Notre premier saut dans l\'automatisation de données de bout en bout, transformant des heures d\'analyse en minutes. Community Chatbot → Une nouvelle façon pour les prestataires et demandeurs de services de se connecter, alimentée par l\'IA. Vision AI Assistant → Analyse d\'écran en temps réel qui voit ce que vous voyez, éliminant les captures d\'écran et le changement de contexte.',
    'journey.section3.header': 'L\'APPROCHE POLYMATH',
    'journey.section3.text': 'Contrairement aux entreprises à focus unique, CognivexAI prospère dans plusieurs domaines — combinant analyse de données, développement web, conception de produits et automatisation intelligente en solutions holistiques.',
    'journey.section4.header': 'CONSTRUIRE L\'AVENIR',
    'journey.section4.text': 'Ce n\'est que le début. Alors que nous évoluons, CognivexAI continue d\'étendre son écosystème polymath — où la polyvalence rencontre l\'innovation, et l\'IA devient un véritable partenaire dans la créativité et la résolution de problèmes humains.',
    
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
    'contact.success.title': 'Message Envoyé avec Succès ! 🚀',
    'contact.success.description': 'Merci de nous avoir contactés ! Nous vous répondrons dans les 24 heures.',
    'contact.error.title': 'Erreur',
    'contact.error.description': 'Quelque chose s\'est mal passé. Veuillez réessayer plus tard.',
    'contact.view-work': 'Voir le Travail',
    
    // Testimonials
    'testimonials.project.advanced-portfolio': 'Portfolio Avancé avec Contrôle Admin',
    'testimonials.project.full-stack-ai': 'Plateforme IA Full Stack - Outil de Création d\'Histoires',
    'testimonials.project.shop-prints': 'Site Web de Vente d\'Impressions',
    'testimonials.project.creative-portfolio': 'Site Web de Portfolio Créatif',
    'testimonials.role.producer': 'Producteur/Compositeur/Pianiste',
    'testimonials.role.software-tester': 'Testeur Logiciel/Conteur',
    'testimonials.role.fine-art-photographer': 'Photographe d\'Art',
    'testimonials.role.photographer-director': 'Photographe/Réalisateur',
    'testimonials.role.photographer': 'Photographe',
    'testimonials.role.documentary-photographer': 'Photographe Documentaire & Sport Auto',
    'testimonials.role.data-analysis': 'Analyse de Données',
    
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
    'language.de': 'DE',
    'language.toggle': 'Changer de Langue',
  },
  de: {
    // Header
    'header.manifesto': 'Manifest',
    'header.careers': 'Karrieren',
    'header.discover': 'Entdecken',
    'header.music.pause': 'Musik Pausieren',
    'header.music.play': 'Musik Abspielen',
    'header.music.next': 'Nächster Track',
    'header.music.controls': 'Musiksteuerung:',
    
    // Common
    'common.loading': 'Laden...',
    'common.sending': 'Senden...',
    'common.submit': 'Absenden',
    'common.cancel': 'Abbrechen',
    'common.close': 'Schließen',
    'common.save': 'Speichern',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    
    // Chatbot
    'chatbot.greeting': 'Zephyr hier!',
    'chatbot.assistant': 'Ihr CognivexAI Assistent',
    'chatbot.placeholder': 'Fragen Sie mich alles...',
    'chatbot.send': 'Senden',
    'chatbot.clear': 'Chat Löschen',
    'chatbot.thinking': 'Denken...',
    'chatbot.error': 'Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.',
    
    // Hero Section
    'hero.tagline.empowering': 'Geister stärken,',
    'hero.tagline.engineering': 'Magie entwickeln.',
    'hero.scroll': 'Scrollen zum Erkunden',
    
    // Products Section
    'products.about.title': 'Über uns',
    'products.about.description': 'CognivexAI ist ein schnell wachsendes KI-Innovationsstudio, das Kreativität mit Intelligenz verbindet.\n\nWir helfen kreativen Fachleuten und Unternehmen, durch moderne Websites, intelligente Automatisierung und datengesteuerte Erkenntnisse zu gedeihen.',
    'products.about.vision': 'Aber unsere Vision geht weiter. Über Services hinaus entwickeln wir bahnbrechende KI-Produkte — von automatisierter Datenanalyse bis hin zu community-gesteuerten Chatbots und bildschirmbewussten Assistenten — entwickelt, um zu transformieren, wie Menschen arbeiten und schaffen.',
    'products.solutions.title': 'KI-Lösungen',
    'products.services.title': 'UNSERE DIENSTLEISTUNGEN',
    'products.process.step1.title': 'VERSTEHEN',
    'products.process.step1.description': 'Wir analysieren Ihre Geschäftsbedürfnisse',
    'products.process.step2.title': 'DESIGNEN',
    'products.process.step2.description': 'Schöne, konvertierende Websites erstellen',
    'products.process.step3.title': 'ENTWICKELN',
    'products.process.step3.description': 'Intelligente, responsive Lösungen bauen',
    'products.process.step4.title': 'AUTOMATISIEREN',
    'products.process.step4.description': 'KI-Workflows für Effizienz einrichten',
    'products.process.step5.title': 'ANALYSIEREN',
    'products.process.step5.description': 'Datenerkenntnisse für Wachstum bereitstellen',
    'products.process.step6.title': 'OPTIMIEREN',
    'products.process.step6.description': 'Kontinuierlich basierend auf Ergebnissen verbessern',
    'products.services.smart-agents.title': 'Webentwicklung & Design',
    'products.services.smart-agents.description': 'Professionelle Websites und Portfolios für kreative Fachleute',
    'products.services.data-analysis.title': 'KI-Automatisierungsdienste',
    'products.services.data-analysis.description': 'Intelligente Workflows, die Ihnen 10+ Stunden pro Woche sparen',
    'products.services.automation.title': 'Datenanalyse & Erkenntnisse',
    'products.services.automation.description': 'Transformieren Sie Ihre Geschäftsdaten in umsetzbare Wachstumsstrategien',
    'products.services.web-dev.title': 'KI-Integrationsdienste',
    'products.services.web-dev.description': 'Intelligente Chatbots und KI-Assistenten für Ihr Unternehmen',
    'products.services.marketing.title': 'Geschäftsprozessoptimierung',
    'products.services.marketing.description': 'Rationalisieren Sie Operationen und steigern Sie Effizienz mit KI',
    'products.services.custom.title': 'Maßgeschneiderte Entwicklung',
    'products.services.custom.description': 'Maßgeschneiderte Lösungen, die speziell für Ihre Geschäftsbedürfnisse entwickelt wurden',
    'products.chart.title': 'KI-gestützte Web-Apps',
    'products.chart.subtitle': 'Intelligente Automatisierung & Analytik',
    'products.chart.traditional': 'Traditionell',
    'products.chart.ai-powered': 'KI-gestützt',
    'products.chart.manual-process': 'Manueller Prozess',
    'products.chart.smart-automation': 'Intelligente Automatisierung',
    'products.chart.process-speed': 'Prozessgeschwindigkeit',
    'products.chart.faster-execution': 'Schnellere Ausführung',
    'products.chart.data-insights': 'Datenerkenntnisse',
    'products.chart.live-analytics': 'Live-Analytik',
    
    // Journey Section
    'journey.title': 'Reise',
    'journey.section1.header': 'DER KI-POLYMATH ENTSTEHT',
    'journey.section1.text': 'Im Jahr 2025 geht CognivexAI über Grenzen hinaus — bewegt sich fließend zwischen Daten, Design und intelligenter Automatisierung. Unsere Mission: KI zu schaffen, die jeden Aspekt menschlicher Bemühungen verbessert.',
    'journey.section2.header': 'NEUE WEGE BESCHREITEN',
    'journey.section2.text': 'Data Sanity → Unser erster Sprung in end-to-end Datenautomatisierung, verwandelt Stunden der Analyse in Minuten. Community Chatbot → Ein neuer Weg für Dienstleister und Suchende, sich zu verbinden, angetrieben von KI. Vision AI Assistant → Echtzeit-Bildschirmanalyse, die sieht, was Sie sehen, eliminiert Screenshots und Kontextwechsel.',
    'journey.section3.header': 'DER POLYMATH-ANSATZ',
    'journey.section3.text': 'Anders als einzelfokussierte Unternehmen gedeiht CognivexAI in mehreren Bereichen — kombiniert Datenanalyse, Webentwicklung, Produktdesign und intelligente Automatisierung zu ganzheitlichen Lösungen.',
    'journey.section4.header': 'DIE ZUKUNFT BAUEN',
    'journey.section4.text': 'Dies ist nur der Anfang. Während wir uns entwickeln, erweitert CognivexAI weiterhin sein Polymath-Ökosystem — wo Vielseitigkeit auf Innovation trifft und KI zu einem echten Partner in menschlicher Kreativität und Problemlösung wird.',
    
    // About Section
    'about.section1.header': 'DER KI-POLYMATH ENTSTEHT',
    'about.section1.text': 'Das Jahr ist 2025. Wir stehen an der Schnittstelle mehrerer KI-Bereiche. Von Datenanalyse bis vision-basierter KI, von kreativen Plattformen bis Community-Lösungen - wir bauen die Zukunft, wo KI jedem Aspekt menschlicher Bemühungen dient.',
    'about.section2.header': 'VISION-KI-REVOLUTION',
    'about.section2.text': 'Unser Durchbruch kam mit dem Vision AI Assistant - dem ersten Echtzeit-Bildschirmanalyse-Tool, das sieht, was Sie sehen. Keine Screenshots mehr, kein Kontextwechsel. Nur reine KI-Unterstützung.',
    'about.section3.header': 'DER POLYMATH-ANSATZ',
    'about.section3.text': 'Anders als einzelfokussierte KI-Unternehmen übertreffen wir in mehreren Bereichen. Datenanalyse, Webdesign, Produktentwicklung und KI-Innovation - alle arbeiten zusammen, um umfassende Lösungen zu schaffen.',
    'about.section4.header': 'DIE ZUKUNFT BAUEN',
    'about.section4.text': 'Heute repräsentiert CognivexAI die Zukunft der KI-Entwicklung. Wo Vielseitigkeit auf Innovation trifft, wo mehrere Bereiche zusammenkommen, um komplexe Probleme zu lösen.',
    
    // Contact Section
    'contact.header': 'Ihr nächster Durchbruch wartet. Lassen Sie uns gemeinsam etwas Außergewöhnliches schaffen.',
    'contact.title': 'Lassen Sie uns verbinden',
    'contact.subtitle': 'Wir würden gerne von Ihnen hören',
    'contact.form.name': 'Name',
    'contact.form.email': 'E-Mail',
    'contact.form.message': 'Nachricht (Optional)',
    'contact.form.submit': 'Nachricht Senden',
    'contact.form.sending': 'Nachricht wird gesendet...',
    'contact.form.response-time': 'Wir antworten normalerweise innerhalb von 24 Stunden an Geschäftstagen.',
    'contact.success.title': 'Nachricht erfolgreich gesendet! 🚀',
    'contact.success.description': 'Vielen Dank für Ihre Nachricht! Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.',
    'contact.error.title': 'Fehler',
    'contact.error.description': 'Etwas ist schief gelaufen. Bitte versuchen Sie es später erneut.',
    'contact.view-work': 'Arbeit ansehen',
    
    // Testimonials
    'testimonials.project.advanced-portfolio': 'Erweitertes Portfolio mit Admin-Kontrolle',
    'testimonials.project.full-stack-ai': 'Full Stack KI-Plattform - Story-Erstellungstool',
    'testimonials.project.shop-prints': 'Shop Prints Website',
    'testimonials.project.creative-portfolio': 'Kreative Portfolio-Website',
    'testimonials.role.producer': 'Produzent/Komponist/Pianist',
    'testimonials.role.software-tester': 'Software-Tester/Geschichtenerzähler',
    'testimonials.role.fine-art-photographer': 'Bildender Kunstfotograf',
    'testimonials.role.photographer-director': 'Fotograf/Regisseur',
    'testimonials.role.photographer': 'Fotograf',
    'testimonials.role.documentary-photographer': 'Dokumentar- & Motorsportfotograf',
    'testimonials.role.data-analysis': 'Datenanalyse',
    
    // Footer
    'footer.tagline.ai': 'KI-Lösungen',
    'footer.tagline.empowering': 'Geister stärken,',
    'footer.tagline.engineering': 'Magie entwickeln.',
    'footer.sections.useful': 'NÜTZLICH',
    'footer.sections.journey': 'Reise',
    'footer.sections.legal': 'RECHTLICH',
    'footer.sections.updates': 'UPDATES',
    'footer.copyright': '© 2024 CognivexAI. Alle Rechte vorbehalten.',
    'footer.privacy': 'Datenschutzrichtlinie',
    'footer.terms': 'Nutzungsbedingungen',
    
    // Language toggle
    'language.en': 'EN',
    'language.fr': 'FR',
    'language.de': 'DE',
    'language.toggle': 'Sprache Wechseln',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      // Load saved language preference from localStorage, default to English
      const savedLang = localStorage.getItem('cognivex-language') as Language;
      if (savedLang && (savedLang === 'en' || savedLang === 'fr' || savedLang === 'de')) {
        setCurrentLanguage(savedLang);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = savedLang;
        }
      } else {
        // Set English as default if no saved preference
        setCurrentLanguage('en');
        localStorage.setItem('cognivex-language', 'en');
        if (typeof document !== 'undefined') {
          document.documentElement.lang = 'en';
        }
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const setLanguage = (newLanguage: Language) => {
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