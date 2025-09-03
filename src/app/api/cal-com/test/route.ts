import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Simulate Cal.com webhook data
    const testPayload = {
      type: 'booking.created',
      title: 'AI Consultation',
      description: 'Test consultation booking',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // Tomorrow + 30 min
      attendees: [
        {
          name: 'Test User',
          email: 'test@example.com'
        }
      ],
      eventType: 'consultation',
      bookingId: 'test_booking_123',
      status: 'confirmed'
    };

    // Send to the actual webhook endpoint
    const webhookResponse = await fetch('http://localhost:9004/api/cal-com/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    const webhookResult = await webhookResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Test webhook sent successfully',
      testPayload,
      webhookResult
    });

  } catch (error) {
    console.error('❌ Test webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send test webhook' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Cal.com test endpoint',
    usage: 'POST to simulate a Cal.com webhook',
    example: {
      type: 'booking.created',
      title: 'AI Consultation',
      attendees: [{ name: 'Test User', email: 'test@example.com' }]
    }
  });
}
