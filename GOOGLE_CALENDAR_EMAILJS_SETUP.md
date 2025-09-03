# 🚀 Google Calendar + EmailJS Integration Setup Guide

## 📋 Overview
This guide documents the complete setup for a working appointment booking system that:
- ✅ Books appointments in Google Calendar
- ✅ Sends confirmation emails via EmailJS
- ✅ Uses OAuth2 for Google Calendar access
- ✅ Integrates with a smart chatbot

## 🔧 What We Fixed

### 1. **Timezone Error**
- **Problem**: `RangeError: Invalid time zone specified: Europe/Paris`
- **Solution**: Changed timezone from `Europe/Paris` to `Asia/Kolkata` in `app/api/calendar/route.ts`
- **File**: `app/api/calendar/route.ts` line 6

### 2. **Google Calendar Authentication**
- **Problem**: Service account couldn't access personal Gmail calendar
- **Solution**: Implemented OAuth2 flow for personal Google account access
- **Files**: 
  - `app/api/google/connect/route.ts`
  - `app/api/google/callback/route.ts`

### 3. **EmailJS Integration**
- **Problem**: Emails weren't being sent after successful calendar booking
- **Solution**: Implemented client-side EmailJS triggering with `triggerEmailJS` flag
- **Files**: 
  - `src/components/chatbot.tsx`
  - `app/lib/smart-scheduler.ts`

## 🏗️ Architecture

### **Flow Diagram**
```
User Request → Smart Scheduler → Google Calendar API → Success → triggerEmailJS Flag → EmailJS → Confirmation Emails
```

### **Key Components**
1. **Smart Scheduler** (`app/lib/smart-scheduler.ts`)
   - Processes scheduling requests
   - Returns `triggerEmailJS` flag with email details
   
2. **Calendar API** (`app/api/calendar/route.ts`)
   - Handles Google Calendar operations
   - Uses OAuth2 for authentication
   
3. **Chatbot Component** (`src/components/chatbot.tsx`)
   - Triggers EmailJS when `triggerEmailJS` flag is set
   - Sends confirmation emails to user and owner

## 📁 Required Files & Configuration

### **Environment Variables** (`.env.local`)
```bash
# Google OAuth2
GOOGLE_OAUTH_CLIENT_ID=your_oauth_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_oauth_client_secret

# Google Calendar
GOOGLE_CALENDAR_ID=your_email@gmail.com
GOOGLE_SERVICE_ACCOUNT_KEY=service-account-key.json

# EmailJS
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### **Service Account Key**
- File: `service-account-key.json`
- Contains Google service account credentials
- Used as fallback if OAuth2 fails

### **EmailJS Configuration**
- **Service ID**: `service_af5vxka`
- **Template ID**: `template_1csll1o`
- **Public Key**: `kQstM3WBDnmKYq3oz`

## 🚀 Setup Instructions

### **Step 1: Environment Setup**
1. Create `.env.local` file with required variables
2. Place `service-account-key.json` in project root
3. Ensure all dependencies are installed: `npm install`

### **Step 2: Google OAuth2 Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth2 credentials
3. Set redirect URI: `http://localhost:9002/api/google/callback`
4. Enable Google Calendar API

### **Step 3: EmailJS Setup**
1. Create EmailJS account
2. Set up email service
3. Create email template with variables: `name`, `email`, `message`, `time`
4. Note down Service ID, Template ID, and Public Key

### **Step 4: Authentication Flow**
1. Start server: `npm run dev`
2. Visit: `http://localhost:9002/api/google/connect`
3. Grant calendar permissions
4. You'll be redirected back with refresh token

## 🔍 Testing

### **Test Calendar API**
```bash
curl -s "http://localhost:9002/api/calendar" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"action":"checkAvailability","date":"2025-01-20","time":"3:00 PM"}'
```

**Expected Response**: `{"success":true,"isAvailable":true}`

### **Test EmailJS**
1. Use the "🧪 Test EmailJS" button in the chatbot
2. Check console for success/error logs
3. Verify email is received

### **Test Full Flow**
1. Open chatbot at `http://localhost:9002`
2. Type: "Please book a call. My name is Mugesh, email snazzy.mugi@gmail.com, for tomorrow at 3 PM IST to discuss our AI chatbot services."
3. Verify:
   - ✅ Calendar event created
   - ✅ Confirmation emails sent
   - ✅ Success message displayed

## 🐛 Troubleshooting

### **Common Issues**

#### 1. **Timezone Error**
```
❌ Google availability check failed: RangeError: Invalid time zone specified: Europe/Paris
```
**Solution**: Ensure timezone is set to valid value (e.g., `Asia/Kolkata`)

#### 2. **OAuth Token Lost**
**Problem**: Server restart loses OAuth refresh token
**Solution**: Re-authenticate by visiting `/api/google/connect`

#### 3. **Calendar Permission Denied**
**Problem**: Service account can't access personal calendar
**Solution**: Use OAuth2 authentication instead

#### 4. **EmailJS Not Triggering**
**Problem**: `triggerEmailJS` flag not being set
**Solution**: Check calendar booking success and `smart-scheduler.ts` logic

### **Debug Commands**
```bash
# Check server status
ps aux | grep "next dev"

# Test calendar API
curl -s "http://localhost:9002/api/calendar" -X POST -H "Content-Type: application/json" -d '{"action":"checkAvailability","date":"2025-01-20","time":"3:00 PM"}'

# Check environment variables
cat .env.local | grep -E "(GOOGLE_OAUTH|GOOGLE_CALENDAR|EMAILJS)"
```

## 📝 Key Code Changes Made

### **1. Fixed Timezone in Calendar API**
```typescript
// Before
const TIMEZONE = process.env.MS_TIMEZONE || process.env.GOOGLE_TIMEZONE || 'Europe/Paris';

// After  
const TIMEZONE = process.env.MS_TIMEZONE || process.env.GOOGLE_TIMEZONE || 'Asia/Kolkata';
```

### **2. Added triggerEmailJS Flag**
```typescript
// In smart-scheduler.ts
triggerEmailJS?: {
  userEmail: string;
  userName: string;
  meetingDetails: {
    date: string;
    time: string;
    timezone: string;
    meetingLink?: string;
  };
};
```

### **3. EmailJS Integration in Chatbot**
```typescript
// Check if we need to trigger EmailJS for confirmation emails
if (schedulingResult.triggerEmailJS) {
  const { userEmail, userName, meetingDetails } = schedulingResult.triggerEmailJS;
  // Send confirmation emails via EmailJS
}
```

## 🎯 Success Criteria

The system is working when:
- ✅ Google OAuth2 authentication succeeds
- ✅ Calendar API returns `isAvailable: true`
- ✅ Calendar events are created successfully
- ✅ `triggerEmailJS` flag is set in scheduling result
- ✅ Confirmation emails are sent via EmailJS
- ✅ Both user and owner receive emails

## 🔄 Maintenance

### **Regular Tasks**
1. **OAuth Token Refresh**: Re-authenticate if server restarts
2. **EmailJS Monitoring**: Check email delivery success rates
3. **Calendar API Health**: Monitor for permission/authentication issues

### **Updates**
- Keep Google APIs and EmailJS libraries updated
- Monitor Google OAuth2 credential expiration
- Review calendar permissions and scopes

---

## 📞 Support
If you encounter issues:
1. Check this guide first
2. Review server logs for error messages
3. Verify environment variables and credentials
4. Test individual components (Calendar API, EmailJS) separately

**Last Updated**: January 2025
**Status**: ✅ Working and Tested 