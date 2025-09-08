import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userEmail, 
      userName, 
      meetingDetails, 
      ownerEmail = 'snazzy.mugi@gmail.com' 
    } = body;

    console.log('📧 Email API called:', { userEmail, userName, meetingDetails });

    // EmailJS configuration
    const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_af5vxka';
    const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_1csll1o';
    const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'COtKbmSCzdpiCZDwB';
    const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

    console.log('🔧 EmailJS Configuration:', { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY });
    console.log('🔑 Private Key Status:', EMAILJS_PRIVATE_KEY ? 'Set' : 'NOT SET - This will cause 403 errors!');

    try {
      // Send email to user
      const userMessage = typeof meetingDetails === 'string' ? meetingDetails : 
        `Meeting scheduled for ${meetingDetails.date} at ${meetingDetails.time} ${meetingDetails.timezone || 'UTC'}. Meeting Link: ${meetingDetails.meetingLink || 'TBD'}`;

      const userTemplateParams = {
        to_name: userName,
        to_email: userEmail,
        from_name: 'CognivexAI Team',
        from_email: 'snazzy.mugi@gmail.com',
        message: userMessage,
        time: new Date().toLocaleString(),
        subject: 'Meeting Confirmation - CognivexAI'
      };

      console.log('📤 Sending user email with params:', userTemplateParams);
      console.log('📤 EmailJS request body:', JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: userTemplateParams
      }, null, 2));
      
      const userEmailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          accessToken: EMAILJS_PRIVATE_KEY,
          template_params: userTemplateParams
        })
      });

      let userEmailResult;
      const userResponseText = await userEmailResponse.text();
      try {
        userEmailResult = JSON.parse(userResponseText);
      } catch (jsonError) {
        // EmailJS sometimes returns "OK" as plain text
        userEmailResult = { status: userEmailResponse.status, text: userResponseText };
      }
      console.log('✅ User email result:', userEmailResult);
      console.log('✅ User email response status:', userEmailResponse.status);
      console.log('✅ User email response text:', userResponseText);

      // Send email to owner
      const ownerMessage = `New ${typeof meetingDetails === 'string' ? 'lead inquiry' : 'meeting scheduled'} with ${userName} (${userEmail}) for ${typeof meetingDetails === 'string' ? 'contact form submission' : 
        `${meetingDetails.date} at ${meetingDetails.time} ${meetingDetails.timezone || 'UTC'}. Meeting Link: ${meetingDetails.meetingLink || 'TBD'}`}`;

      const ownerTemplateParams = {
        to_name: 'CognivexAI Team',
        to_email: ownerEmail,
        from_name: 'CognivexAI System',
        from_email: 'snazzy.mugi@gmail.com',
        message: ownerMessage,
        time: new Date().toLocaleString(),
        subject: 'New Lead/Meeting Notification - CognivexAI'
      };

      console.log('📤 Sending owner email with params:', ownerTemplateParams);
      
      const ownerEmailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          accessToken: EMAILJS_PRIVATE_KEY,
          template_params: ownerTemplateParams
        })
      });

      let ownerEmailResult;
      const ownerResponseText = await ownerEmailResponse.text();
      try {
        ownerEmailResult = JSON.parse(ownerResponseText);
      } catch (jsonError) {
        // EmailJS sometimes returns "OK" as plain text
        ownerEmailResult = { status: ownerEmailResponse.status, text: ownerResponseText };
      }
      console.log('✅ Owner email result:', ownerEmailResult);

      return NextResponse.json({
        success: true,
        message: 'Confirmation emails sent successfully via EmailJS',
        userEmail: userEmailResult,
        ownerEmail: ownerEmailResult
      });

    } catch (emailError) {
      console.error('❌ EmailJS sending failed:', emailError);
      return NextResponse.json({
        success: false,
        message: 'Failed to send emails via EmailJS',
        error: emailError instanceof Error ? emailError.message : String(emailError)
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error in email API:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process email request',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 