# 🔗 Real Google Calendar Integration Setup

## 🎯 **You're Right - Let's Make It REAL!**

The system now supports **real Google Calendar integration**. Here's how to set it up:

## 🚀 **Step-by-Step Setup:**

### **Step 1: Google Cloud Console Setup**
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
7. **Place it in your project root** (`/Users/mugesh/Downloads/CognivexAI/`)

### **Step 4: Share Calendar with Service Account**
1. Open [Google Calendar](https://calendar.google.com/)
2. Find your calendar ID (usually your email)
3. Go to calendar settings
4. Share with your service account email (found in the JSON file)
5. Give it "Make changes to events" permission

### **Step 5: Environment Variables**
Create `.env.local` in your project root:
```env
GOOGLE_CALENDAR_ID=your-email@gmail.com
GOOGLE_SERVICE_ACCOUNT_KEY=./service-account-key.json
```

## 🎯 **What Happens Now:**

### **✅ Real Features:**
- **Real Calendar Check** - Actually queries your Google Calendar
- **Real Event Creation** - Creates actual calendar events
- **Real Meeting Links** - Generates working Google Meet links
- **Real Email Notifications** - Sends calendar invites
- **Real Availability** - Checks your actual schedule

### **🔄 Fallback Mode:**
- If no service account key is found, it falls back to simulated mode
- System still works for testing
- Clear instructions are shown in console

## 🧪 **Test the Real Integration:**

1. **Set up the service account** (steps above)
2. **Restart your server:**
   ```bash
   npm run dev
   ```
3. **Check console logs** - should see:
   ```
   ✅ Google Calendar service initialized with real API
   ```
4. **Test scheduling** - now checks your real calendar!

## 💰 **Cost:**
- **Google Calendar API**: Free (1000 requests/day)
- **Google Meet**: Free (unlimited meetings)
- **No additional costs**

## 🎯 **Expected Results:**

### **With Real Integration:**
```
User: "Schedule a consultation for Friday at 2:30 PM IST"
Bot: "What timezone are you in?"
User: "IST"
Bot: "Great, let me check your actual calendar..."
✅ Real calendar check performed
✅ Real event created in your Google Calendar
✅ Real Google Meet link generated
✅ Real email notifications sent
```

### **Without Setup (Fallback):**
```
⚠️ No service account key found. Using simulated mode.
📅 Simulated calendar event created
```

**The system is now ready for real Google Calendar integration!** 🚀

**Would you like me to help you set up the Google Cloud project?** 🎯 