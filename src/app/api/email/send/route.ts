import { NextRequest, NextResponse } from 'next/server';

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      to_email, 
      to_name, 
      subject, 
      body: emailBody,
      email_type 
    } = body;

    console.log('📧 Sending email via EmailJS:', { email_type, to_email, to_name });

    // Validate required fields
    if (!to_email || !subject || !emailBody) {
      return NextResponse.json(
        { error: 'to_email, subject, and body are required' },
        { status: 400 }
      );
    }

    // Validate EmailJS credentials
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'EmailJS credentials not configured' },
        { status: 500 }
      );
    }

          // Send email using EmailJS with correct parameter names from docs
      const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          accessToken: EMAILJS_PRIVATE_KEY, // Changed from private_key to accessToken
          template_params: {
            to_email: to_email,
            to_name: to_name || 'there',
            subject: subject,
            message: emailBody,
            company_name: 'CognivexAI',
            contact_email: 'snazzy.mugi@gmail.com'
          }
        })
      });

    if (emailjsResponse.ok) {
      console.log(`✅ Email sent successfully via EmailJS: ${email_type} to ${to_email}`);
      
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully via EmailJS',
        email_type,
        recipient: to_email,
        subject,
        emailjs_status: 'success'
      });
    } else {
      const errorText = await emailjsResponse.text();
      console.error('❌ EmailJS error:', errorText);
      throw new Error(`EmailJS failed: ${errorText}`);
    }

  } catch (error: any) {
    console.error('❌ Error sending email via EmailJS:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send email via EmailJS',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
