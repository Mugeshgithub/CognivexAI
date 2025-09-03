import { NextRequest, NextResponse } from 'next/server';
import emailjs from '@emailjs/browser';

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

    // Initialize EmailJS with the public key
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'COtKbmSCzdpiCZDwB';
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_af5vxka';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_1csll1o';

    console.log('🔧 EmailJS Configuration:', { publicKey, serviceId, templateId });

    try {
      // Send email to user
      const userTemplateParams = {
        name: userName,
        email: userEmail,
        message: typeof meetingDetails === 'string' ? meetingDetails : 
          `Meeting scheduled for ${meetingDetails.date} at ${meetingDetails.time} ${meetingDetails.timezone}. Meeting Link: ${meetingDetails.meetingLink || 'TBD'}`,
        time: new Date().toLocaleString()
      };

      console.log('📤 Sending user email with params:', userTemplateParams);
      
      const userEmailResult = await emailjs.send(
        serviceId,
        templateId,
        userTemplateParams,
        publicKey
      );

      console.log('✅ User email sent successfully:', userEmailResult);

      // Send email to owner
      const ownerTemplateParams = {
        name: 'CognivexAI Team',
        email: ownerEmail,
        message: `New meeting scheduled with ${userName} (${userEmail}) for ${typeof meetingDetails === 'string' ? 'contact form submission' : 
          `${meetingDetails.date} at ${meetingDetails.time} ${meetingDetails.timezone}. Meeting Link: ${meetingDetails.meetingLink || 'TBD'}`}`,
        time: new Date().toLocaleString()
      };

      console.log('📤 Sending owner email with params:', ownerTemplateParams);
      
      const ownerEmailResult = await emailjs.send(
        serviceId,
        templateId,
        ownerTemplateParams,
        publicKey
      );

      console.log('✅ Owner email sent successfully:', ownerEmailResult);

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