/**
 * @fileOverview Schemas and types for the chatbot.
 *
 * - ChatMessage - A message in the chat history.
 * - ChatInput - The input for the chat flow.
 * - ChatOutput - The output for the chat flow.
 * - ConversationContext - User context and preferences.
 * - IntentData - Detected user intent and confidence.
 */

import {z} from 'genkit';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
  timestamp: z.number().optional(),
  metadata: z.object({
    intent: z.string().optional(),
    confidence: z.number().optional(),
    entities: z.array(z.string()).optional(),
  }).optional(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  context: z.object({
    userId: z.string().optional(),
    sessionId: z.string().optional(),
    language: z.enum(['en', 'fr']).optional(),
    userPreferences: z.object({
      industry: z.string().optional(),
      interests: z.array(z.string()).optional(),
      budget: z.string().optional(),
      timeline: z.string().optional(),
      contactPreference: z.string().optional(),
    }).optional(),
    conversationState: z.object({
      currentTopic: z.string().optional(),
      leadStage: z.enum(['new', 'interested', 'qualified', 'ready']).optional(),
      lastIntent: z.string().optional(),
      interactionCount: z.number().optional(),
    }).optional(),
  }).optional(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.object({
  response: z.string(),
  context: z.object({
    suggestedActions: z.array(z.string()).optional(),
    nextQuestions: z.array(z.string()).optional(),
    leadScore: z.number().optional(),
    userPreferences: z.object({
      industry: z.string().optional(),
      interests: z.array(z.string()).optional(),
      budget: z.string().optional(),
      timeline: z.string().optional(),
      contactPreference: z.string().optional(),
    }).optional(),
  }).optional(),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export const IntentDataSchema = z.object({
  intent: z.string(),
  confidence: z.number(),
  entities: z.array(z.string()),
  scope: z.enum(['in_scope', 'out_of_scope', 'context_dependent', 'utility', 'unknown']).optional(),
  priority: z.enum(['high', 'medium', 'low', 'none']).optional(),
  isUrgent: z.boolean().optional(),
  isFollowUp: z.boolean().optional(),
  suggestedResponse: z.string().optional(),
});
export type IntentData = z.infer<typeof IntentDataSchema>;
