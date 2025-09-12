#!/bin/bash

echo "🚀 Setting up local environment to match production..."

# Create .env.local file
cat > .env.local << 'EOF'
# EmailJS Configuration (same as production)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_af5vxka
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_1csll1o
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=COtKbmSCzdpiCZDwB
EMAILJS_PRIVATE_KEY=your_emailjs_private_key_here

# Google Calendar Configuration
GOOGLE_CALENDAR_ID=snazzy.mugi@gmail.com

# Google Sheets Configuration
GOOGLE_SHEETS_ID=1HlgIW79FsJwBC3YfmoTuW8HuMi4QuEWdq3ANDJpbFQw

# Gemini AI Configuration (optional)
GEMINI_API_KEY=your_gemini_api_key_here

# Vercel Analytics (optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_vercel_analytics_id_here

# Firebase Configuration (if needed)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here
EOF

echo "✅ Created .env.local file with production configuration"
echo ""
echo "📝 Next steps:"
echo "1. Get your EmailJS private key from: https://dashboard.emailjs.com/admin/integration"
echo "2. Replace 'your_emailjs_private_key_here' in .env.local with your actual private key"
echo "3. Add any other API keys you need (Gemini, Firebase, etc.)"
echo "4. Restart your development server: npm run dev"
echo ""
echo "🔑 To get EmailJS private key:"
echo "   - Go to EmailJS dashboard"
echo "   - Click 'Account' → 'API Keys'"
echo "   - Copy the 'Private Key'"
echo "   - Replace it in .env.local"
echo ""
echo "🎯 Your local environment will then match production!"

