# Environment Setup Example

## Create a `.env.local` file in your project root with these variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Google Calendar API
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
CALENDAR_OWNER_EMAIL=your_email@cognivexai.com

# EmailJS (for client-side email sending)
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
```

## Quick Test Commands:

1. **Test Firebase**: Try storing user data
2. **Test Calendar**: Try booking an appointment
3. **Test Email**: Check if confirmation emails work

## Current Status:
- ✅ Calendar API fixed (removed conferenceDataVersion)
- ✅ Firebase validation improved
- ✅ Name parsing regex fixed
- 🔧 Need environment variables configured
- 🔧 Need Google Calendar API setup


