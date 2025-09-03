# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

### Firebase Configuration
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Google Calendar API
```bash
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
CALENDAR_OWNER_EMAIL=your_email@cognivexai.com
```

## Setup Steps

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/select your project
3. Go to Project Settings > General
4. Copy the config values to your `.env.local`

### 2. Google Calendar API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Calendar API
3. Create a service account
4. Download the JSON key file as `service-account-key.json`
5. Place it in your project root
6. Share your calendar with the service account email

### 3. Install Dependencies
```bash
npm install googleapis firebase
```

## What This Enables

✅ **User Data Storage** - Names, emails, and chat sessions stored in Firestore
✅ **Calendar Integration** - Check availability and book appointments
✅ **Smart Scheduling** - Suggest alternative times if slots are busy
✅ **Meeting Links** - Automatically generate Google Meet links
✅ **Email Confirmations** - Send booking confirmations

## Testing

After setup, test the chatbot with:
1. "can you book a meeting"
2. Provide your name and email
3. Say "tomorrow at 2 PM"
4. The system will check your calendar and book the slot


