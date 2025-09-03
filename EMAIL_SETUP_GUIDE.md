# Email Setup Guide - Current Status

## Current Issues

### EmailJS Status: ❌ NOT WORKING
- **Error**: "The public key is required. Visit https://dashboard.emailjs.com/admin/account"
- **Root Cause**: The public key `kQstM3WBDnmKYq3oz` is invalid/expired
- **Solution**: 
  1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/admin/account)
  2. Get your current public key
  3. Update `.env.local` with the new key

### Nodemailer Status: ❌ NOT WORKING  
- **Error**: "Invalid login: 535-5.7.8 Username and Password not accepted"
- **Root Cause**: Missing Gmail App Password setup
- **Solution**: Set up Gmail App Password (see below)

## Immediate Fix: Gmail App Password Setup

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to [Google Account Security](https://myaccount.google.com/apppasswords)
2. Select "Mail" as the app
3. Select "Other (Custom name)" as device
4. Enter "CognivexAI" as the name
5. Click "Generate"
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables
Add these to your `.env.local` file:
```bash
GMAIL_USER=snazzy.mugi@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

### Step 4: Restart the Application
```bash
npm run dev
```

## Testing Email Functionality

After setting up Gmail App Password, test with:
```bash
curl -X POST http://localhost:9002/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "userName": "Test User", 
    "meetingDetails": {
      "date": "tomorrow",
      "time": "2:30 PM",
      "timezone": "IST",
      "meetingLink": "https://meet.google.com/test"
    }
  }'
```

## Expected Response
```json
{
  "success": true,
  "message": "Confirmation emails sent successfully via nodemailer fallback",
  "nodemailerSuccess": true
}
```

## Next Steps
1. **Immediate**: Set up Gmail App Password for Nodemailer fallback
2. **Later**: Fix EmailJS by getting new public key from dashboard
3. **Test**: Verify both email systems work for booking confirmations

## Current Email Flow
1. User books appointment via chatbot
2. SmartScheduler processes request and returns `triggerEmailJS` flag
3. Chat API calls `/api/email` endpoint
4. Email API tries EmailJS first (currently failing)
5. Falls back to Nodemailer (currently failing due to missing credentials)
6. If both fail, logs email details for manual sending

## Files Involved
- `app/api/email/route.ts` - Email sending logic
- `app/api/chat/route.ts` - Chatbot and email triggering
- `app/lib/smart-scheduler.ts` - Scheduling processing
- `.env.local` - Environment variables 