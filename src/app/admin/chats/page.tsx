'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, MessageCircle, Calendar, User } from 'lucide-react';

interface ChatSession {
  sessionId: string;
  timestamp: number;
  lastActivity: string;
  messageCount?: number;
  userAgent?: string;
  ipAddress?: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp?: number;
}

interface FullSession {
  sessionId: string;
  messages: ChatMessage[];
  timestamp: number;
  userAgent?: string;
  ipAddress?: string;
  lastActivity: string;
}

export default function AdminChats() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<FullSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      // TODO: Implement this endpoint when needed for server-side message storage
      // const response = await fetch('/api/chat/store');
      // const data = await response.json();
      // setSessions(data.sessions || []);
      setSessions([]); // Empty for now
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      // TODO: Implement this endpoint when needed for server-side message storage
      // const response = await fetch(`/api/chat/store?sessionId=${sessionId}`);
      // const sessionData = await response.json();
      // setSelectedSession(sessionData);
      setSelectedSession(null); // No session data for now
    } catch (error) {
      console.error('Failed to fetch session details:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getMessageCount = (sessionId: string) => {
    return selectedSession?.sessionId === sessionId 
      ? selectedSession.messages.length 
      : '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">Loading chat sessions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Chat Sessions</h1>
          <p className="text-gray-400">View all user conversations with your chatbot</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Recent Sessions ({sessions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div
                        key={session.sessionId}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedSession?.sessionId === session.sessionId
                            ? 'bg-orange-500/20 border-orange-500/50'
                            : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                        }`}
                        onClick={() => fetchSessionDetails(session.sessionId)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {session.sessionId.slice(-8)}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {getMessageCount(session.sessionId)} messages
                          </span>
                        </div>
                        <div className="text-sm text-gray-300 mb-1">
                          {formatDate(session.timestamp)}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {session.userAgent || 'Unknown browser'}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Details */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {selectedSession ? `Session: ${selectedSession.sessionId.slice(-8)}` : 'Select a session'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSession ? (
                  <div className="space-y-4">
                    {/* Session Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <div className="text-xs text-gray-400">Started</div>
                        <div className="text-sm text-white">{formatDate(selectedSession.timestamp)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Last Activity</div>
                        <div className="text-sm text-white">{formatDate(new Date(selectedSession.lastActivity).getTime())}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Messages</div>
                        <div className="text-sm text-white">{selectedSession.messages.length}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Browser</div>
                        <div className="text-sm text-white truncate">{selectedSession.userAgent || 'Unknown'}</div>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {selectedSession.messages.map((message, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg ${
                              message.role === 'user'
                                ? 'bg-orange-500/20 border border-orange-500/30'
                                : 'bg-gray-700/50 border border-gray-600'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={message.role === 'user' ? 'default' : 'secondary'}>
                                {message.role === 'user' ? 'User' : 'Zephyr'}
                              </Badge>
                              {message.timestamp && (
                                <span className="text-xs text-gray-400">
                                  {formatDate(message.timestamp)}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-200 whitespace-pre-wrap">
                              {message.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    Select a session to view the conversation
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 