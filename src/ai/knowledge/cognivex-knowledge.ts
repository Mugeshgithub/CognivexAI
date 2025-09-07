export interface CognivexKnowledge {
  company: CompanyInfo;
  services: Service[];
  projects: Project[];
  technology: TechnologyStack;
  pricing: PricingInfo;
  team: TeamInfo;
  faqs: FAQ[];
  industries: Industry[];
  certifications: Certification[];
  partnerships: Partnership[];
  testimonials: Testimonial[];
  caseStudies: CaseStudy[];
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  values: string[];
  expertise: string[];
  achievements: string[];
  founded: string;
  headquarters: string;
  size: string;
  website: string;
  email: string;
  phone: string;
  socialMedia: {
    linkedin: string;
    twitter: string;
    github: string;
  };
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  benefits: string[];
  industries: string[];
  useCases: string[];
  technologies: string[];
  pricing: {
    starting: string;
    custom: boolean;
  };
  timeline: string;
  deliverables: string[];
}

export interface Project {
  id: string;
  name: string;
  industry: string;
  description: string;
  technologies: string[];
  results: string[];
  duration: string;
  teamSize: string;
  client: string;
  challenges: string[];
  solutions: string[];
  impact: string[];
}

export interface TechnologyStack {
  frontend: string[];
  backend: string[];
  ai: string[];
  cloud: string[];
  database: string[];
  devops: string[];
  mobile: string[];
  blockchain: string[];
  iot: string[];
}

export interface PricingInfo {
  approach: string;
  description: string;
  contactMessage: string;
  nextSteps: string[];
  benefits: string[];
  customPricing: boolean;
  paymentOptions: string[];
  guarantees: string[];
}

export interface TeamInfo {
  size: string;
  expertise: string[];
  experience: string;
  certifications: string[];
  locations: string[];
  diversity: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export interface Industry {
  name: string;
  description: string;
  services: string[];
  challenges: string[];
  solutions: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  description: string;
  validity: string;
}

export interface Partnership {
  name: string;
  type: string;
  description: string;
  benefits: string[];
}

export interface Testimonial {
  client: string;
  industry: string;
  project: string;
  quote: string;
  rating: number;
  date: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  duration: string;
  teamSize: string;
}

export const cognivexKnowledge: CognivexKnowledge = {
    company: {
      name: "CognivexAI",
      tagline: "Empowering minds, engineering magic",
      description:
        "An AI innovation studio in Paris building modern websites, intelligent automations, and data-driven tools for creatives and small businesses.",
      mission:
        "Bridge the gap between AI technology and creative professionals with practical, beautiful, and reliable solutions.",
      vision:
        "A world where solo creators and small teams use AI like superpowers — from web to workflow to insight.",
      values: [
        "Creativity with Rigor",
        "Client Outcomes First",
        "Transparent Communication",
        "Iterate & Improve",
        "Build for Longevity"
      ],
      expertise: [
        "Next.js websites & UI systems",
        "Workflow automation & AI agents",
        "Data analysis & dashboards",
        "Prototyping new AI products"
      ],
      achievements: [
        "Delivered portfolio & shop sites for photographers and artists",
        "Launched first internal AI tools in 2025 (Vision AI Assistant alpha, Data Sanity private beta)"
      ],
      founded: "2024",
      headquarters: "Paris, France",
      size: "Solo studio with trusted collaborators",
      website: "https://cognivexai.vercel.app",
      email: "Post2mugesh@outlook.com",
      phone: "",
      socialMedia: {
        linkedin: "",
        twitter: "",
        github: ""
      }
    },
  
    services: [
      {
        id: "ai-websites",
        name: "Modern Websites (AI-Ready)",
        category: "Web Development",
        description:
          "Design and build fast, responsive sites in Next.js with clean UI, CMS, and analytics — ready for AI add-ons.",
        features: [
          "Next.js + Tailwind frontends",
          "CMS (Sanity/Notion/Headless options)",
          "Performance & SEO basics",
          "Contact/booking flows",
          "Optional shop/prints"
        ],
        benefits: [
          "Professional presence in weeks",
          "Easy to update content",
          "Faster load, better UX",
          "Foundation for future AI features"
        ],
        industries: ["Creative portfolios", "Studios", "SMBs"],
        useCases: [
          "Photography portfolio + shop prints",
          "Artist/creator landing",
          "Service business site with booking"
        ],
        technologies: ["Next.js", "React", "TypeScript", "Tailwind", "Vercel"],
        pricing: { starting: "€1,200", custom: true },
        timeline: "2–4 weeks",
        deliverables: [
          "Live site on custom domain",
          "Source in Git",
          "Basic CMS + how-to video"
        ]
      },
      {
        id: "automation",
        name: "Workflow Automation & AI Agents",
        category: "Automation",
        description:
          "Automate routine tasks (intake, FAQs, lead triage, report generation) and add 24/7 assistants.",
        features: [
          "Form → CRM/Sheet/Email flows",
          "Knowledge-base chatbots",
          "Lead capture & routing",
          "Auto-reports & summaries"
        ],
        benefits: [
          "Fewer manual tasks",
          "Faster response times",
          "Better data hygiene"
        ],
        industries: ["Studios", "E-commerce", "Professional services"],
        useCases: ["Front-desk replacement", "FAQ bot", "Ops summaries"],
        technologies: ["OpenAI API", "Python", "n8n/Make", "Supabase/Firebase"],
        pricing: { starting: "€800", custom: true },
        timeline: "1–3 weeks",
        deliverables: [
          "Configured automations",
          "Bot + admin notes",
          "Metrics dashboard (basic)"
        ]
      },
      {
        id: "data-insights",
        name: "Data Analysis & Dashboards",
        category: "Analytics",
        description:
          "Turn scattered data into clean dashboards and simple, actionable insights.",
        features: [
          "Light ETL & cleaning",
          "KPI dashboards",
          "Monthly insights brief"
        ],
        benefits: ["Clarity on what matters", "Shareable visuals"],
        industries: ["Shops", "Content creators", "Local services"],
        useCases: ["Sales/booking trends", "Campaign performance"],
        technologies: ["Python", "Pandas", "Metabase/Looker Studio", "SQL"],
        pricing: { starting: "€900", custom: true },
        timeline: "1–3 weeks",
        deliverables: ["Dashboard link", "Data workbook", "Insights doc"]
      }
    ],
  
    projects: [
      {
        id: "aniefiok",
        name: "Aniefiok — Music Portfolio",
        industry: "Creative",
        description:
          "Modern portfolio with media sections and lightweight admin controls.",
        technologies: ["Next.js", "Tailwind", "Vercel"],
        results: ["Faster updates", "Cleaner navigation"],
        duration: "2 weeks",
        teamSize: "Solo",
        client: "Aniefiok",
        challenges: ["Organizing media", "Mobile performance"],
        solutions: ["Media grid + lazy load", "Simple admin notes"],
        impact: ["Higher engagement on mobile"]
      },
      {
        id: "devika-prints",
        name: "Devika Sinha — Shop Prints",
        industry: "E-commerce (art)",
        description: "Photography portfolio with prints storefront.",
        technologies: ["Next.js", "Stripe (or print vendor)", "Vercel"],
        results: ["Launched shop section", "Clear product pages"],
        duration: "3 weeks",
        teamSize: "Solo",
        client: "Devika Sinha",
        challenges: ["Catalog structure"],
        solutions: ["Simple CMS + variants"],
        impact: ["Frictionless checkout flow"]
      }
      // Add Stefff, Dimitra Polic, Ashwith S Pai similarly when you’re ready
    ],
  
    technology: {
      frontend: ["Next.js", "React", "TypeScript", "Tailwind", "Framer Motion"],
      backend: ["Node.js", "Next API routes", "Python (utilities)"],
      ai: ["OpenAI API", "Hugging Face workflows"],
      cloud: ["Vercel", "Firebase", "Supabase"],
      database: ["PostgreSQL (Supabase)", "Firebase"],
      devops: ["GitHub Actions (basic CI)", "Vercel previews"],
      mobile: [],
      blockchain: [],
      iot: []
    },
  
    pricing: {
      approach: "Contact-based pricing",
      description: "We believe in providing personalized pricing based on your specific needs and requirements. Every project is unique, and we want to ensure you get the best value for your investment.",
      contactMessage: "For pricing information, please contact us directly.",
      nextSteps: [
        "Schedule a consultation call",
        "Provide your project details", 
        "Receive a personalized quote",
        "Discuss timeline and deliverables"
      ],
      benefits: [
        "Transparent, no-hidden-fees pricing",
        "Flexible payment options",
        "Custom solutions for your budget",
        "Value-based pricing approach"
      ],
      customPricing: true,
      paymentOptions: ["Milestone billing", "Monthly retainer", "Project-based pricing"],
      guarantees: ["Clear scope & timelines", "No-surprise pricing", "30-day satisfaction guarantee"]
    },
  
    team: {
      size: "Solo + collaborators",
      expertise: ["Full-stack web", "Automation", "AI prototyping", "Data viz"],
      experience: "6+ years across supply chain & web/data projects",
      certifications: [],
      locations: ["Paris / Noisy-le-Grand, remote friendly"],
      diversity: "Independent studio; collaborates globally"
    },
  
    faqs: [
      {
        id: "timeline",
        question: "How fast can we launch?",
        answer:
          "Simple sites: 2–3 weeks. Site + automation: 3–4 weeks. Dashboards: 1–3 weeks. Exact timelines follow a short scoping call.",
        category: "Process",
        tags: ["timeline", "delivery"]
      },
      {
        id: "stack",
        question: "What stack do you use?",
        answer:
          "Next.js + Tailwind on Vercel for the web, OpenAI/HF for AI, and Supabase/Firebase for data. Python/SQL for analysis.",
        category: "Technical",
        tags: ["stack", "tech"]
      },
      {
        id: "pricing",
        question: "How do you price projects?",
        answer:
          "Fixed-fee by scope with clear milestones. Retainers available for ongoing updates and analytics.",
        category: "Pricing",
        tags: ["pricing", "retainer"]
      }
    ],
  
    industries: [
      {
        name: "Creative Services",
        description: "Web, shops, and automation for photographers and artists.",
        services: [
          "Portfolios",
          "Shop prints",
          "Front-desk chatbots",
          "Booking flows"
        ],
        challenges: ["Updating work easily", "Selling prints"],
        solutions: ["CMS setup", "Stripe/print integrations"]
      },
      {
        name: "SMBs",
        description: "Lightweight web + automation to save time.",
        services: ["Sites", "Lead bots", "Dashboards"],
        challenges: ["Manual intake", "Slow response"],
        solutions: ["Intake → CRM", "Auto summaries"]
      }
    ],
  
    certifications: [],
  
    partnerships: [
      {
        name: "Trusted Collaborators",
        type: "Network",
        description:
          "Designers and developers partnered per project to scale delivery when needed.",
        benefits: ["Flexible capacity", "Specialized skills"]
      }
    ],
  
    testimonials: [
      // Replace with real short quotes when clients approve.
      // { client: "Client Name", industry: "Creative", project: "Portfolio Site", quote: "Loved the speed and polish.", rating: 5, date: "2025-08-15" }
    ],
  
    caseStudies: [
      // Create lean case studies for Aniefiok / Devika when you have metrics.
    ]
  };