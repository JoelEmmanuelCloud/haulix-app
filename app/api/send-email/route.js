// app/api/send-email/route.js (Next.js 15.4.6)

import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  try {
    // Parse form data using the Web API FormData
    const formData = await request.formData();

    // Extract form fields
    const to = formData.get('to');
    const cc = formData.get('cc') || '';
    const bcc = formData.get('bcc') || '';
    const subject = formData.get('subject');
    const message = formData.get('message') || '';

    // Validate required fields
    if (!to || !subject) {
      return NextResponse.json(
        { error: 'Recipient email and subject are required' },
        { status: 400 }
      );
    }

    // Validate SendGrid configuration
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
      console.error('Missing SendGrid configuration');
      return NextResponse.json(
        { error: 'Email service not configured properly' },
        { status: 500 }
      );
    }

    // Process attachments
    const attachments = [];
    const attachmentFiles = formData.getAll('attachments');
    
    console.log(`Processing ${attachmentFiles.length} attachment(s)`);
    
    if (attachmentFiles && attachmentFiles.length > 0) {
      for (const file of attachmentFiles) {
        // Check if file is valid and not empty
        if (file && file.size > 0 && file.name) {
          try {
            // Check file size (25MB limit for SendGrid)
            if (file.size > 25 * 1024 * 1024) {
              console.warn(`File ${file.name} is too large (${file.size} bytes). Skipping.`);
              continue;
            }
            
            // Convert file to buffer then to base64
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const content = buffer.toString('base64');
            
            attachments.push({
              content,
              filename: file.name,
              type: file.type || 'application/octet-stream',
              disposition: 'attachment',
            });
            
            console.log(`Successfully processed attachment: ${file.name} (${file.size} bytes)`);
          } catch (fileError) {
            console.error(`Error processing file ${file.name}:`, fileError);
            // Continue with other files even if one fails
          }
        }
      }
    }

    // Prepare email data
    const emailData = {
      to: to.trim(),
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: 'Haulix Delivery Support'
      },
      subject: subject.trim(),
      text: message || 'This email was sent from Haulix Admin Dashboard.',
    };

    // Create HTML content
    if (message && message.trim()) {
      emailData.html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #0891b2; margin: 0;">Haulix Delivery</h2>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="white-space: pre-wrap; font-family: Arial, sans-serif; margin: 0;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          </div>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong>Haulix Delivery Team</strong>
            </p>
          </div>
        </div>
      `;
    } else {
      emailData.html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #0891b2; margin: 0;">Haulix Delivery</h2>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p>This email was sent from Haulix Admin Dashboard.</p>
          </div>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong>Haulix Delivery Team</strong>
            </p>
          </div>
        </div>
      `;
    }

    // Add CC if provided
    if (cc && cc.trim()) {
      emailData.cc = cc.trim();
    }

    // Add BCC if provided
    if (bcc && bcc.trim()) {
      emailData.bcc = bcc.trim();
    }

    // Add attachments if any
    if (attachments.length > 0) {
      emailData.attachments = attachments;
      console.log(`Sending email with ${attachments.length} attachment(s)`);
    }

    // Send email via SendGrid
    console.log(`Sending email to: ${emailData.to}`);
    const response = await sgMail.send(emailData);
    console.log('Email sent successfully:', response[0].statusCode);

    return NextResponse.json(
      { 
        message: 'Email sent successfully',
        details: {
          to: emailData.to,
          subject: emailData.subject,
          attachments: attachments.length,
          messageId: response[0].headers['x-message-id']
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('SendGrid Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response?.body
    });
    
    // Handle specific SendGrid errors
    if (error.response && error.response.body && error.response.body.errors) {
      const sendGridError = error.response.body.errors[0];
      const errorMessage = sendGridError.message || 'Unknown SendGrid error';
      const errorCode = sendGridError.field || error.code || 'unknown';
      
      return NextResponse.json(
        { 
          error: `Email delivery failed: ${errorMessage}`,
          code: errorCode,
          details: sendGridError
        },
        { status: 400 }
      );
    }

    // Handle network or configuration errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Unable to connect to email service. Please check your internet connection.' },
        { status: 503 }
      );
    }

    // Handle authentication errors
    if (error.message && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Email service authentication failed. Please contact support.' },
        { status: 401 }
      );
    }

    // Generic error handling
    return NextResponse.json(
      { 
        error: 'Failed to send email. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send emails.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send emails.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send emails.' },
    { status: 405 }
  );
}

