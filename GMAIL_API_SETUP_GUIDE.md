# 📧 Gmail API Setup Guide for CognivexAI

## 🚀 **REPLACING EMAILJS WITH GMAIL API**

I've implemented Gmail API instead of EmailJS for better reliability and easier setup.

## **Step 1: Enable Gmail API in Google Cloud Console**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `gen-lang-client-0125765869`
3. Go to **"APIs & Services"** → **"Library"**
4. Search for **"Gmail API"**
5. Click **"Enable"**

## **Step 2: Create OAuth 2.0 Credentials**

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. Choose **"Web application"**
4. **Name**: `CognivexAI Gmail Client`
5. **Authorized redirect URIs**: Add these:
   - `http://localhost:3000/api/auth/callback`
   - `http://localhost:9002/api/auth/callback`
6. Click **"Create"**
7. **Copy the Client ID and Client Secret**

## **Step 3: Get Refresh Token**

### **Option A: Use Google OAuth Playground (Easier)**

1. Go to [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. Click **"Settings"** (gear icon) in top right
3. Check **"Use your own OAuth credentials"**
4. Enter your **Client ID** and **Client Secret**
5. Close settings
6. In the left panel, find **"Gmail API v1"**
7. Select **"https://www.googleapis.com/auth/gmail.send"**
8. Click **"Authorize APIs"**
9. Sign in with your Gmail account
10. Click **"Exchange authorization code for tokens"**
11. **Copy the Refresh Token**

### **Option B: Use Your App (More Complex)**

1. Create a simple OAuth flow in your app
2. Handle the authorization callback
3. Extract refresh token from response

## **Step 4: Update Environment Variables**

Add these to your `.env.local`:

```bash
# Gmail API Configuration
GMAIL_CLIENT_ID=your_client_id_here
GMAIL_CLIENT_SECRET=your_client_secret_here
GMAIL_REFRESH_TOKEN=your_refresh_token_here
GMAIL_FROM_EMAIL=snazzy.mugi@gmail.com
```

## **Step 5: Test Email Functionality**

1. **Restart your development server**
2. **Test lead capture**: "My name is John, email john@test.com"
3. **Test meeting booking**: "Book a consultation for tomorrow at 2 PM"
4. **Check console logs** for Gmail success/failure

## **Expected Results:**

- ✅ **Welcome email** sent to new leads via Gmail
- ✅ **Meeting confirmation** email sent when booking
- ✅ **Team notification** sent to your email via Gmail

## **Gmail API Benefits:**

- 🚀 **More reliable** than EmailJS
- 🔒 **Better security** with OAuth 2.0
- 📧 **Professional emails** from your Gmail account
- 🎯 **No template setup** required
- 💰 **Free** with Google Cloud quotas

## **Current Status:**

- ✅ **Lead capture** - Working perfectly
- ✅ **Google Sheets** - Working perfectly  
- ✅ **Calendar booking** - Working perfectly
- 🔄 **Email automation** - Switched to Gmail API

## **Next Steps After Gmail Setup:**

1. Test email functionality
2. Move to **Phase 2: Enhanced Intelligence**
3. Implement advanced features

## **Troubleshooting:**

- **"Gmail API not enabled"**: Enable it in Google Cloud Console
- **"Invalid credentials"**: Check your Client ID/Secret
- **"Invalid refresh token"**: Get a new refresh token
- **"Quota exceeded"**: Check Google Cloud quotas

---

**Need help?** The Gmail API setup is much more reliable than EmailJS. Let me know when you've completed the setup!

