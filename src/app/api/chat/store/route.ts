import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp?: number;
}

interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  timestamp: number;
  userAgent?: string;
  ipAddress?: string;
  lastActivity: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, messages, userAgent, ipAddress } = body;

    console.log('📝 Storing chat session:', sessionId);
    console.log('💬 Messages count:', messages.length);

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data', 'chats');
    await fs.mkdir(dataDir, { recursive: true });

    // Create or update session file
    const sessionFile = path.join(dataDir, `session_${sessionId}.json`);
    
    const sessionData: ChatSession = {
      sessionId,
      messages,
      timestamp: Date.now(),
      userAgent: userAgent || 'Unknown',
      ipAddress: ipAddress || 'Unknown',
      lastActivity: new Date().toISOString()
    };

    // Write session to file
    await fs.writeFile(sessionFile, JSON.stringify(sessionData, null, 2));

    // Update sessions index
    const indexFile = path.join(dataDir, 'sessions_index.json');
    let sessionsIndex: { [key: string]: { timestamp: number; lastActivity: string } } = {};
    
    try {
      const indexData = await fs.readFile(indexFile, 'utf-8');
      sessionsIndex = JSON.parse(indexData);
    } catch (error) {
      // Index file doesn't exist, create new one
      console.log('📁 Creating new sessions index file');
    }

    sessionsIndex[sessionId] = {
      timestamp: sessionData.timestamp,
      lastActivity: sessionData.lastActivity
    };

    await fs.writeFile(indexFile, JSON.stringify(sessionsIndex, null, 2));

    console.log('✅ Chat session saved successfully:', sessionId);

    return NextResponse.json({ 
      success: true, 
      message: 'Chat session saved successfully',
      sessionId 
    });

  } catch (error) {
    console.error('❌ Chat storage error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save chat session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    const dataDir = path.join(process.cwd(), 'data', 'chats');
    
    if (sessionId) {
      // Get specific session
      const sessionFile = path.join(dataDir, `session_${sessionId}.json`);
      const sessionData = await fs.readFile(sessionFile, 'utf-8');
      return NextResponse.json(JSON.parse(sessionData));
    } else {
      // Get all sessions
      const indexFile = path.join(dataDir, 'sessions_index.json');
      const indexData = await fs.readFile(indexFile, 'utf-8');
      const sessionsIndex = JSON.parse(indexData);
      
      // Get recent sessions (last 50)
      const recentSessions = Object.entries(sessionsIndex)
        .sort(([,a], [,b]) => {
          const aData = a as { timestamp: number };
          const bData = b as { timestamp: number };
          return bData.timestamp - aData.timestamp;
        })
        .slice(0, 50)
        .map(([id, data]) => ({ sessionId: id, ...(data as any) }));

      return NextResponse.json({ 
        sessions: recentSessions,
        message: `Found ${recentSessions.length} chat sessions`
      });
    }
  } catch (error) {
    console.error('❌ Chat retrieval error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve chat sessions' },
      { status: 500 }
    );
  }
} 