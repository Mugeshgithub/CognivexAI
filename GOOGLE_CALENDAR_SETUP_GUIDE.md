# 🔑 Google Calendar Service Account Setup Guide

## ✅ **You Already Have the Service Account Key!**

Your service account key is: `gen-lang-client-0125765869-2b6c1a1aa36b.json`

**Service Account Email:** `cognivexai-calendar@gen-lang-client-0125765869.iam.gserviceaccount.com`

## 🚀 **Step 1: Set Up Environment Variables**

Update your `.env.local` file with your email:

```env
GOOGLE_CALENDAR_ID=your-email@gmail.com
GOOGLE_SERVICE_ACCOUNT_KEY=./service-account-key.json
```

**Replace `your-email@gmail.com` with your actual Gmail address**

## 🔗 **Step 2: Share Your Google Calendar**

1. Open [Google Calendar](https://calendar.google.com/)
2. Go to your calendar settings
3. Find "Share with specific people"
4. Add this email: `cognivexai-calendar@gen-lang-client-0125765869.iam.gserviceaccount.com`
5. Give it **"Make changes to events"** permission
6. Click "Send"

## 🧪 **Step 3: Test the Integration**

1. Restart your server:
   ```bash
   pkill -f "next dev" && npm run dev
   ```

2. Test the calendar API:
   ```bash
   curl -X POST http://localhost:9002/api/calendar -H "Content-Type: application/json" -d '{"action":"checkAvailability","date":"2024-08-08","time":"14:30","duration":30}'
   ```

3. Open your website: `http://localhost:9002/`
4. Try the chatbot: "Schedule a consultation for tomorrow at 2 PM IST"

## 🔑 **How to Get a NEW Service Account Key (if needed):**

### **Step 1: Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

### **Step 2: Create Service Account**
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in:
   - Name: `cognivexai-calendar`
   - Description: `Calendar integration for CognivexAI chatbot`
4. Click "Create and Continue"
5. Skip role assignment (click "Continue")
6. Click "Done"

### **Step 3: Generate Service Account Key**
1. Click on your service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON"
5. Download the file
6. **Rename it to `service-account-key.json`**
7. **Place it in your project root**

## 🎯 **Expected Results:**

### **With Real Integration:**
```
User: "Schedule a consultation for tomorrow at 2 PM IST"
Bot: "What timezone are you in?"
User: "IST"
Bot: "Great, let me check your actual calendar..."
✅ Real calendar check performed
✅ Real event created in your Google Calendar
✅ Real Google Meet link generated
✅ Real email notifications sent
```

### **Current Status:**
- ✅ Service account key: **READY**
- ✅ Calendar API: **WORKING**
- ✅ Environment setup: **NEEDS YOUR EMAIL**
- ✅ Calendar sharing: **NEEDS TO BE DONE**

## 📝 **Next Steps:**

1. **Update `.env.local`** with your email
2. **Share your Google Calendar** with the service account
3. **Test the chatbot** with real calendar integration!

**Your system is ready for real Google Calendar integration!** 🚀 