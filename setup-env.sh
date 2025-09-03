#!/bin/bash

# Set up environment variables for Google Calendar integration
echo "Setting up Google Calendar environment variables..."

# Create .env.local file
cat > .env.local << EOF
GOOGLE_CALENDAR_ID=your-email@gmail.com
GOOGLE_SERVICE_ACCOUNT_KEY=./service-account-key.json
EOF

echo "✅ Environment variables set up!"
echo ""
echo "📝 IMPORTANT: Update GOOGLE_CALENDAR_ID in .env.local with your actual email"
echo "📝 Then share your Google Calendar with: cognivexai-calendar@gen-lang-client-0125765869.iam.gserviceaccount.com"
echo ""
echo "🚀 Ready to test real Google Calendar integration!" 