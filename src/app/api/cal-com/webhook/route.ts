import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🎉 Cal.com webhook received:', body);

    // Extract booking information
    const {
      type,
      title,
      description,
      startTime,
      endTime,
      attendees,
      eventType,
      bookingId,
      status
    } = body;

    // Only process confirmed bookings
    if (status !== 'confirmed') {
      console.log('⏭️ Skipping non-confirmed booking:', status);
      return NextResponse.json({ success: true, message: 'Skipped non-confirmed booking' });
    }

    // Prepare data for n8n webhook
    const n8nPayload = {
      event: 'cal.com.booking.confirmed',
      booking: {
        id: bookingId,
        title,
        description,
        startTime,
        endTime,
        eventType,
        attendees: attendees?.map((a: any) => ({
          name: a.name,
          email: a.email
        }))
      },
      timestamp: new Date().toISOString(),
      source: 'cal.com'
    };

    // Send to n8n webhook (you'll need to configure this URL)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://mugesh1831.app.n8n.cloud/webhook/cal-com-booking';
    
    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(n8nPayload)
      });

      if (n8nResponse.ok) {
        console.log('✅ Successfully sent to n8n:', n8nResponse.status);
      } else {
        console.error('❌ Failed to send to n8n:', n8nResponse.status, n8nResponse.statusText);
      }
    } catch (n8nError) {
      console.error('❌ Error sending to n8n:', n8nError);
    }

    // Store booking in Firebase (optional)
    try {
      const firebaseResponse = await fetch('/api/users/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: attendees?.[0]?.name || 'Unknown',
          email: attendees?.[0]?.email || 'unknown@example.com',
          sessionId: `cal_com_${bookingId}`,
          messages: [{
            role: 'system',
            content: `Cal.com booking: ${title} on ${new Date(startTime).toLocaleDateString()}`
          }],
          leadScore: 95,
          interests: ['consultation', 'ai-services']
        })
      });

      if (firebaseResponse.ok) {
        console.log('✅ Booking stored in Firebase');
      } else {
        console.error('❌ Failed to store in Firebase:', firebaseResponse.status);
      }
    } catch (firebaseError) {
      console.error('❌ Error storing in Firebase:', firebaseError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      n8nSent: true,
      firebaseStored: true
    });

  } catch (error) {
    console.error('❌ Cal.com webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Cal.com webhook endpoint is active',
    status: 'ready'
  });
}
