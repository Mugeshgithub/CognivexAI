import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const dataDir = path.join(process.cwd(), 'data', 'chats');
    
    // Check if data directory exists
    try {
      await fs.access(dataDir);
    } catch (error) {
      return NextResponse.json({ 
        sessions: [],
        message: 'No chat data found. Start chatting with the bot to see data here!'
      });
    }

    // Read sessions index
    const indexFile = path.join(dataDir, 'sessions_index.json');
    let sessionsIndex: { [key: string]: { timestamp: number; lastActivity: string } } = {};
    
    try {
      const indexData = await fs.readFile(indexFile, 'utf-8');
      sessionsIndex = JSON.parse(indexData);
    } catch (error) {
      return NextResponse.json({ 
        sessions: [],
        message: 'No chat sessions found yet.'
      });
    }

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

  } catch (error) {
    console.error('Admin chats API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve chat sessions' },
      { status: 500 }
    );
  }
} 