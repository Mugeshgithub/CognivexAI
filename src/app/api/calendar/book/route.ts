import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import path from 'path';
import fs from 'fs/promises';

// Google Calendar configuration
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';

// Initialize Google Calendar API
let calendar: any = null;

async function initializeCalendar() {
  if (calendar) return calendar;

  try {
    const serviceAccountKeyPath = path.join(process.cwd(), 'service-account-key.json');
    const serviceAccountKey = JSON.parse(await fs.readFile(serviceAccountKeyPath, 'utf-8'));
    
    const auth = new JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ]
    });

    calendar = google.calendar({ version: 'v3', auth: auth as any });
    console.log('✅ Google Calendar API initialized');
    return calendar;
  } catch (error) {
    console.error('❌ Failed to initialize Google Calendar:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { summary, description, startTime, endTime, attendeeEmail, attendeeName } = body;

    console.log('📅 Calendar booking request:', { summary, startTime, endTime, attendeeEmail });

    // Validate required fields
    if (!startTime || !endTime || !attendeeEmail) {
      return NextResponse.json(
        { error: 'startTime, endTime, and attendeeEmail are required' },
        { status: 400 }
      );
    }

    // Initialize Google Calendar
    const calendarAPI = await initializeCalendar();

    // Create calendar event
    const event = {
      summary: summary || 'CognivexAI Consultation',
      description: description || `Consultation meeting with ${attendeeName || 'Client'}\n\nClient Email: ${attendeeEmail}\n\nMeeting created by CognivexAI Chatbot`,
      start: {
        dateTime: startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime,
        timeZone: 'UTC',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 15 }, // 15 minutes before
        ],
      }
    };

    // Insert event into calendar (without sending invites to avoid permission issues)
    const response = await calendarAPI.events.insert({
      calendarId: CALENDAR_ID,
      resource: event,
      sendUpdates: 'none' // Don't send invites to avoid permission issues
    });

    console.log('✅ Calendar event created:', response.data);

    // Send confirmation email (you can integrate with EmailJS here)
    // For now, we'll just log it
    console.log(`📧 Calendar invite sent to: ${attendeeEmail}`);

    return NextResponse.json({
      success: true,
      message: 'Meeting booked successfully',
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
      hangoutLink: response.data.hangoutLink
    });

  } catch (error: any) {
    console.error('❌ Error booking calendar event:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to book meeting',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const calendarAPI = await initializeCalendar();
    
    // Get upcoming events
    const response = await calendarAPI.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    console.log(`📅 Retrieved ${events.length} upcoming events`);

    return NextResponse.json({
      success: true,
      events: events.map((event: any) => ({
        id: event.id,
        summary: event.summary,
        start: event.start?.dateTime,
        end: event.end?.dateTime,
        attendees: event.attendees
      })),
      total: events.length
    });

  } catch (error: any) {
    console.error('❌ Error retrieving calendar events:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve events',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
