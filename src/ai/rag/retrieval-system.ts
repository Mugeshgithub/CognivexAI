import { cognivexKnowledge, CognivexKnowledge } from '../knowledge/cognivex-knowledge';

export interface SearchResult {
  content: string;
  source: string;
  relevance: number;
  category: string;
}

export interface RAGResponse {
  answer: string;
  sources: SearchResult[];
  confidence: number;
  suggestedActions: string[];
}

export class CognivexRAGSystem {
  private knowledge: CognivexKnowledge;

  constructor() {
    this.knowledge = cognivexKnowledge;
  }

  /**
   * Search through the knowledge base to find relevant information
   */
  search(query: string): SearchResult[] {
    const normalizedQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search through company information
    this.searchCompanyInfo(normalizedQuery, results);
    
    // Search through services
    this.searchServices(normalizedQuery, results);
    
    // Search through projects
    this.searchProjects(normalizedQuery, results);
    
    // Search through technology
    this.searchTechnology(normalizedQuery, results);
    
    // Search through pricing
    this.searchPricing(normalizedQuery, results);
    
    // Search through team
    this.searchTeam(normalizedQuery, results);
    
    // Search through FAQs
    this.searchFAQs(normalizedQuery, results);

    // Sort by relevance and return top results
    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);
  }

  private searchCompanyInfo(query: string, results: SearchResult[]) {
    const company = this.knowledge.company;
    
    // Check company name and tagline
    if (query.includes('cognivex') || query.includes('company') || query.includes('about')) {
      results.push({
        content: `${company.name} - ${company.tagline}. ${company.description}`,
        source: 'Company Overview',
        relevance: 0.9,
        category: 'Company'
      });
    }

    // Check mission and vision
    if (query.includes('mission') || query.includes('vision') || query.includes('goal')) {
      results.push({
        content: `Mission: ${company.mission}. Vision: ${company.vision}`,
        source: 'Company Mission',
        relevance: 0.8,
        category: 'Company'
      });
    }

    // Check expertise
    if (query.includes('expertise') || query.includes('specialize') || query.includes('focus')) {
      results.push({
        content: `Our expertise includes: ${company.expertise.join(', ')}`,
        source: 'Company Expertise',
        relevance: 0.8,
        category: 'Company'
      });
    }

    // Check achievements
    if (query.includes('achievement') || query.includes('success') || query.includes('track record')) {
      results.push({
        content: `Key achievements: ${company.achievements.join('. ')}`,
        source: 'Company Achievements',
        relevance: 0.7,
        category: 'Company'
      });
    }
  }

  private searchServices(query: string, results: SearchResult[]) {
    // Check for general service inquiries first
    if (query.includes('service') || query.includes('offer') || query.includes('provide') || 
        query.includes('what') || query.includes('tell me about') || query.includes('help with')) {
      
      // Add all services with high relevance for general inquiries
      this.knowledge.services.forEach(service => {
        results.push({
          content: `• ${service.name}: ${service.description.split('.')[0]}.`,
          source: `Service: ${service.name}`,
          relevance: 0.9,
          category: 'Services'
        });
      });
      return; // Return early since we've added all services
    }

    // Specific service search for targeted queries
    this.knowledge.services.forEach(service => {
      let relevance = 0;
      
      // Check service name
      if (query.includes(service.name.toLowerCase()) || 
          query.includes(service.category.toLowerCase())) {
        relevance += 0.8;
      }
      
      // Check features and benefits
      if (service.features.some(f => query.includes(f.toLowerCase())) ||
          service.benefits.some(b => query.includes(b.toLowerCase()))) {
        relevance += 0.6;
      }
      
      // Check industries
      if (service.industries.some(i => query.includes(i.toLowerCase()))) {
        relevance += 0.5;
      }
      
      // Check use cases
      if (service.useCases.some(u => query.includes(u.toLowerCase()))) {
        relevance += 0.4;
      }

      if (relevance > 0) {
        results.push({
          content: `• ${service.name}: ${service.description.split('.')[0]}.`,
          source: `Service: ${service.name}`,
          relevance,
          category: 'Services'
        });
      }
    });
  }

  private searchProjects(query: string, results: SearchResult[]) {
    this.knowledge.projects.forEach(project => {
      let relevance = 0;
      
      // Check project name and industry
      if (query.includes(project.name.toLowerCase()) ||
          query.includes(project.industry.toLowerCase())) {
        relevance += 0.8;
      }
      
      // Check technologies
      if (project.technologies.some(t => query.includes(t.toLowerCase()))) {
        relevance += 0.6;
      }
      
      // Check results and metrics
      if (project.results.some(r => query.includes(r.toLowerCase()))) {
        relevance += 0.5;
      }

      if (relevance > 0) {
        results.push({
          content: `${project.name} (${project.industry}): ${project.description}. Results: ${project.results.slice(0, 2).join('. ')}`,
          source: `Project: ${project.name}`,
          relevance,
          category: 'Projects'
        });
      }
    });
  }

  private searchTechnology(query: string, results: SearchResult[]) {
    const tech = this.knowledge.technology;
    
    // Check specific technologies
    const allTech = [
      ...tech.frontend,
      ...tech.backend,
      ...tech.ai,
      ...tech.cloud,
      ...tech.database,
      ...tech.devops
    ];
    
    allTech.forEach(technology => {
      if (query.includes(technology.toLowerCase())) {
        results.push({
          content: `We use ${technology} in our technology stack for building robust, scalable solutions.`,
          source: 'Technology Stack',
          relevance: 0.7,
          category: 'Technology'
        });
      }
    });

    // Check technology categories
    if (query.includes('frontend') || query.includes('ui') || query.includes('react')) {
      results.push({
        content: `Frontend technologies: ${tech.frontend.join(', ')}`,
        source: 'Frontend Tech',
        relevance: 0.8,
        category: 'Technology'
      });
    }

    if (query.includes('backend') || query.includes('api') || query.includes('server')) {
      results.push({
        content: `Backend technologies: ${tech.backend.join(', ')}`,
        source: 'Backend Tech',
        relevance: 0.8,
        category: 'Technology'
      });
    }

    if (query.includes('ai') || query.includes('machine learning') || query.includes('tensorflow')) {
      results.push({
        content: `AI technologies: ${tech.ai.join(', ')}`,
        source: 'AI Tech',
        relevance: 0.9,
        category: 'Technology'
      });
    }
  }

  private searchPricing(query: string, results: SearchResult[]) {
    if (query.includes('price') || query.includes('cost') || query.includes('pricing') || query.includes('how much')) {
      this.knowledge.pricing.tiers.forEach(tier => {
        results.push({
          content: `${tier.name}: ${tier.price} - ${tier.description}. Best for: ${tier.bestFor.join(', ')}`,
          source: `Pricing: ${tier.name}`,
          relevance: 0.9,
          category: 'Pricing'
        });
      });
    }
  }

  private searchTeam(query: string, results: SearchResult[]) {
    if (query.includes('team') || query.includes('expert') || query.includes('experience') || query.includes('certification')) {
      const team = this.knowledge.team;
      results.push({
        content: `Our team consists of ${team.size} with expertise in ${team.expertise.join(', ')}. Average experience: ${team.experience}.`,
        source: 'Team Information',
        relevance: 0.8,
        category: 'Team'
      });
    }
  }

  private searchFAQs(query: string, results: SearchResult[]) {
    this.knowledge.faqs.forEach(faq => {
      if (query.includes(faq.question.toLowerCase()) || 
          faq.answer.toLowerCase().includes(query)) {
        results.push({
          content: `Q: ${faq.question} A: ${faq.answer}`,
          source: `FAQ: ${faq.category}`,
          relevance: 0.7,
          category: 'FAQ'
        });
      }
    });
  }

  /**
   * Generate a comprehensive response based on search results
   */
  generateResponse(query: string, searchResults: SearchResult[]): RAGResponse {
    if (searchResults.length === 0) {
      return {
        answer: "I don't have specific information about that, but I'd be happy to help you learn about CognivexAI's services, projects, or technology. What would you like to know?",
        sources: [],
        confidence: 0.3,
        suggestedActions: ['Learn about our services', 'See our projects', 'Explore our technology', 'Schedule a consultation']
      };
    }

    // Combine information from multiple sources
    const mainContent = searchResults[0];
    let answer = mainContent.content;
    
    // Add additional context from other results if relevant
    if (searchResults.length > 1) {
      const additionalInfo = searchResults.slice(1, 3)
        .map(r => r.content)
        .join(' ');
      answer += `\n\n${additionalInfo}`;
    }

    // Generate suggested actions based on the query and results
    const suggestedActions = this.generateSuggestedActions(query, searchResults);

    return {
      answer,
      sources: searchResults,
      confidence: Math.min(0.9, searchResults[0].relevance + 0.1),
      suggestedActions
    };
  }

  private generateSuggestedActions(query: string, results: SearchResult[]): string[] {
    const actions: string[] = [];
    const queryLower = query.toLowerCase();

    // Add actions based on query content
    if (queryLower.includes('service') || queryLower.includes('offer')) {
      actions.push('Learn more about our services', 'Get a custom quote', 'Schedule a consultation');
    }

    if (queryLower.includes('project') || queryLower.includes('work') || queryLower.includes('portfolio')) {
      actions.push('See our case studies', 'View our portfolio', 'Learn about our approach');
    }

    if (queryLower.includes('price') || queryLower.includes('cost')) {
      actions.push('Get a detailed quote', 'Schedule a consultation', 'Download pricing guide');
    }

    if (queryLower.includes('technology') || queryLower.includes('tech') || queryLower.includes('stack')) {
      actions.push('Technical consultation', 'Architecture review', 'Integration planning');
    }

    // Add general actions
    actions.push('Schedule a consultation', 'Learn about our company', 'See our expertise');

    return actions.slice(0, 4); // Return top 4 actions
  }

  /**
   * Get comprehensive information about a specific topic
   */
  getTopicInfo(topic: string): string {
    const topicLower = topic.toLowerCase();
    
    // Company information
    if (topicLower.includes('company') || topicLower.includes('about')) {
      const company = this.knowledge.company;
      return `${company.name} is ${company.description}. Our mission is to ${company.mission}. We specialize in ${company.expertise.join(', ')}.`;
    }

    // Services overview
    if (topicLower.includes('service') || topicLower.includes('offer')) {
      const services = this.knowledge.services;
      return `We offer ${services.length} core services: ${services.map(s => s.name).join(', ')}. Each service is designed to solve specific business challenges and deliver measurable ROI.`;
    }

    // Technology overview
    if (topicLower.includes('technology') || topicLower.includes('tech')) {
      const tech = this.knowledge.technology;
      return `We use cutting-edge technology including ${tech.frontend.join(', ')} for frontend, ${tech.backend.join(', ')} for backend, and ${tech.ai.join(', ')} for AI solutions.`;
    }

    // Pricing overview
    if (topicLower.includes('price') || topicLower.includes('cost')) {
      const pricing = this.knowledge.pricing;
      return `Our pricing ranges from ${pricing.tiers[0].price} for starter solutions to ${pricing.tiers[2].price} for enterprise solutions. We offer flexible payment plans and can work within your budget.`;
    }

    return "I'd be happy to provide detailed information about that topic. What specific aspect would you like to learn more about?";
  }
}
