'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, User, ExternalLink, Calendar, Phone, Mail, MessageCircle, Mic, MicOff, Volume2, VolumeX, Settings, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import emailjs from '@emailjs/browser';

import type { ChatMessage } from '@/ai/schemas/chatbot';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AnimatedLogo } from './ui/animated-logo';

interface RichResponse {
  text: string;
  actions?: Array<{
    label: string;
    type: 'button' | 'link' | 'contact';
    action: string;
    icon?: string;
  }>;
  leadScore?: number;
  nextQuestions?: string[];
}

interface VoiceAgentState {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  confidence: number;
  transcript: string;
  fullTranscript: string;
}

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description: string;
  labels: Record<string, string>;
}

export default function ElevenLabsVoiceChatbot() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  
  // Voice Agent states
  const [voiceAgent, setVoiceAgent] = useState<VoiceAgentState>({
    isActive: false,
    isListening: false,
    isSpeaking: false,
    isProcessing: false,
    confidence: 0,
    transcript: '',
    fullTranscript: ''
  });
  
  // Audio and speech states
  const [isMuted, setIsMuted] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);

  
  // ElevenLabs states
  const [availableVoices, setAvailableVoices] = useState<ElevenLabsVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  
  // Scheduling state
  const [schedulingState, setSchedulingState] = useState<{
    isActive: boolean;
    userInfo: { name: string; email: string };
    bookingDetails?: {
      date: string;
      time: string;
      timezone: string;
      ownerTime: string;
    };
  }>({
    isActive: false,
    userInfo: { name: '', email: '' }
  });
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Voice processing refs
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // ElevenLabs API configuration
  const ELEVENLABS_API_KEY = 'sk_0319ae36d08c569341e843b46f2cb8838fb45e93373c2db3';
  const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

  // Initialize voice recognition and ElevenLabs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🔊 Initializing ElevenLabs Voice Agent...');
      
      // Initialize Speech Recognition
      if ('webkitSpeechRecognition' in window) {
        console.log('✅ Speech Recognition supported');
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = language === 'en' ? 'en-US' : 'fr-FR';
        
        recognitionRef.current.onstart = () => {
          console.log('🎤 Speech recognition started');
          setVoiceAgent(prev => ({ ...prev, isListening: true }));
        };
        
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          let maxConfidence = 0;
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence;
            
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
              maxConfidence = Math.max(maxConfidence, confidence);
            } else {
              interimTranscript += transcript;
            }
          }
          
          setVoiceAgent(prev => ({
            ...prev,
            transcript: interimTranscript,
            confidence: maxConfidence
          }));
          
          if (finalTranscript) {
            console.log('🎯 Final transcript:', finalTranscript);
            handleVoiceInput(finalTranscript);
          }
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('❌ Speech recognition error:', event.error);
          setVoiceAgent(prev => ({ ...prev, isListening: false }));
        };
        
        recognitionRef.current.onend = () => {
          console.log('🛑 Speech recognition ended');
          setVoiceAgent(prev => ({ ...prev, isListening: false }));
        };
      } else {
        console.warn('⚠️ Speech Recognition not supported');
      }
      
      // Initialize Audio Context for visual effects
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('🎵 Audio context initialized');
      } catch (error) {
        console.error('❌ Failed to initialize audio context:', error);
      }
      
      // Load ElevenLabs voices immediately
      loadElevenLabsVoices();
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [language]);

  // Load available voices from ElevenLabs
  const loadElevenLabsVoices = async () => {
    try {
      setIsLoadingVoices(true);
      console.log('🎵 Loading ElevenLabs voices...');
      console.log('🔑 Using API key:', ELEVENLABS_API_KEY.substring(0, 10) + '...');
      console.log('🌐 API URL:', ELEVENLABS_API_URL);
      
      // Set a fallback voice ID immediately for testing
      const fallbackVoiceId = '21m00Tcm4TlvDq8ikWAM'; // Default ElevenLabs voice
      setSelectedVoice(fallbackVoiceId);
      console.log('🔄 Set fallback voice ID:', fallbackVoiceId);
      
      const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`Failed to load voices: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('📄 Full API response:', data);
      
      const voices = data.voices || [];
      console.log('🎵 Available voices:', voices.length);
      
      if (voices.length === 0) {
        console.warn('⚠️ No voices returned from API, using fallback');
        toast({
          title: "No Voices Available",
          description: "ElevenLabs API returned no voices. Using fallback voice.",
          variant: "destructive",
        });
        return;
      }
      
      setAvailableVoices(voices);
      
      // Select a default voice (preferably English, professional)
      const defaultVoice = voices.find((voice: any) => 
        voice.labels?.language === 'en' && 
        (voice.category === 'cloned' || voice.category === 'premade')
      ) || voices[0];
      
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.voice_id);
        console.log('🎯 Selected default voice:', defaultVoice.name, 'ID:', defaultVoice.voice_id);
      }
      
    } catch (error: any) {
      console.error('❌ Failed to load ElevenLabs voices:', error);
      toast({
        title: "Voice Loading Error",
        description: `Failed to load voices: ${error.message}. Using fallback voice.`,
        variant: "destructive",
      });
      
      console.log('🔄 Continuing with fallback voice ID for testing');
    } finally {
      setIsLoadingVoices(false);
    }
  };

  // ElevenLabs text-to-speech function with proper autoplay handling
  const speakWithElevenLabs = async (text: string) => {
    console.log('🔊 Attempting to speak:', text);
    console.log('🎯 Selected voice ID:', selectedVoice);
    console.log('🔇 Is muted:', isMuted);
    
    // Use fallback voice if none selected
    const voiceToUse = selectedVoice || '21m00Tcm4TlvDq8ikWAM';
    console.log('🎯 Using voice ID:', voiceToUse);
    
    if (isMuted) {
      console.log('🔇 Speech muted, skipping');
      return;
    }
    
    try {
      console.log('🔊 Speaking with ElevenLabs:', text);
      setVoiceAgent(prev => ({ ...prev, isSpeaking: true }));
      
      const requestBody = {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      };
      
      console.log('📤 Request body:', requestBody);
      console.log('🔑 API key:', ELEVENLABS_API_KEY.substring(0, 10) + '...');
      console.log('🎯 Making TTS request to:', `${ELEVENLABS_API_URL}/text-to-speech/${voiceToUse}`);
      
      const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceToUse}`, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('📡 TTS Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ TTS API Error Response:', errorText);
        throw new Error(`ElevenLabs TTS API error: ${response.status} - ${errorText}`);
      }
      
      const audioBlob = await response.blob();
      console.log('🎵 Audio blob size:', audioBlob.size, 'bytes');
      
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('🔗 Audio URL created:', audioUrl);
      
      // Play the audio with proper error handling
      const audio = new Audio(audioUrl);
      
      audio.onloadstart = () => console.log('🎵 Audio loading started');
      audio.oncanplay = () => console.log('🎵 Audio can play');
      audio.onplay = () => console.log('🎵 Audio play started');
      
      audio.onended = () => {
        console.log('✅ ElevenLabs speech ended');
        setVoiceAgent(prev => ({ ...prev, isSpeaking: false }));
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (error) => {
        console.error('❌ Audio playback error:', error);
        setVoiceAgent(prev => ({ ...prev, isSpeaking: false }));
        URL.revokeObjectURL(audioUrl);
      };
      
      console.log('🎯 Starting audio playback...');
      
      try {
        // Try to play audio with user interaction context
        const playResult = await audio.play();
        console.log('🎵 Audio play result:', playResult);
        console.log('🎯 ElevenLabs speech started');
      } catch (playError: any) {
        console.error('❌ Audio play failed:', playError);
        
        if (playError.name === 'NotAllowedError') {
          // Autoplay blocked - show user instruction
          toast({
            title: "Audio Playback Blocked",
            description: "Please click the Voice Agent button again to enable audio playback.",
            variant: "destructive",
          });
          
          // Reset voice agent state
          setVoiceAgent(prev => ({ ...prev, isActive: false, isSpeaking: false }));
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        } else {
          throw playError;
        }
      }
      
    } catch (error: any) {
      console.error('❌ ElevenLabs speech error:', error);
      setVoiceAgent(prev => ({ ...prev, isSpeaking: false }));
      
      toast({
        title: "Voice Error",
        description: `Failed to generate speech: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Message storage functions
  const saveMessagesToStorage = (messages: ChatMessage[], sessionId: string) => {
    try {
      const chatData = {
        sessionId,
        messages,
        timestamp: Date.now(),
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(`chatbot_${sessionId}`, JSON.stringify(chatData));
    } catch (error) {
      console.error('Failed to save messages to localStorage:', error);
    }
  };

  const loadMessagesFromStorage = (sessionId: string): ChatMessage[] => {
    try {
      const stored = localStorage.getItem(`chatbot_${sessionId}`);
      if (stored) {
        const chatData = JSON.parse(stored);
        return chatData.messages || [];
      }
    } catch (error) {
      console.error('Failed to load messages from localStorage:', error);
    }
    return [];
  };

  // Initialize EmailJS
  useEffect(() => {
    try {
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'COtKbmSCzdpiCZDwB';
      emailjs.init(publicKey);
    } catch (error) {
      console.error('EmailJS initialization failed:', error);
    }
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [sessionId]);

  useEffect(() => {
    if (isOpen && !isInitialized) {
      const storedMessages = loadMessagesFromStorage(sessionId);
      
      if (storedMessages.length > 0) {
        setMessages(storedMessages);
      } else {
        const greetingMessage = language === 'en'
          ? "Hello! I'm Zephyr, your AI voice agent powered by ElevenLabs. I can help you with appointments, inquiries, and more. Click 'Voice Agent' to start a natural conversation!"
          : "Bonjour ! Je suis Zephyr, votre agent vocal IA alimenté par ElevenLabs. Je peux vous aider avec les rendez-vous, les demandes et plus encore. Cliquez sur 'Agent Vocal' pour commencer une conversation naturelle !";
        
        setMessages([
          { role: 'model', content: greetingMessage }
        ]);
      }
      setIsInitialized(true);
    }
  }, [isOpen, isInitialized, sessionId, language]);

  // Auto-scroll to bottom
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current;
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    };
    
    scrollToBottom();
    
    const timer1 = setTimeout(scrollToBottom, 50);
    const timer2 = setTimeout(scrollToBottom, 150);
    const timer3 = setTimeout(scrollToBottom, 300);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [messages, isLoading]);

  // Handle voice input
  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    // Update full transcript
    setVoiceAgent(prev => ({
      ...prev,
      fullTranscript: prev.fullTranscript + '\n' + transcript,
      transcript: '',
      isProcessing: true
    }));
    
    // Add user voice message
    const userMessage = { role: 'user' as const, content: transcript };
    const newMessages: ChatMessage[] = [...messages, userMessage];
    setMessages(newMessages);
    saveMessagesToStorage(newMessages, sessionId);
    
    // Process the voice input
    await processMessage(transcript, newMessages);
    
    setVoiceAgent(prev => ({ ...prev, isProcessing: false }));
  };

  // Process message (voice or text)
  const processMessage = async (message: string, currentMessages: ChatMessage[]) => {
    setIsLoading(true);
    
    try {
      // Check for lead information (name, email) first
      const leadInfo = extractLeadInfo(message);
      if (leadInfo.name || leadInfo.email) {
        await handleLeadCapture(leadInfo, currentMessages);
        return;
      }
      
      // Check for booking intent
      const bookingKeywords = ['schedule', 'book', 'appointment', 'meeting', 'call', 'consultation', 'set up', 'arrange', 'reserve', 'slot', 'time', 'calendar'];
      const hasBookingIntent = bookingKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
      );
      
      if (hasBookingIntent) {
        await handleBookingIntent(message, currentMessages);
      } else {
        // Handle general conversation
        const response = await handleGeneralConversation(message);
        setMessages([...currentMessages, { role: 'model', content: response }]);
        
        // Speak the response if voice agent is active
        if (voiceAgent.isActive) {
          await speakWithElevenLabs(response);
        }
      }
      
      saveMessagesToStorage(messages, sessionId);
      
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = language === 'en' 
        ? "I'm sorry, I encountered an error processing your request. Please try again."
        : "Je suis désolé, j'ai rencontré une erreur en traitant votre demande. Veuillez réessayer.";
      
      setMessages([...currentMessages, { role: 'model', content: errorMessage }]);
      
      if (voiceAgent.isActive) {
        await speakWithElevenLabs(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Extract calendar booking information from message with enhanced options
  const extractCalendarInfo = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Date patterns
    const todayMatch = lowerMessage.match(/(?:today|tonight|this evening)/);
    const tomorrowMatch = lowerMessage.match(/(?:tomorrow|tmr|tmrw)/);
    const nextWeekMatch = lowerMessage.match(/(?:next week|following week)/);
    const dayMatch = lowerMessage.match(/(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)/i);
    const nextDayMatch = lowerMessage.match(/(?:next monday|next tuesday|next wednesday|next thursday|next friday|next saturday|next sunday)/i);
    const dateMatch = lowerMessage.match(/(\d{1,2})\/(\d{1,2})|(\d{1,2})-(\d{1,2})/);
    
    // Time patterns
    const timeMatch = lowerMessage.match(/(\d{1,2}):?(\d{2})?\s*(am|pm|a\.m\.|p\.m\.)/i);
    const hourMatch = lowerMessage.match(/(\d{1,2})\s*(am|pm|a\.m\.|p\.m\.)/i);
    
    // Duration patterns with more options
    const durationMatch = lowerMessage.match(/(\d+)\s*(hour|hr|minute|min)/i);
    const quickMatch = lowerMessage.match(/(?:quick|brief|short)/);
    const longMatch = lowerMessage.match(/(?:long|extended|comprehensive)/);
    
    // Meeting type patterns
    const demoMatch = lowerMessage.match(/(?:demo|demonstration|showcase)/);
    const technicalMatch = lowerMessage.match(/(?:technical|tech|development)/);
    const strategyMatch = lowerMessage.match(/(?:strategy|planning|roadmap)/);
    const discoveryMatch = lowerMessage.match(/(?:discovery|assessment|evaluation)/);
    const followUpMatch = lowerMessage.match(/(?:follow.?up|followup|check.?in)/);
    
    let date = new Date();
    let time = '14:00'; // Default 2 PM
    let duration = 60; // Default 1 hour
    let meetingType = 'consultation';
    
    // Set date with enhanced logic
    if (tomorrowMatch) {
      date.setDate(date.getDate() + 1);
    } else if (nextWeekMatch) {
      date.setDate(date.getDate() + 7);
    } else if (nextDayMatch) {
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDay = dayNames.indexOf(nextDayMatch[0].split(' ')[1]);
      const currentDay = date.getDay();
      const daysToAdd = (targetDay - currentDay + 7) % 7 + 7; // Add extra week
      date.setDate(date.getDate() + daysToAdd);
    } else if (dayMatch) {
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDay = dayNames.indexOf(dayMatch[0].toLowerCase());
      const currentDay = date.getDay();
      const daysToAdd = (targetDay - currentDay + 7) % 7;
      date.setDate(date.getDate() + daysToAdd);
    } else if (dateMatch) {
      const month = parseInt(dateMatch[1] || dateMatch[3]) - 1;
      const day = parseInt(dateMatch[2] || dateMatch[4]);
      date.setMonth(month);
      date.setDate(day);
    }
    
    // Set time
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const period = timeMatch[3].toLowerCase();
      
      if (period.includes('pm') && hour !== 12) hour += 12;
      if (period.includes('am') && hour === 12) hour = 0;
      
      time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    } else if (hourMatch) {
      let hour = parseInt(hourMatch[1]);
      const period = hourMatch[2].toLowerCase();
      
      if (period.includes('pm') && hour !== 12) hour += 12;
      if (period.includes('am') && hour === 12) hour = 0;
      
      time = `${hour.toString().padStart(2, '0')}:00`;
    }
    
    // Set duration with smart defaults
    if (durationMatch) {
      const value = parseInt(durationMatch[1]);
      const unit = durationMatch[2].toLowerCase();
      if (unit.includes('hour') || unit.includes('hr')) {
        duration = value * 60;
      } else if (unit.includes('minute') || unit.includes('min')) {
        duration = value;
      }
    } else if (quickMatch) {
      duration = 30;
    } else if (longMatch) {
      duration = 120;
    }
    
    // Set meeting type
    if (demoMatch) {
      meetingType = 'demo';
    } else if (technicalMatch) {
      meetingType = 'technical review';
    } else if (strategyMatch) {
      meetingType = 'strategy session';
    } else if (discoveryMatch) {
      meetingType = 'discovery call';
    } else if (followUpMatch) {
      meetingType = 'follow-up';
    }
    
    return { date, time, duration, meetingType };
  };

  // Handle calendar booking
  const handleCalendarBooking = async (calendarInfo: { date: Date; time: string; duration: number }, userEmail: string, userName: string): Promise<string> => {
    try {
      const [hours, minutes] = calendarInfo.time.split(':').map(Number);
      const startTime = new Date(calendarInfo.date);
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(startTime.getTime() + calendarInfo.duration * 60000);
      
      const bookingData = {
        summary: `CognivexAI Consultation - ${userName}`,
        description: `Consultation meeting with ${userName} (${userEmail})`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        attendeeEmail: userEmail,
        attendeeName: userName
      };
      
      const response = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      if (response.ok) {
        const result = await response.json();
        
        return language === 'en'
          ? `✅ Meeting booked successfully!\n\n📅 Date: ${startTime.toLocaleDateString()}\n⏰ Time: ${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}\n⏱️ Duration: ${calendarInfo.duration} minutes\n📧 Client Email: ${userEmail}\n\nYour meeting has been added to our calendar. We'll contact you at ${userEmail} to confirm the details. Looking forward to our consultation!`
          : `✅ Réunion réservée avec succès !\n\n📅 Date : ${startTime.toLocaleDateString()}\n⏰ Heure : ${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}\n⏱️ Durée : ${calendarInfo.duration} minutes\n📧 Email client : ${userEmail}\n\nVotre réunion a été ajoutée à notre calendrier. Nous vous contacterons à ${userEmail} pour confirmer les détails. J'ai hâte de notre consultation !`;
      } else {
        throw new Error('Failed to book meeting');
      }
    } catch (error) {
      console.error('❌ Calendar booking error:', error);
      return language === 'en'
        ? "❌ Sorry, I couldn't book the meeting at the moment. Please try again or contact us directly."
        : "❌ Désolé, je n'ai pas pu réserver la réunion pour le moment. Veuillez réessayer ou nous contacter directement.";
    }
  };

  // Handle booking intent
  const handleBookingIntent = async (message: string, currentMessages: ChatMessage[]) => {
    const calendarInfo = extractCalendarInfo(message);
    
    // Look through ALL messages to find user info (not just current message)
    let userEmail = '';
    let userName = '';
    
    for (const msg of currentMessages) {
      if (msg.role === 'user') {
        // Extract email if not found yet
        if (!userEmail) {
          const emailMatch = msg.content.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
          if (emailMatch) userEmail = emailMatch[0];
        }
        
        // Extract name if not found yet
        if (!userName) {
          const nameMatch = msg.content.match(/(?:my name is|i'm|i am|call me)\s+([a-zA-Z\s]+)/i);
          if (nameMatch) userName = nameMatch[1].trim();
        }
      }
    }
    
    if (userEmail && userName) {
      const response = await handleCalendarBooking(calendarInfo, userEmail, userName);
      setMessages([...currentMessages, { role: 'model', content: response }]);
      
      if (voiceAgent.isActive) {
        await speakWithElevenLabs(response);
      }
    } else {
      const response = language === 'en'
        ? "I'd love to help you book a meeting! First, please tell me:\n\n👤 Your name (e.g., 'My name is John')\n📧 Your email (e.g., 'john@example.com')\n\nThen I can schedule your consultation right away!"
        : "J'aimerais vous aider à réserver une réunion ! D'abord, dites-moi :\n\n👤 Votre nom (ex : 'Je m'appelle Jean')\n📧 Votre email (ex : 'jean@exemple.com')\n\nEnsuite, je pourrai programmer votre consultation immédiatement !";
      
      setMessages([...currentMessages, { role: 'model', content: response }]);
      
      if (voiceAgent.isActive) {
        await speakWithElevenLabs(response);
      }
    }
  };

  // Extract lead information from message with enhanced scoring
  const extractLeadInfo = (message: string) => {
    const nameMatch = message.match(/(?:my name is|i'm|i am|call me)\s+([a-zA-Z\s]+)/i);
    const emailMatch = message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    
    // Enhanced lead scoring based on message content
    let leadScore = 50; // Base score
    let leadPriority = 'medium';
    let leadNotes = [];
    
    const lowerMessage = message.toLowerCase();
    
    // Business indicators (higher score)
    if (lowerMessage.includes('business') || lowerMessage.includes('company') || lowerMessage.includes('enterprise')) {
      leadScore += 20;
      leadNotes.push('Business/Enterprise lead');
    }
    
    if (lowerMessage.includes('project') || lowerMessage.includes('development') || lowerMessage.includes('implementation')) {
      leadScore += 15;
      leadNotes.push('Project-focused lead');
    }
    
    if (lowerMessage.includes('urgent') || lowerMessage.includes('asap') || lowerMessage.includes('immediate')) {
      leadScore += 25;
      leadPriority = 'high';
      leadNotes.push('Urgent request');
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('pricing') || lowerMessage.includes('cost')) {
      leadScore += 10;
      leadNotes.push('Budget-aware lead');
    }
    
    if (lowerMessage.includes('consultation') || lowerMessage.includes('meeting') || lowerMessage.includes('call')) {
      leadScore += 15;
      leadNotes.push('Meeting-ready lead');
    }
    
    // Industry indicators
    if (lowerMessage.includes('ecommerce') || lowerMessage.includes('retail')) {
      leadNotes.push('E-commerce/Retail industry');
    } else if (lowerMessage.includes('healthcare') || lowerMessage.includes('medical')) {
      leadNotes.push('Healthcare industry');
    } else if (lowerMessage.includes('finance') || lowerMessage.includes('banking')) {
      leadNotes.push('Finance/Banking industry');
    } else if (lowerMessage.includes('manufacturing') || lowerMessage.includes('production')) {
      leadNotes.push('Manufacturing industry');
    }
    
    // Set priority based on score
    if (leadScore >= 80) leadPriority = 'high';
    else if (leadScore >= 60) leadPriority = 'medium';
    else leadPriority = 'low';
    
    return {
      name: nameMatch ? nameMatch[1].trim() : null,
      email: emailMatch ? emailMatch[0] : null,
      leadScore,
      leadPriority,
      leadNotes: leadNotes.join('; ')
    };
  };

  // Handle lead capture
  const handleLeadCapture = async (leadInfo: { name: string | null; email: string | null; leadScore?: number; leadPriority?: string; leadNotes?: string }, currentMessages: ChatMessage[]) => {
    let response = '';
    
    if (leadInfo.name && leadInfo.email) {
      // Both name and email provided
      response = language === 'en'
        ? `Great! I've captured your information:\n\n👤 Name: ${leadInfo.name}\n📧 Email: ${leadInfo.email}\n\nI'm saving this to our lead management system. How can I help you today?`
        : `Parfait ! J'ai capturé vos informations :\n\n👤 Nom : ${leadInfo.name}\n📧 Email : ${leadInfo.email}\n\nJe sauvegarde cela dans notre système de gestion des prospects. Comment puis-je vous aider aujourd'hui ?`;
      
      // Save to Google Sheets with enhanced lead information
      await saveLeadToGoogleSheets({
        name: leadInfo.name,
        email: leadInfo.email,
        message: currentMessages[currentMessages.length - 1]?.content || 'Lead captured from chat',
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        leadScore: leadInfo.leadScore || 75
      });
      
    } else if (leadInfo.name) {
      // Only name provided
      response = language === 'en'
        ? `Nice to meet you, ${leadInfo.name}! What's your email address so I can better assist you?`
        : `Ravi de vous rencontrer, ${leadInfo.name} ! Quel est votre adresse email pour que je puisse mieux vous aider ?`;
    } else if (leadInfo.email) {
      // Only email provided
      response = language === 'en'
        ? `Thanks for providing your email: ${leadInfo.email}. What's your name?`
        : `Merci d'avoir fourni votre email : ${leadInfo.email}. Quel est votre nom ?`;
    }
    
    setMessages([...currentMessages, { role: 'model', content: response }]);
    
    // Speak the response if voice agent is active
    if (voiceAgent.isActive) {
      await speakWithElevenLabs(response);
    }
  };

  // Google Sheets integration for lead storage
  const saveLeadToGoogleSheets = async (leadData: {
    name: string;
    email: string;
    message: string;
    timestamp: string;
    sessionId: string;
    leadScore: number;
  }) => {
    try {
      const response = await fetch('/api/sheets/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      
      if (response.ok) {
        console.log('✅ Lead saved to Google Sheets');
        return true;
      } else {
        console.error('❌ Failed to save lead to Google Sheets');
        return false;
      }
    } catch (error) {
      console.error('❌ Error saving lead:', error);
      return false;
    }
  };

  // Handle general conversation
  const handleGeneralConversation = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return language === 'en' 
        ? "Hello! How can I help you today? You can ask me about our services, schedule a consultation, or just chat naturally."
        : "Bonjour ! Comment puis-je vous aider aujourd'hui ? Vous pouvez me demander nos services, programmer une consultation ou simplement discuter naturellement.";
    }
    
    if (lowerMessage.includes('services') || lowerMessage.includes('what do you do') || lowerMessage.includes('cognivex')) {
      return language === 'en'
        ? "CognivexAI - Premier AI Solutions Partner\n\n📊 Data Analysis\n   • Automated insights & reporting\n   • Business intelligence dashboards\n   • Predictive analytics\n\n🤖 AI Chatbots\n   • 24/7 intelligent support\n   • Lead qualification & booking\n   • CRM integration\n\n🌐 AI-Enhanced Websites\n   • Modern responsive design\n   • AI personalization\n   • Chatbot integration\n\n💎 Success Metrics\n   • 40% cost reduction\n   • 3x faster decisions\n   • 95% accuracy\n\nWhich service interests you most?"
        : "CognivexAI - Partenaire de Solutions IA de Premier Plan\n\n📊 Analyse de Données\n   • Insights et rapports automatisés\n   • Tableaux de bord d'intelligence d'affaires\n   • Analytique prédictive\n\n🤖 Chatbots IA\n   • Support intelligent 24h/24\n   • Qualification des prospects et réservation\n   • Intégration CRM\n\n🌐 Sites Web Améliorés par l'IA\n   • Design responsive moderne\n   • Personnalisation IA\n   • Intégration chatbot\n\n💎 Métriques de Succès\n   • 40% de réduction des coûts\n   • Décisions 3x plus rapides\n   • 95% de précision\n\nQuel service vous intéresse le plus ?";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
      return language === 'en'
        ? "You can reach us at snazzy.mugi@gmail.com or schedule a call through me. Would you like me to help you book a consultation?"
        : "Vous pouvez nous joindre à snazzy.mugi@gmail.com ou programmer un appel par mon intermédiaire. Souhaitez-vous que je vous aider à réserver une consultation ?";
    }
    
    return language === 'en'
      ? "That's interesting! I'd be happy to help you with that. You can ask me about our services, schedule a consultation, or just continue our conversation naturally."
      : "C'est intéressant ! Je serais ravi de vous aider avec cela. Vous pouvez me demander nos services, programmer une consultation ou simplement continuer notre conversation naturellement.";
  };

  // Toggle voice agent mode with proper autoplay handling
  const toggleVoiceAgent = () => {
    const newState = !voiceAgent.isActive;
    setVoiceAgent(prev => ({ ...prev, isActive: newState }));
    
    if (newState) {
      // Start listening immediately
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      // Speak welcome message after user interaction
      const welcomeMessage = language === 'en'
        ? "Voice Agent mode activated. I'm now listening and ready to help you with professional ElevenLabs voice. You can speak naturally and I'll respond with voice."
        : "Mode Agent Vocal activé. J'écoute maintenant et je suis prêt à vous aider avec la voix professionnelle ElevenLabs. Vous pouvez parler naturellement et je répondrai par la voix.";
      
      // Use setTimeout to ensure user interaction context
      setTimeout(() => {
        speakWithElevenLabs(welcomeMessage);
      }, 100);
    } else {
      // Stop listening and speaking
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setVoiceAgent(prev => ({ 
        ...prev, 
        isListening: false, 
        isSpeaking: false,
        transcript: '',
        fullTranscript: ''
      }));
    }
  };

  // Handle form submission
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    const newMessages: ChatMessage[] = [...messages, userMessage];
    setMessages(newMessages);
    saveMessagesToStorage(newMessages, sessionId);
    
    setInput('');
    await processMessage(input, newMessages);
  };

  // Handle action clicks
  const handleActionClick = (action: string) => {
    setInput(action);
    setTimeout(() => {
      const userMessage = { role: 'user' as const, content: action };
      const newMessages: ChatMessage[] = [...messages, userMessage];
      setMessages(newMessages);
      saveMessagesToStorage(newMessages, sessionId);
      processMessage(action, newMessages);
    }, 100);
  };

  // Render rich response
  const renderRichResponse = (message: ChatMessage, index: number) => {
    if (message.role === 'model') {
      return (
        <div key={index} className="flex items-start gap-3">
          <Avatar className="h-8 w-8 bg-gradient-to-r from-orange-500 to-orange-600">
            <AvatarFallback className="text-white font-semibold">Z</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="rounded-lg px-3 py-2 bg-black/80 backdrop-blur-sm border border-gray-700/50">
              <p className="text-sm text-gray-200">{message.content}</p>
            </div>
            
            {/* Quick Actions */}
            {index === messages.length - 1 && !isLoading && (
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-3 bg-gray-800/50 border-gray-600 hover:bg-orange-500/20 hover:border-orange-500/50 text-gray-300 hover:text-orange-300"
                  onClick={() => handleActionClick("I'd like to schedule a consultation")}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-3 bg-gray-800/50 border-gray-600 hover:bg-orange-500/20 hover:border-orange-500/50 text-gray-300 hover:text-orange-300"
                  onClick={() => handleActionClick("What are your contact details?")}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Contact Info
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-3 bg-gray-800/50 border-gray-600 hover:bg-orange-500/20 hover:border-orange-500/50 text-gray-300 hover:text-orange-300"
                  onClick={() => handleActionClick("Tell me about your services")}
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Services
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    if (message.role === 'user') {
      return (
        <div key={index} className="flex items-start gap-3 justify-end">
          <div className="flex-1 max-w-[80%]">
            <div className="rounded-lg px-3 py-2 bg-blue-500/20 text-blue-100 text-sm">
              {message.content}
            </div>
          </div>
          <Avatar className="h-8 w-8 bg-gradient-to-r from-gray-600 to-gray-700">
            <AvatarFallback className="text-white"><User className="h-4 w-4" /></AvatarFallback>
          </Avatar>
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Voice Agent Status Indicator */}
        {voiceAgent.isActive && (
          <div className="absolute bottom-12 md:bottom-20 right-0 bg-gradient-to-r from-orange-500 to-red-500 backdrop-blur-sm rounded-lg px-3 py-2 border border-orange-400 shadow-lg animate-pulse">
            <div className="flex items-center space-x-2">
              <Mic className="h-4 w-4 text-white animate-pulse" />
              <p className="text-white text-sm font-medium">
                {voiceAgent.isListening ? 'Listening...' : voiceAgent.isSpeaking ? 'Speaking...' : 'Voice Agent Active'}
              </p>
            </div>
          </div>
        )}
        
        {/* Simple message bubble above the chatbot icon */}
        {!isOpen && (
          <div className="absolute bottom-12 md:bottom-20 right-0 bg-black/90 backdrop-blur-sm rounded-lg px-2 md:px-3 py-1.5 md:py-2 border border-gray-700 shadow-lg animate-in slide-in-from-bottom-2 duration-300">
            <p className="text-white text-xs md:text-sm font-medium whitespace-nowrap">
              {t('chatbot.greeting')}
            </p>
            <div className="absolute top-full right-3 md:right-4 w-2 h-2 bg-black/90 border-r border-b border-gray-700 transform rotate-45"></div>
          </div>
        )}
        
        <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="rounded-full h-16 w-16 md:h-18 md:w-18 shadow-lg flex items-center justify-center bg-black hover:bg-gray-800">
          {isOpen ? <X className="h-8 w-8 md:h-9 md:w-9 text-white" /> : <AnimatedLogo className="h-10 w-10 md:h-12 md:w-12" />}
          <span className="sr-only">{isOpen ? 'Close chat' : 'Open chat'}</span>
        </Button>
      </div>
      
      {isOpen && (
        <Card className={`fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] md:w-96 h-96 md:h-[500px] flex flex-col rounded-2xl animate-in slide-in-from-bottom-10 fade-in-50 duration-300 transition-all duration-500 ${
          voiceAgent.isActive 
            ? 'ring-4 ring-orange-500/50 shadow-2xl shadow-orange-500/25 bg-gradient-to-br from-gray-900/95 to-gray-800/95' 
            : 'bg-black/90 backdrop-blur-lg border border-gray-700/50 shadow-2xl'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8 bg-gradient-to-r from-orange-500 to-orange-600">
                <AvatarFallback className="text-white font-semibold">Z</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="font-headline text-base text-white">Zephyr AI</CardTitle>
                <p className="text-xs text-orange-300">ElevenLabs Powered</p>
              </div>
            </div>
            
            {/* Voice Agent Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleVoiceAgent}
                className={`h-8 w-8 transition-all duration-300 ${
                  voiceAgent.isActive 
                    ? 'text-orange-400 bg-orange-500/20 border border-orange-500/50 animate-pulse' 
                    : 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/20'
                }`}
                title={voiceAgent.isActive ? 'Voice Agent Active' : 'Activate Voice Agent'}
              >
                <Mic className="h-4 w-4" />
              </Button>
              
              {voiceAgent.isActive && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`h-8 w-8 ${isMuted ? 'text-red-400' : 'text-green-400'}`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              )}
              
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 hover:bg-orange-500/20">
                <X className="h-4 w-4 text-gray-400" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </CardHeader>
          
          {/* Voice Agent Status Bar */}
          {voiceAgent.isActive && (
            <div className="px-3 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-b border-orange-500/30">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${voiceAgent.isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-orange-300">
                    {voiceAgent.isListening ? 'Listening' : voiceAgent.isSpeaking ? 'Speaking...' : 'Ready'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-orange-300">Confidence: {Math.round(voiceAgent.confidence * 100)}%</span>
                </div>
              </div>
              
              {/* Live Transcript */}
              {voiceAgent.transcript && (
                <div className="mt-2 p-2 bg-black/30 rounded text-xs text-gray-300">
                  <span className="text-orange-400">Live: </span>
                  {voiceAgent.transcript}
                </div>
              )}
            </div>
          )}
          
          <div className="flex-1 p-3 overflow-y-auto" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => renderRichResponse(message, index))}
              {isLoading && (
                <div className="flex items-start gap-3">
                   <Avatar className="h-8 w-8 bg-gradient-to-r from-orange-500 to-orange-600">
                      <AvatarFallback className="text-white font-semibold">Z</AvatarFallback>
                    </Avatar>
                  <div className="rounded-lg px-3 py-2 bg-black/80 backdrop-blur-sm border border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
                      <span className="text-sm text-gray-300">{t('chatbot.thinking')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          

          
          <CardFooter className="p-3 border-t border-gray-700/50">
            <form onSubmit={handleSendMessage} data-chatbot-form="true" className="flex w-full items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={voiceAgent.isActive ? "Type or speak naturally..." : "Type your message..."}
                autoComplete="off"
                disabled={isLoading}
                className="h-10 text-sm bg-black/80 backdrop-blur-sm border border-gray-600 focus:border-orange-500/50 focus:ring-orange-500/20 text-white placeholder-gray-400"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !input.trim()} 
                className="h-10 w-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border border-orange-400/30"
              >
                <Send className="h-4 w-4 text-white" />
                <span className="sr-only">{t('chatbot.send')}</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
