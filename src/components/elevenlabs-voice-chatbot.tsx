'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, User, ExternalLink, Calendar, Phone, Mail, MessageCircle, Mic, MicOff, Volume2, VolumeX, Settings, Play, Pause, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';

import type { ChatMessage } from '@/ai/schemas/chatbot';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AnimatedLogo } from './ui/animated-logo';
import { CognivexRAGSystem } from '@/ai/rag/retrieval-system';

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

// Booking Form Component
interface BookingFormProps {
  onSubmit: (name: string, email: string, message: string, meetingDate?: string, meetingTime?: string) => void;
  onCancel: () => void;
}

function BookingForm({ onSubmit, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    meetingDate: '',
    meetingTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Generate available time slots for the selected date
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  // Check availability for selected date
  const checkAvailability = async (date: string) => {
    if (!date) return;
    
    console.log('🔍 Checking availability for date:', date);
    
    try {
      const slots = generateTimeSlots();
      console.log('📅 Generated time slots:', slots);
      const availableSlots = [];
      
      // Check each time slot for availability
      for (const time of slots) {
        try {
          const response = await fetch('/api/calendar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'checkAvailability',
              date,
              time,
              duration: 30
            })
          });
          
          const result = await response.json();
          console.log(`⏰ Checking ${time}:`, result);
          
          if (result.success && result.isAvailable) {
            availableSlots.push(time);
          }
        } catch (slotError) {
          console.error(`Error checking slot ${time}:`, slotError);
          // Don't add slot if API fails - this prevents duplicate bookings
          console.log(`❌ Slot ${time} marked as unavailable due to API error`);
        }
      }
      
      console.log('✅ Available slots:', availableSlots);
      setAvailableSlots(availableSlots);
      setShowTimeSlots(true);
    } catch (error) {
      console.error('Error checking availability:', error);
      // Don't show any slots if API fails - this prevents duplicate bookings
      console.log('❌ No slots available due to calendar API failure');
      setAvailableSlots([]);
      setShowTimeSlots(false);
    } finally {
      console.log('🔄 Setting checkingAvailability to false');
      setCheckingAvailability(false);
    }
  };

  const handleDateChange = (date: string) => {
    console.log('📅 Date changed to:', date);
    setFormData(prev => ({ ...prev, meetingDate: date, meetingTime: '' }));
    setShowTimeSlots(false);
    if (date) {
      // Show loading state immediately
      console.log('🔄 Setting checkingAvailability to true');
      setCheckingAvailability(true);
      setAvailableSlots([]);
      setShowTimeSlots(false);
      
      console.log('🔍 Checking real calendar availability for:', date);
      
      // Add a small delay to ensure loading state is visible
      setTimeout(() => {
        checkAvailability(date);
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    setIsSubmitting(true);
    await onSubmit(
      formData.name, 
      formData.email, 
      formData.message,
      formData.meetingDate || undefined,
      formData.meetingTime || undefined
    );
    setIsSubmitting(false);
  };

  // Get tomorrow's date as minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
          required
        />
        <Input
          type="email"
          placeholder="Your email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
          required
        />
        <Input
          type="text"
          placeholder="Tell us about your project (optional)"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
        />
        
        {/* Meeting Date Selection */}
        <div className="space-y-2">
          <label className="text-xs text-gray-300">Preferred meeting date (optional)</label>
          <Input
            type="date"
            value={formData.meetingDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={minDate}
            className="bg-black/50 border-gray-600 text-white focus:border-orange-500"
          />
        </div>

        {/* Time Slot Selection */}
        {(showTimeSlots || checkingAvailability) && (
          <div className="space-y-2">
            <label className="text-xs text-gray-300">
              Available time slots ({availableSlots.length} slots)
            </label>
            {console.log('🔍 UI Debug - checkingAvailability:', checkingAvailability, 'availableSlots.length:', availableSlots.length)}
            {checkingAvailability ? (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                Checking availability...
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 max-h-24 overflow-y-auto">
                {availableSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      console.log('⏰ Time slot selected:', time);
                      setFormData(prev => ({ ...prev, meetingTime: time }));
                    }}
                    className={`text-xs p-1 rounded border ${
                      formData.meetingTime === time
                        ? 'bg-orange-600 border-orange-500 text-white'
                        : 'bg-black/30 border-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                No available time slots for this date. Please try another date.
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isSubmitting || !formData.name || !formData.email}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs h-8"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              {formData.meetingDate && formData.meetingTime ? 'Booking...' : 'Submitting...'}
            </>
          ) : (
            <>
              <Calendar className="h-3 w-3 mr-1" />
              {formData.meetingDate && formData.meetingTime ? 'Book Meeting' : 'Submit'}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="bg-black/50 border-gray-600 text-gray-300 hover:bg-gray-800 text-xs h-8"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </form>
  );
}

export default function ElevenLabsVoiceChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  
  // Initialize RAG system
  const [ragSystem] = useState(() => new CognivexRAGSystem());
  
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

  // User profile and memory state
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    email?: string;
    interests: string[];
    industry?: string;
    budget?: string;
    timeline?: string;
    conversationCount: number;
    lastInteraction: string;
    preferences: {
      communicationStyle: 'formal' | 'casual';
      detailLevel: 'brief' | 'detailed';
      focusAreas: string[];
    };
  }>({
    interests: [],
    conversationCount: 0,
    lastInteraction: new Date().toISOString(),
    preferences: {
      communicationStyle: 'casual',
      detailLevel: 'detailed',
      focusAreas: []
    }
  });

  // Case study browser state
  const [caseStudyBrowser, setCaseStudyBrowser] = useState<{
    isOpen: boolean;
    selectedProject: string | null;
    currentUrl: string | null;
  }>({
    isOpen: false,
    selectedProject: null,
    currentUrl: null
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

  // Case study data organized by categories
  const caseStudyCategories = [
    {
      title: 'Web Development',
      projects: [
        {
          id: 'aniefiok',
          name: 'Aniefiok',
          description: 'Music Portfolio with Admin Panel',
          industry: 'Creative',
          url: 'https://aniefoik.vercel.app/',
          type: 'website',
          features: ['Admin Panel Integration', 'Live Performance Updates', 'Music Streaming']
        },
        {
          id: 'devika',
          name: 'Devika Sinha',
          description: 'Fine Art Photography with Store',
          industry: 'Art & Photography',
          url: 'https://www.devikasinha.com/',
          type: 'website',
          features: ['Picture Store', 'CMS Integration', 'E-commerce']
        },
        {
          id: 'dimitra',
          name: 'Dimitra Polic',
          description: 'Creative Photography Portfolio',
          industry: 'Photography',
          url: 'https://www.dimitrapolic.com/',
          type: 'external',
          features: ['CMS Integration', 'Portfolio Management', 'Responsive Design']
        },
        {
          id: 'steffff',
          name: 'Steffff',
          description: 'Photography Portfolio with Store',
          industry: 'Photography',
          url: 'https://www.steffff.com/',
          type: 'website',
          features: ['Picture Store', 'Portfolio Gallery', 'Print Sales']
        },
        {
          id: 'ashwith',
          name: 'Ashwith S Pai',
          description: 'Documentary Photography Portfolio',
          industry: 'Documentary Photography',
          url: 'https://www.ashwithspai.com/',
          type: 'external',
          features: ['Gallery System', 'Motorsport Photography', 'Portfolio Showcase']
        },
        {
          id: 'narmadha',
          name: 'Narmadha',
          description: 'Story Spark - AI Story Creation',
          industry: 'AI Content Creation',
          url: 'https://studio--story-spark-a2jdn.us-central1.hosted.app/',
          type: 'website',
          features: ['AI Story Generation', 'Story Book Publishing', 'Content Automation']
        }
      ]
    },
    {
      title: 'Data Analysis',
      projects: [
        {
          id: 'whatsthestory',
          name: 'What\'s The Story',
          description: 'Startup Journey Analysis & No-Code Platform',
          industry: 'Business Intelligence',
          url: '/Wats.pdf',
          type: 'pdf',
          features: ['One Year Analysis', 'Startup Metrics', 'No-Code Platform Development']
        },
        {
          id: 'french-market-analysis',
          name: 'French Market Analysis',
          description: 'Data Analysis using Snowflake & Metabase',
          industry: 'Market Research',
          url: '/French Market Analysis.mov',
          type: 'video',
          features: ['Snowflake Analytics', 'Metabase Visualization', 'French Market Insights']
        }
      ]
    }
  ];

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
        recognitionRef.current.lang = 'en-US';
        
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
      
      // Load ElevenLabs voices immediately (non-blocking)
      loadElevenLabsVoices().catch(error => {
        console.log('Voice loading failed, continuing with fallback:', error);
      });
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // 10 second timeout
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
      
      // Don't show error toast to avoid disrupting user experience
      // The fallback voice will work fine
      console.log('🔄 Continuing with fallback voice ID for testing');
      
      // Set a default voice ID to ensure the chatbot works
      const fallbackVoiceId = '21m00Tcm4TlvDq8ikWAM';
      setSelectedVoice(fallbackVoiceId);
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

  // User profile storage functions
  const saveUserProfile = (profile: typeof userProfile) => {
    try {
      localStorage.setItem('chatbot_user_profile', JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  };

  const loadUserProfile = (): typeof userProfile => {
    try {
      const stored = localStorage.getItem('chatbot_user_profile');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
    return {
      interests: [],
      conversationCount: 0,
      lastInteraction: new Date().toISOString(),
      preferences: {
        communicationStyle: 'casual',
        detailLevel: 'detailed',
        focusAreas: []
      }
    };
  };

  // Update user profile based on conversation
  const updateUserProfile = (message: string, conversationHistory: ChatMessage[]) => {
    setUserProfile(prev => {
      const updated = { ...prev };
      
      // Extract name and email from messages
      const nameMatch = message.match(/(?:my name is|i'm|i am)\s+([a-zA-Z\s]+)/i);
      if (nameMatch && !updated.name) {
        updated.name = nameMatch[1].trim();
      }
      
      const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailMatch && !updated.email) {
        updated.email = emailMatch[1];
      }
      
      // Extract interests
      const interestKeywords = ['data analysis', 'chatbot', 'website', 'ai', 'analytics', 'automation'];
      interestKeywords.forEach(keyword => {
        if (message.toLowerCase().includes(keyword) && !updated.interests.includes(keyword)) {
          updated.interests.push(keyword);
        }
      });
      
      // Extract industry
      const industryKeywords = ['retail', 'healthcare', 'finance', 'education', 'manufacturing', 'ecommerce'];
      industryKeywords.forEach(industry => {
        if (message.toLowerCase().includes(industry) && !updated.industry) {
          updated.industry = industry;
        }
      });
      
      // Update conversation count and last interaction
      updated.conversationCount += 1;
      updated.lastInteraction = new Date().toISOString();
      
      // Save to localStorage
      saveUserProfile(updated);
      
      return updated;
    });
  };

  // Case study browser functions
  const openCaseStudyBrowser = () => {
    setCaseStudyBrowser(prev => ({
      ...prev,
      isOpen: true,
      selectedProject: null,
      currentUrl: null
    }));
  };

  const closeCaseStudyBrowser = () => {
    setCaseStudyBrowser(prev => ({
      ...prev,
      isOpen: false,
      selectedProject: null,
      currentUrl: null
    }));
  };

  const selectCaseStudy = (projectId: string) => {
    // Find project across all categories
    let project = null;
    for (const category of caseStudyCategories) {
      project = category.projects.find(p => p.id === projectId);
      if (project) break;
    }
    
    if (project) {
      setCaseStudyBrowser(prev => ({
        ...prev,
        selectedProject: projectId,
        currentUrl: project.url
      }));
    }
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
      const storedProfile = loadUserProfile();
      
      setUserProfile(storedProfile);
      
      if (storedMessages.length > 0) {
        setMessages(storedMessages);
      } else {
        const greetingMessage = storedProfile.name 
          ? `Hello ${storedProfile.name}! Welcome back to CognivexAI. How can I help you today?`
          : "Hello! I'm Zephyr, your AI assistant from CognivexAI. I'm here to help you learn about our AI solutions, answer your questions, and assist with scheduling consultations. How can I help you today?";
        
        setMessages([
          { role: 'model', content: greetingMessage }
        ]);
      }
      setIsInitialized(true);
    }
  }, [isOpen, isInitialized, sessionId]);

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
      // Update user profile based on the message
      updateUserProfile(message, currentMessages);
      
      // Check for booking intent
      const bookingKeywords = ['schedule', 'book', 'appointment', 'meeting', 'call', 'consultation', 'set up', 'arrange', 'reserve', 'slot', 'time', 'calendar'];
      const hasBookingIntent = bookingKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
      );
      
      if (hasBookingIntent) {
        await handleBookingIntent(message, currentMessages);
      } else {
        // Handle general conversation with conversation history
        const response = await handleGeneralConversation(message, currentMessages);
        setMessages([...currentMessages, { role: 'model', content: response }]);
        
        // Speak the response if voice agent is active
        if (voiceAgent.isActive) {
          await speakWithElevenLabs(response);
        }
      }
      
      saveMessagesToStorage(messages, sessionId);
      
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = true 
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

  // Handle booking intent
  const handleBookingIntent = async (message: string, currentMessages: ChatMessage[]) => {
    const response = true
      ? "I'd be happy to help you schedule a consultation! I can detect that you want to book an appointment. Let me open our scheduling system for you."
      : "Je serais ravi de vous aider à programmer une consultation ! Je peux détecter que vous voulez réserver un rendez-vous. Laissez-moi ouvrir notre système de planification pour vous.";
    
    setMessages([...currentMessages, { role: 'model', content: response }]);
    
    if (voiceAgent.isActive) {
      await speakWithElevenLabs(response);
    }
    
    setSchedulingState(prev => ({
      ...prev,
      isActive: true
    }));
  };

  // Handle lead submission to Google Sheets and optional meeting booking
  const handleLeadSubmission = async (name: string, email: string, message: string, meetingDate?: string, meetingTime?: string) => {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // First, save lead to Google Sheets
      const sheetsResponse = await fetch('/api/sheets/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          sessionId,
          leadScore: 75 // Default lead score
        }),
      });

      if (!sheetsResponse.ok) {
        throw new Error('Failed to submit lead to Google Sheets');
      }

      let successMessage = "Thank you! I've received your information and will get back to you within 24 hours to schedule your consultation.";
      let meetingDetails = null;

      // Send lead notification email even if no meeting is booked
      if (!meetingDate || !meetingTime) {
        try {
          const emailResponse = await fetch('/api/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userName: name,
              userEmail: email,
              ownerEmail: 'snazzy.mugi@gmail.com',
              meetingDetails: `Lead inquiry: ${message || 'No specific message provided'}`
            }),
          });

          if (emailResponse.ok) {
            console.log('✅ Lead notification email sent successfully');
          } else {
            console.error('❌ Lead notification email failed');
          }
        } catch (emailError) {
          console.error('❌ Error sending lead notification email:', emailError);
        }
      }

      // If meeting date and time are provided, create calendar event
      if (meetingDate && meetingTime) {
        try {
          const startDateTime = new Date(`${meetingDate}T${meetingTime}:00`);
          const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 minutes duration

          // Final availability check before creating event
          console.log('🔍 Final availability check before booking...');
          const finalCheckResponse = await fetch('/api/calendar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'checkAvailability',
              date: meetingDate,
              time: meetingTime,
              duration: 30
            })
          });

          const finalCheckResult = await finalCheckResponse.json();
          if (!finalCheckResult.success || !finalCheckResult.isAvailable) {
            throw new Error(`Time slot ${meetingTime} on ${meetingDate} is no longer available`);
          }

          console.log('✅ Time slot confirmed available, creating event...');
          const calendarResponse = await fetch('/api/calendar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'createEvent',
              eventData: {
                summary: 'CognivexAI Consultation',
                description: `Consultation meeting with ${name}\n\nEmail: ${email}\nProject: ${message || 'Not specified'}\n\nMeeting created by CognivexAI Chatbot`,
                start: {
                  dateTime: startDateTime.toISOString(),
                  timeZone: 'UTC'
                },
                end: {
                  dateTime: endDateTime.toISOString(),
                  timeZone: 'UTC'
                }
              }
            }),
          });

          if (calendarResponse.ok) {
            const calendarResult = await calendarResponse.json();
            meetingDetails = {
              date: meetingDate,
              time: meetingTime,
              meetingLink: calendarResult.meetingLink || 'Meeting link will be provided'
            };
            
            // Send confirmation emails
            try {
              const emailResponse = await fetch('/api/email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userName: name,
                  userEmail: email,
                  ownerEmail: 'snazzy.mugi@gmail.com',
                  meetingDetails: meetingDetails
                }),
              });

              if (emailResponse.ok) {
                console.log('✅ Confirmation emails sent successfully');
                successMessage = `Perfect! I've scheduled your consultation for ${meetingDate} at ${meetingTime}. You'll receive a confirmation email with the meeting link shortly.`;
              } else {
                console.error('❌ Email sending failed');
                successMessage = `Perfect! I've scheduled your consultation for ${meetingDate} at ${meetingTime}. Please check your email for the meeting link.`;
              }
            } catch (emailError) {
              console.error('❌ Error sending emails:', emailError);
              successMessage = `Perfect! I've scheduled your consultation for ${meetingDate} at ${meetingTime}. Please check your email for the meeting link.`;
            }
          } else {
            console.error('Calendar booking failed, but lead was saved');
            successMessage = "Thank you! I've received your information. I'll get back to you within 24 hours to confirm the meeting time.";
          }
        } catch (calendarError) {
          console.error('Error creating calendar event:', calendarError);
          successMessage = "Thank you! I've received your information. I'll get back to you within 24 hours to confirm the meeting time.";
        }
      }

      setMessages(prev => [...prev, { role: 'model', content: successMessage }]);
      
      if (voiceAgent.isActive) {
        await speakWithElevenLabs(successMessage);
      }
      
      // Reset scheduling state
    setSchedulingState(prev => ({
      ...prev,
        isActive: false,
        userInfo: { name: '', email: '' }
      }));

    } catch (error) {
      console.error('Error submitting lead:', error);
      const errorMessage = "I apologize, but there was an issue submitting your information. Please try again or contact us directly at snazzy.mugi@gmail.com";
      setMessages(prev => [...prev, { role: 'model', content: errorMessage }]);
      
      if (voiceAgent.isActive) {
        await speakWithElevenLabs(errorMessage);
      }
    }
  };

  // Handle general conversation with RAG system
  const handleGeneralConversation = async (message: string, conversationHistory?: ChatMessage[]): Promise<string> => {
    const lowerMessage = message.toLowerCase();
    
    // Handle greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm Zephyr, your AI assistant from CognivexAI. I'm here to help you learn about our AI solutions, answer your questions, and assist with scheduling consultations. How can I help you today?";
    }
    
    // Handle case study requests
    if (lowerMessage.includes('case study') || lowerMessage.includes('case studies') || lowerMessage.includes('show me your') || lowerMessage.includes('projects') || lowerMessage.includes('portfolio') || lowerMessage.includes('data analysis') || lowerMessage.includes('startup journey') || lowerMessage.includes('automation') || lowerMessage.includes('ai solutions') || lowerMessage.includes('admin panel') || lowerMessage.includes('cms') || lowerMessage.includes('story spark')) {
      openCaseStudyBrowser();
      return "Here are our categorized projects! Explore our portfolio organized by Web Development, AI & Automation, and Data Analysis. Each project showcases our expertise in creating innovative solutions with detailed features and capabilities.";
    }
    
    // Use RAG system for intelligent responses with conversation context
    try {
      // Search the knowledge base with conversation history
      const searchResults = ragSystem.search(message, conversationHistory);
      
      if (searchResults.length > 0) {
        // Generate comprehensive response using RAG with conversation context
        const ragResponse = ragSystem.generateResponse(message, searchResults, conversationHistory);
        
        // Format the response with sources and actions
        let response = ragResponse.answer;
        
        // Add suggested actions if available
        if (ragResponse.suggestedActions && ragResponse.suggestedActions.length > 0) {
          response += "\n\n💡 I can also help you with:";
          ragResponse.suggestedActions.slice(0, 3).forEach(action => {
            response += `\n• ${action}`;
          });
        }
        
        // Add confidence indicator for transparency
        if (ragResponse.confidence > 0.7) {
          response += `\n\n✅ Confidence: ${Math.round(ragResponse.confidence * 100)}%`;
        }
        
        return response;
      }
    } catch (error) {
      console.error('RAG system error:', error);
    }
    
    // Fallback responses for common queries
    if (lowerMessage.includes('services') || lowerMessage.includes('what do you do') || lowerMessage.includes('cognivex')) {
      return "CognivexAI - Premier AI Solutions Partner\n\n📊 Data Analysis\n   • Automated insights & reporting\n   • Business intelligence dashboards\n   • Predictive analytics\n\n🤖 AI Chatbots\n   • 24/7 intelligent support\n   • Lead qualification & booking\n   • CRM integration\n\n🌐 AI-Enhanced Websites\n   • Modern responsive design\n   • AI personalization\n   • Chatbot integration\n\n💎 Success Metrics\n   • 40% cost reduction\n   • 3x faster decisions\n   • 95% accuracy\n\nWhich service interests you most?";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
      return "You can reach us at snazzy.mugi@gmail.com or schedule a call through me. Would you like me to help you book a consultation?";
    }
    
    if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      return "For pricing information, please contact us directly. We provide personalized quotes based on your specific needs. Would you like me to help you schedule a consultation?";
    }
    
    if (lowerMessage.includes('team') || lowerMessage.includes('expert') || lowerMessage.includes('experience')) {
      return "Our team consists of 25-50 highly skilled professionals with 5-15 years of average experience. We have experts in Machine Learning, Data Science, Full-Stack Development, DevOps, and AI Consulting. Our team holds certifications from AWS, Google Cloud, Microsoft Azure, and other leading technology providers. We're located in San Francisco, New York, Austin, and have remote team members worldwide.";
    }
    
    if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('stack')) {
      return "We use cutting-edge technologies including:\n\n🤖 AI/ML: TensorFlow, PyTorch, OpenAI GPT, Google BERT\n🌐 Frontend: React, Next.js, Vue.js, TypeScript\n⚙️ Backend: Node.js, Python, Django, FastAPI\n☁️ Cloud: AWS, Google Cloud, Azure, Docker, Kubernetes\n💾 Databases: PostgreSQL, MongoDB, Redis, Elasticsearch\n\nWould you like to know more about any specific technology or how we use it in our solutions?";
    }
    
    if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('case study')) {
      return "We've successfully completed 150+ AI projects across various industries. Some notable examples include:\n\n🏥 Healthcare: AI diagnostic system with 94% accuracy\n🛒 E-commerce: Personalization platform with 35% conversion increase\n💳 Finance: Risk assessment system with 98% fraud detection\n\nWould you like me to share more details about any specific project or industry?";
    }
    
    // Default response for unrecognized queries
    return "That's an interesting question! I'd be happy to help you with that. You can ask me about:\n\n• Our AI services and solutions\n• Pricing and packages\n• Technology stack and expertise\n• Our projects and portfolio\n• Team and company information\n• Scheduling a consultation\n\nWhat would you like to know more about?";
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
      const welcomeMessage = true
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
      setInput(''); // Clear the input after setting the message
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
            
            {/* Dynamic Quick Actions */}
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
                  onClick={() => handleActionClick("Tell me about your services")}
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Services
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-3 bg-gray-800/50 border-gray-600 hover:bg-orange-500/20 hover:border-orange-500/50 text-gray-300 hover:text-orange-300"
                  onClick={() => handleActionClick("What is your pricing?")}
                >
                  Get Quote
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-3 bg-orange-500/30 border-orange-400/60 hover:bg-orange-500/40 hover:border-orange-400 text-orange-200 hover:text-orange-100 shadow-lg shadow-orange-500/20 animate-pulse"
                  onClick={() => handleActionClick("Show me your projects")}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Our Projects
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
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className="absolute bottom-12 md:bottom-20 right-0 bg-black/90 backdrop-blur-sm rounded-lg px-2 md:px-3 py-1.5 md:py-2 border-2 border-orange-400/60 shadow-lg animate-in slide-in-from-bottom-2 duration-300 cursor-pointer hover:bg-black/95 hover:border-orange-400/80 transition-all duration-200"
          >
            <p className="text-white text-xs md:text-sm font-medium whitespace-nowrap">
              Zephyr Here!
            </p>
            <div className="absolute top-full right-3 md:right-4 w-2 h-2 bg-black/90 border-r-2 border-b-2 border-orange-400/60 transform rotate-45"></div>
          </div>
        )}
        
        <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="rounded-full h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 shadow-lg flex items-center justify-center bg-black hover:bg-gray-800">
          {isOpen ? <X className="h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9 text-white" /> : <AnimatedLogo className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />}
          <span className="sr-only">{isOpen ? 'Close chat' : 'Open chat'}</span>
        </Button>
      </div>
      
      {isOpen && (
        <Card className={`fixed bottom-20 right-3 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-3rem)] md:w-96 h-[calc(100vh-6rem)] sm:h-96 md:h-[500px] flex flex-col rounded-2xl animate-in slide-in-from-bottom-10 fade-in-50 duration-300 transition-all duration-500 ${
          voiceAgent.isActive 
            ? 'ring-4 ring-orange-500/50 shadow-2xl shadow-orange-500/25 bg-gradient-to-br from-gray-900/95 to-gray-800/95' 
            : 'bg-black/90 backdrop-blur-lg border border-gray-700/50 shadow-2xl'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between p-2 sm:p-3 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8 bg-gradient-to-r from-orange-500 to-orange-600">
                <AvatarFallback className="text-white font-semibold">Z</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="font-headline text-base text-white">Zephyr AI</CardTitle>
                <p className="text-xs text-orange-300">CognivexAI Powered</p>
              </div>
            </div>
            
            {/* Voice Agent Controls - Hidden for now */}
            <div className="flex items-center space-x-2">
              {/* Voice button hidden for now */}
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
          
          <div className="flex-1 p-2 sm:p-3 overflow-y-auto" ref={scrollAreaRef}>
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
                      <span className="text-sm text-gray-300">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Booking Form */}
              {schedulingState.isActive && (
                <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-orange-400" />
                    <h3 className="text-sm font-semibold text-orange-300">Schedule Consultation</h3>
                  </div>
                  <p className="text-xs text-gray-300 mb-4">
                    Please provide your details and I'll get back to you within 24 hours to schedule your consultation.
                  </p>
                  
                  <BookingForm 
                    onSubmit={handleLeadSubmission}
                    onCancel={() => setSchedulingState(prev => ({ ...prev, isActive: false }))}
                  />
                </div>
              )}
            </div>
          </div>
          

          
          <CardFooter className="p-3 border-t border-gray-700/50">
            <form onSubmit={handleSendMessage} data-chatbot-form="true" className="flex w-full items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
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
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      {/* Case Study Browser */}
      {caseStudyBrowser.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-6xl h-[95dvh] sm:h-[90dvh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg backdrop-blur-sm">
                  <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Our Projects</h2>
                  <p className="text-xs text-gray-300">Explore our portfolio of innovative solutions</p>
                </div>
              </div>
              <Button
                onClick={closeCaseStudyBrowser}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 flex min-h-0">
              {/* Project List */}
              <div className="w-32 sm:w-48 md:w-64 lg:w-72 border-r border-white/10 p-1.5 sm:p-2 md:p-3 overflow-y-auto">
                <div className="space-y-2 sm:space-y-3">
                  {caseStudyCategories.map((category) => (
                    <div key={category.title} className="space-y-1 sm:space-y-2">
                      <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                        {category.title}
                      </h3>
                      <div className="space-y-1">
                        {category.projects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => selectCaseStudy(project.id)}
                            className={`w-full text-left p-1 sm:p-1.5 md:p-2 rounded-lg border transition-all duration-300 backdrop-blur-sm ${
                              caseStudyBrowser.selectedProject === project.id
                                ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 shadow-lg shadow-orange-500/20'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-300 hover:text-white'
                            }`}
                          >
                            <div className="text-xs font-medium mb-0.5 sm:mb-1">{project.name}</div>
                            <div className="text-xs text-gray-400 mb-0.5 sm:mb-1 line-clamp-1 sm:line-clamp-2">{project.description}</div>
                            <div className="flex flex-wrap gap-0.5 sm:gap-1">
                              {project.features.slice(0, 2).map((feature, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-0.5 sm:px-1 md:px-1.5 py-0.5 bg-white/10 rounded-full text-gray-300"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browser */}
              <div className="flex-1 flex flex-col p-2 sm:p-3">
                {caseStudyBrowser.selectedProject ? (
                  <div className="flex-1 relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 bg-white overflow-hidden rounded-xl">
                      {(() => {
                        // Find project across all categories
                        let project = null;
                        for (const category of caseStudyCategories) {
                          project = category.projects.find(p => p.id === caseStudyBrowser.selectedProject);
                          if (project) break;
                        }
                        
                        if (!project) return null;
                        
                        if (project.type === 'pdf') {
                          return (
                            <iframe
                              src={`${project.url}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                              className="w-full h-full border-0"
                              title="PDF Viewer"
                              loading="lazy"
                              style={{
                                transform: 'scale(1)',
                                transformOrigin: 'top left',
                                width: '100%',
                                height: '100%'
                              }}
                            />
                          );
                        } else if (project.type === 'video') {
                          return (
                            <video
                              src={caseStudyBrowser.currentUrl || ''}
                              className="w-full h-full object-contain bg-black"
                              controls
                              preload="metadata"
                            >
                              Your browser does not support the video tag.
                            </video>
                          );
                        } else if (project.type === 'external') {
                          return (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                              <div className="text-center p-8">
                                <div className="mb-4">
                                  <ExternalLink className="h-16 w-16 mx-auto text-orange-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">External Website</h3>
                                <p className="text-gray-600 mb-4">This website cannot be embedded due to security restrictions.</p>
                                <a
                                  href={caseStudyBrowser.currentUrl || ''}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Open in New Tab
                                </a>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="w-full h-full overflow-hidden">
                              <iframe
                                src={caseStudyBrowser.currentUrl || ''}
                                className="w-full h-full border-0"
                                title="Case Study Browser"
                                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                style={{
                                  transform: 'scale(0.75)',
                                  transformOrigin: 'top left',
                                  width: '133.33%',
                                  height: '133.33%',
                                  overflow: 'hidden'
                                }}
                              />
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="text-center">
                      <div className="p-3 bg-orange-500/20 rounded-full mb-3 backdrop-blur-sm">
                        <Monitor className="h-8 w-8 mx-auto text-orange-400" />
                      </div>
                      <h3 className="text-base font-medium text-white mb-1">Select a Project</h3>
                      <p className="text-xs text-gray-300">Choose from our categorized portfolio to view detailed projects</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
