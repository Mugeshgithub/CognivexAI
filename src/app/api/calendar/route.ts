import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import path from 'path';
import fs from 'fs/promises';

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
      scopes: ['https://www.googleapis.com/auth/calendar']
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
    const { action, date, time, duration = 30, eventData } = body;

    console.log('📅 Calendar API called:', { action, date, time, duration });

    const calendarInstance = await initializeCalendar();
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'snazzy.mugi@gmail.com';

    switch (action) {
      case 'checkAvailability':
        try {
          // Check for existing events at the requested time
          const startTime = new Date(`${date}T${time}:00`);
          const endTime = new Date(startTime.getTime() + duration * 60000);

          const response = await calendarInstance.events.list({
            calendarId,
            timeMin: startTime.toISOString(),
            timeMax: endTime.toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
          });

          const isAvailable = response.data.items?.length === 0;
          
          console.log('📅 Real availability check:', { date, time, isAvailable });
          return NextResponse.json({ success: true, isAvailable });
        } catch (error) {
          console.error('❌ Availability check failed:', error);
          return NextResponse.json({ success: false, error: 'Availability check failed' }, { status: 500 });
        }

      case 'createEvent':
        try {
          if (!eventData) {
            return NextResponse.json({ success: false, error: 'Event data required' }, { status: 400 });
          }

          // Create the calendar event
          const event = await calendarInstance.events.insert({
            calendarId,
            requestBody: {
              summary: eventData.summary,
              description: eventData.description,
              start: eventData.start,
              end: eventData.end
              // Removed attendees and conferenceData to avoid domain delegation issues
            }
          });

          const eventId = event.data.id;
          const meetingLink = event.data.hangoutLink || 'Meeting link will be provided';

          console.log('📅 Real event created:', { eventId, meetingLink });

          // Send confirmation emails directly using existing EmailJS setup
          const meetingDetails = {
            date: eventData.start.dateTime.split('T')[0],
            time: eventData.start.dateTime.split('T')[1].substring(0, 5),
            timezone: eventData.start.timeZone,
            meetingLink
          };

          // Log email details for manual sending (since server-side EmailJS is complex)
          console.log('📧 Email to user:', {
            to: 'user@example.com', // Placeholder since attendees removed
            subject: 'Meeting Confirmation - CognivexAI',
            body: `Hi there,\n\nYour meeting has been scheduled for ${meetingDetails.date} at ${meetingDetails.time} ${meetingDetails.timezone}.\n\nMeeting Link: ${meetingDetails.meetingLink}\n\nBest regards,\nCognivexAI Team`
          });

          console.log('📧 Email to owner:', {
            to: process.env.GOOGLE_CALENDAR_ID || 'snazzy.mugi@gmail.com',
            subject: 'New Meeting Scheduled',
            body: `A new meeting has been scheduled for ${meetingDetails.date} at ${meetingDetails.time} ${meetingDetails.timezone}.\n\nMeeting Link: ${meetingDetails.meetingLink}`
          });

          console.log('✅ Email details logged (use existing EmailJS in chatbot for real emails)');

          return NextResponse.json({ 
            success: true, 
            eventId, 
            meetingLink 
          });
        } catch (error) {
          console.error('❌ Event creation failed:', error);
          return NextResponse.json({ success: false, error: 'Event creation failed' }, { status: 500 });
        }

      case 'findAlternatives':
        try {
          const alternatives = [];
          const baseHour = parseInt(time.split(':')[0]);
          
          for (let i = 1; i <= 3; i++) {
            const alternativeHour = baseHour + i;
            if (alternativeHour >= 9 && alternativeHour < 17) {
              const alternativeTime = `${alternativeHour}:00`;
              const startTime = new Date(`${date}T${alternativeTime}:00`);
              const endTime = new Date(startTime.getTime() + duration * 60000);

              const response = await calendarInstance.events.list({
                calendarId,
                timeMin: startTime.toISOString(),
                timeMax: endTime.toISOString(),
                singleEvents: true
              });

              alternatives.push({
                startTime: alternativeTime,
                endTime: `${alternativeHour + 0.5}:00`,
                available: response.data.items?.length === 0
              });
            }
          }
          
          console.log('📅 Real alternative slots:', alternatives);
          return NextResponse.json({ success: true, alternatives });
        } catch (error) {
          console.error('❌ Alternative slots check failed:', error);
          return NextResponse.json({ success: false, error: 'Alternative slots check failed' }, { status: 500 });
        }

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Calendar API error:', error);
    return NextResponse.json({ success: false, error: 'Calendar operation failed' }, { status: 500 });
  }
} 