# Firebase Setup Guide for Smart Chatbot

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Calendar API
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json

# EmailJS Configuration (already configured)
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=COtKbmSCzdpiCZDwB
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_af5vxka
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_1csll1o
```

## Firebase Setup Steps

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Enable Firestore Database

2. **Get Firebase Config**
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app or create one
   - Copy the config values

3. **Enable Firestore**
   - Go to Firestore Database in Firebase Console
   - Create database in test mode
   - Set up security rules for production

4. **Firestore Collections Structure**
   The chatbot will automatically create these collections:
   - `users` - User information and lead data
   - `chat_sessions` - Chat conversation history
   - `bookings` - Calendar booking information

## Google Calendar Setup

1. **Service Account**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google Calendar API
   - Create a service account
   - Download the JSON key file
   - Place it in your project root as `service-account-key.json`

2. **Calendar Permissions**
   - Share your Google Calendar with the service account email
   - Give it "Make changes to events" permission

## Features Added

### Smart User Data Collection
- **Automatic Detection**: Chatbot detects when users mention their name or email
- **Guided Collection**: Step-by-step form collection for name, email, phone, company
- **Smart Storage**: Automatically stores user data in Firebase

### Lead Scoring System
- **Conversation Analysis**: Analyzes chat content for lead indicators
- **Interest Extraction**: Identifies user interests (AI, ML, Data Analytics, etc.)
- **Scoring Algorithm**: Calculates lead score based on engagement level

### Calendar Integration
- **Google Calendar**: Creates events with Google Meet links
- **Automatic Reminders**: Sets up email and popup reminders
- **Booking Storage**: Stores all booking details in Firebase

### Enhanced Chat Experience
- **Context Awareness**: Remembers user information across sessions
- **Smart Actions**: Quick action buttons for common requests
- **Proactive Suggestions**: Offers relevant actions based on conversation

## Usage Examples

### User Provides Information
```
User: "My name is John Smith"
Bot: "Nice to meet you, John! What's your email address so I can better assist you?"

User: "john@example.com"
Bot: "Great! I've saved your email: john@example.com. Now, how can I help you?"
```

### Schedule Consultation
```
User: "I'd like to schedule a consultation"
Bot: "I'd be happy to help you schedule a consultation! First, let me collect some information to set up your booking.

What's your name?"
```

### Add Information Button
- Users can click "Add My Info" button to start information collection
- Chatbot guides through name, email, phone, and company collection
- Data is automatically stored in Firebase

## Data Storage

### User Data
- Name, email, phone, company
- Lead score (0-100)
- Interests and preferences
- Session count and last activity

### Chat Sessions
- Complete conversation history
- Session metadata
- Lead scoring data
- User engagement metrics

### Bookings
- Calendar event details
- Meeting links
- User information
- Session tracking

## Security Notes

- Firebase security rules should be configured for production
- Google Calendar API keys should be kept secure
- User data is stored with proper consent
- Regular data cleanup procedures recommended


