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

  // ---------------- Helpers ----------------
  private normalize(text: string): string {
    return (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // strip accents
      .replace(/[^a-z0-9\s\-\_\.]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  private tokenize(text: string): string[] {
    return this.normalize(text).split(" ").filter(Boolean);
  }

  private tokenOverlapScore(qTokens: string[], tTokens: string[]): number {
    if (!qTokens.length || !tTokens.length) return 0;
    const qSet = new Set(qTokens);
    let overlap = 0;
    for (const t of tTokens) if (qSet.has(t)) overlap++;
    return overlap / Math.max(qSet.size, tTokens.length);
  }

  private phraseBoost(haystack: string, needle: string): number {
    return haystack.includes(needle) ? 0.3 : 0;
  }

  private fuzzyPartial(haystack: string, needle: string): number {
    const h = haystack.split(" ");
    const n = needle.split(" ");
    if (n.length === 0) return 0;
    let i = 0;
    let hit = 0;
    for (const tok of h) {
      if (i < n.length && tok === n[i]) {
        hit++;
        i++;
      }
    }
    const ratio = hit / n.length;
    return ratio >= 0.5 ? ratio * 0.2 : 0;
  }

  private mmrDiverseTopK(items: SearchResult[], k: number, lambda = 0.75): SearchResult[] {
    const selected: SearchResult[] = [];
    const pool = [...items];
    while (selected.length < k && pool.length) {
      let bestIdx = 0;
      let bestScore = -Infinity;
      for (let i = 0; i < pool.length; i++) {
        const candidate = pool[i];
        const sameCat = selected.filter(s => s.category === candidate.category);
        const penalty = sameCat.length ? 0.1 * sameCat.length : 0;
        const score = lambda * candidate.relevance - (1 - lambda) * penalty;
        if (score > bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }
      selected.push(pool.splice(bestIdx, 1)[0]);
    }
    return selected;
  }

  private clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
  }

  private detectIntent(q: string) {
    const qn = this.normalize(q);
    return {
      wantServices: /\b(service|offer|provide|website|automation|dashboard|bot|chatbot)\b/.test(qn),
      wantProjects: /\b(project|case\s*study|work|portfolio|example)\b/.test(qn),
      wantPricing: /\b(price|cost|pricing|quote|how much)\b/.test(qn),
      wantTech: /\b(tech|stack|frontend|backend|ai|ml|python|next\.?js|react)\b/.test(qn),
      wantCompany: /\b(company|about|mission|vision|who are you)\b/.test(qn),
      wantTeam: /\b(team|expert|experience|certification|where)\b/.test(qn),
      wantFAQ: /\b(faq|how do|can you|support|maintenance|timeline)\b/.test(qn)
    };
  }

  // ---------------- Conversation Context ----------------
  private extractConversationContext(history?: Array<{role: string, content: string}>): any {
    if (!history || history.length === 0) return {};

    const context = {
      topics: new Set<string>(),
      userInterests: new Set<string>(),
      mentionedServices: new Set<string>(),
      userQuestions: [] as string[],
      conversationStage: 'initial',
      lastTopics: [] as string[]
    };

    // Analyze last 10 messages for context
    const recentMessages = history.slice(-10);
    
    for (const message of recentMessages) {
      if (message.role === 'user') {
        const content = message.content.toLowerCase();
        
        // Extract topics
        if (content.includes('data analysis') || content.includes('analytics')) {
          context.topics.add('data analysis');
        }
        if (content.includes('chatbot') || content.includes('ai assistant')) {
          context.topics.add('chatbots');
        }
        if (content.includes('website') || content.includes('web development')) {
          context.topics.add('web development');
        }
        if (content.includes('pricing') || content.includes('cost')) {
          context.topics.add('pricing');
        }
        if (content.includes('team') || content.includes('experience')) {
          context.topics.add('team');
        }
        
        // Extract user interests
        if (content.includes('interested') || content.includes('need')) {
          context.userInterests.add(content);
        }
        
        // Track questions
        if (content.includes('?') || content.includes('what') || content.includes('how')) {
          context.userQuestions.push(message.content);
        }
      }
    }

    // Determine conversation stage
    if (context.topics.size > 2) {
      context.conversationStage = 'engaged';
    } else if (context.topics.size > 0) {
      context.conversationStage = 'exploring';
    }

    return {
      topics: Array.from(context.topics),
      userInterests: Array.from(context.userInterests),
      mentionedServices: Array.from(context.mentionedServices),
      userQuestions: context.userQuestions.slice(-3), // Last 3 questions
      conversationStage: context.conversationStage,
      messageCount: history.length
    };
  }

  private enhanceQueryWithContext(query: string, context: any): string {
    let enhancedQuery = query;
    
    // Add context from previous topics
    if (context.topics && context.topics.length > 0) {
      enhancedQuery += ` related to ${context.topics.join(', ')}`;
    }
    
    // Add conversation stage context
    if (context.conversationStage === 'engaged') {
      enhancedQuery += ' detailed information';
    } else if (context.conversationStage === 'exploring') {
      enhancedQuery += ' overview and benefits';
    }
    
    return enhancedQuery;
  }

  private searchConversationContext(context: any, results: SearchResult[]): void {
    if (!context || Object.keys(context).length === 0) return;

    // Add context-aware results
    if (context.topics && context.topics.length > 0) {
      results.push({
        content: `Based on our conversation about ${context.topics.join(', ')}, here's what I can help you with:`,
        source: "Conversation Context",
        relevance: 0.7,
        category: "Context"
      });
    }

    if (context.conversationStage === 'engaged') {
      results.push({
        content: "I can see you're interested in our services. Let me provide you with detailed information and next steps.",
        source: "Conversation Context",
        relevance: 0.6,
        category: "Context"
      });
    }

    if (context.userQuestions && context.userQuestions.length > 0) {
      results.push({
        content: `I notice you've asked about ${context.userQuestions.length} topics. Let me address your questions comprehensively.`,
        source: "Conversation Context",
        relevance: 0.5,
        category: "Context"
      });
    }
  }

  // ---------------- Search ----------------
  search(query: string, conversationHistory?: Array<{role: string, content: string}>): SearchResult[] {
    const normalizedQuery = this.normalize(query);
    const qTokens = this.tokenize(query);
    const intents = this.detectIntent(query);
    const results: SearchResult[] = [];

    // Enhanced context from conversation history
    const context = this.extractConversationContext(conversationHistory);
    const enhancedQuery = this.enhanceQueryWithContext(query, context);

    this.searchCompanyInfo(enhancedQuery, qTokens, results, intents);
    this.searchServices(enhancedQuery, qTokens, results, intents);
    this.searchProjects(enhancedQuery, qTokens, results, intents);
    this.searchTechnology(enhancedQuery, qTokens, results, intents);
    this.searchPricing(enhancedQuery, qTokens, results, intents);
    this.searchTeam(enhancedQuery, qTokens, results, intents);
    this.searchFAQs(enhancedQuery, qTokens, results, intents);

    // Add conversation context results
    this.searchConversationContext(context, results);

    results.sort((a, b) => b.relevance - a.relevance);
    return this.mmrDiverseTopK(results, 5);
  }

  private searchCompanyInfo(q: string, qTokens: string[], results: SearchResult[], intents: any) {
    const c = this.knowledge.company;
    const normDesc = this.normalize(c.description);

    if (intents.wantCompany) {
      results.push({
        content: `${c.name} — ${c.tagline}. ${c.description}`,
        source: "Company Overview",
        relevance: 0.85,
        category: "Company"
      });
    }

    const overlap = this.tokenOverlapScore(qTokens, this.tokenize(normDesc));
    if (overlap > 0.2) {
      results.push({
        content: c.description,
        source: "Company Description",
        relevance: 0.6 + overlap,
        category: "Company"
      });
    }
  }

  private searchServices(q: string, qTokens: string[], results: SearchResult[], intents: any) {
    this.knowledge.services.forEach((service: any) => {
      const sNorm = this.normalize(service.description);
      const sTokens = this.tokenize(sNorm);
      let score = 0;

      if (intents.wantServices) score += 0.7;
      if (q.includes(service.name.toLowerCase())) score += 0.8;
      score += this.tokenOverlapScore(qTokens, sTokens);
      score += this.phraseBoost(sNorm, q);
      score += this.fuzzyPartial(sNorm, q);

      if (score > 0.3) {
        results.push({
          content: `• ${service.name}: ${service.description.split('.')[0]}.`,
          source: `Service: ${service.name}`,
          relevance: score,
          category: "Services"
        });
      }
    });
  }

  private searchProjects(q: string, qTokens: string[], results: SearchResult[], intents: any) {
    this.knowledge.projects.forEach((project: any) => {
      const pNorm = this.normalize(project.description);
      const pTokens = this.tokenize(pNorm);
      let score = 0;

      if (intents.wantProjects) score += 0.6;
      if (q.includes(project.name.toLowerCase())) score += 0.8;
      if (q.includes(project.industry.toLowerCase())) score += 0.6;
      score += this.tokenOverlapScore(qTokens, pTokens);

      if (score > 0.3) {
        results.push({
          content: `${project.name} (${project.industry}): ${project.description}. Results: ${project.results.slice(0, 2).join('. ')}`,
          source: `Project: ${project.name}`,
          relevance: score,
          category: "Projects"
        });
      }
    });
  }

  private searchTechnology(q: string, qTokens: string[], results: SearchResult[], intents: any) {
    const tech = this.knowledge.technology;
    const allTech = [
      ...tech.frontend,
      ...tech.backend,
      ...tech.ai,
      ...tech.cloud,
      ...tech.database,
      ...tech.devops
    ];

    allTech.forEach((t: any) => {
      if (q.includes(t.toLowerCase())) {
        results.push({
          content: `We use ${t} in our technology stack for building solutions.`,
          source: "Technology Stack",
          relevance: 0.7,
          category: "Technology"
        });
      }
    });

    if (intents.wantTech) {
      results.push({
        content: `Frontend: ${tech.frontend.join(', ')}. Backend: ${tech.backend.join(', ')}. AI: ${tech.ai.join(', ')}.`,
        source: "Tech Overview",
        relevance: 0.8,
        category: "Technology"
      });
    }
  }

  private searchPricing(q: string, qTokens: string[], results: SearchResult[], intents: any) {
    if (intents.wantPricing) {
      const pricing = this.knowledge.pricing;
      results.push({
        content: `${pricing.contactMessage} We provide personalized quotes based on your specific needs.`,
        source: "Pricing Information",
        relevance: 0.9,
        category: "Pricing"
      });
    }
  }

  private searchTeam(q: string, qTokens: string[], results: SearchResult[], intents: any) {
    if (intents.wantTeam) {
      const t = this.knowledge.team;
      results.push({
        content: `Our team: ${t.size}, expertise in ${t.expertise.join(', ')}.`,
        source: "Team Info",
        relevance: 0.7,
        category: "Team"
      });
    }
  }

  private searchFAQs(q: string, qTokens: string[], results: SearchResult[], intents: any) {
    this.knowledge.faqs.forEach((faq: any) => {
      const fNormQ = this.normalize(faq.question);
      const fNormA = this.normalize(faq.answer);
      if (q.includes(fNormQ) || fNormA.includes(q)) {
        results.push({
          content: `Q: ${faq.question} A: ${faq.answer}`,
          source: `FAQ: ${faq.category}`,
          relevance: 0.65,
          category: "FAQ"
        });
      }
    });
  }

  // ---------------- Response Generator ----------------
  generateResponse(query: string, searchResults: SearchResult[], conversationHistory?: Array<{role: string, content: string}>): RAGResponse {
    const context = this.extractConversationContext(conversationHistory);
    
    if (searchResults.length === 0) {
      return {
        answer: "I don't have specific information about that, but I can tell you about CognivexAI's services, projects, or technology.",
        sources: [],
        confidence: 0.35,
        suggestedActions: [
          "Learn about our services",
          "See our projects",
          "Explore our technology",
          "Schedule a consultation"
        ]
      };
    }

    const main = searchResults[0];
    let answer = this.buildContextualAnswer(main.content, context, query);

    if (searchResults.length > 1) {
      const extra = searchResults.slice(1, 3)
        .filter(r => r.category !== 'Context') // Don't duplicate context results
        .map(r => r.content)
        .join(" ");
      if (extra) {
        answer += `\n\n${extra}`;
      }
    }

    const conf = this.clamp(0.35 + main.relevance * 0.6, 0.35, 0.85);
    const suggestedActions = this.generateContextualActions(query, searchResults, context);

    return {
      answer,
      sources: searchResults,
      confidence: conf,
      suggestedActions
    };
  }

  private buildContextualAnswer(content: string, context: any, query: string): string {
    let answer = content;
    
    // Add context-aware opening if we have conversation history
    if (context.topics && context.topics.length > 0) {
      answer = `Based on our conversation about ${context.topics.join(', ')}, ${content.toLowerCase()}`;
    }
    
    // Add conversation stage-specific content
    if (context.conversationStage === 'engaged') {
      answer += "\n\nSince you're showing interest in our services, would you like me to:";
      answer += "\n• Schedule a consultation call";
      answer += "\n• Provide more detailed information";
      answer += "\n• Show you relevant case studies";
    } else if (context.conversationStage === 'exploring') {
      answer += "\n\nI'd be happy to dive deeper into any of these topics. What interests you most?";
    }
    
    // Add follow-up suggestions based on context
    if (context.userQuestions && context.userQuestions.length > 0) {
      answer += `\n\nI noticed you've asked about ${context.userQuestions.length} topics. Feel free to ask any follow-up questions!`;
    }
    
    return answer;
  }

  private generateContextualActions(query: string, searchResults: SearchResult[], context: any): string[] {
    const baseActions = this.generateSuggestedActions(query, searchResults);
    
    // Add context-specific actions
    if (context.conversationStage === 'engaged') {
      return [
        "Schedule a consultation",
        "Get detailed pricing",
        "See case studies",
        "Contact the team"
      ];
    } else if (context.topics && context.topics.includes('pricing')) {
      return [
        "Schedule a consultation",
        "Learn about our services",
        "See our projects",
        "Contact us"
      ];
    }
    
    return baseActions;
  }

  private generateSuggestedActions(query: string, results: SearchResult[]): string[] {
    const actions: string[] = [];
    const qn = this.normalize(query);

    if (/\b(service|offer)\b/.test(qn)) {
      actions.push("Learn more about our services", "Get a custom quote");
    }
    if (/\b(project|portfolio)\b/.test(qn)) {
      actions.push("See our case studies", "View our portfolio");
    }
    if (/\b(price|cost)\b/.test(qn)) {
      actions.push("Request a detailed quote", "See pricing tiers");
    }
    if (/\b(tech|stack)\b/.test(qn)) {
      actions.push("Explore our tech stack", "Request integration advice");
    }

    actions.push("Schedule a consultation");
    return actions.slice(0, 4);
  }

  // ---------------- Topic Info (fallback) ----------------
  getTopicInfo(topic: string): string {
    const t = this.normalize(topic);
    if (t.includes("company")) {
      const c = this.knowledge.company;
      return `${c.name}: ${c.description} Mission: ${c.mission}. Vision: ${c.vision}.`;
    }
    if (t.includes("service")) {
      return `We offer ${this.knowledge.services.length} core services: ${this.knowledge.services.map((s: any) => s.name).join(", ")}.`;
    }
    if (t.includes("tech")) {
      const tech = this.knowledge.technology;
      return `Frontend: ${tech.frontend.join(", ")}. Backend: ${tech.backend.join(", ")}. AI: ${tech.ai.join(", ")}.`;
    }
    if (t.includes("price")) {
      const pricing = this.knowledge.pricing;
      return `Pricing ranges from ${pricing.tiers[0].price} up to ${pricing.tiers[pricing.tiers.length - 1].price}.`;
    }
    return "Happy to provide more details — which topic are you most interested in?";
  }
}