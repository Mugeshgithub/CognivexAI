import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, messages, timestamp } = body;

    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'data', 'chatbackups');
    await fs.mkdir(backupDir, { recursive: true });

    // Create backup file with session ID
    const backupFile = path.join(backupDir, `chat_${sessionId}_${timestamp}.json`);
    
    const backupData = {
      sessionId,
      messages,
      timestamp,
      createdAt: new Date().toISOString()
    };

    // Write backup to file
    await fs.writeFile(backupFile, JSON.stringify(backupData, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Chat backup saved successfully',
      sessionId 
    });

  } catch (error) {
    console.error('Chat backup error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to backup chat' },
      { status: 500 }
    );
  }
} 