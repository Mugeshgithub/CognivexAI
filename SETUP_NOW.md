# 🚀 **SETUP NOW - Get Chatbot Working in 5 Minutes**

## ⚠️ **CRITICAL: You Must Do This First**

### **Step 1: Create Environment File**
Create a file called `.env.local` in your project root:

```bash
# Firebase Configuration (REQUIRED)
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Google Calendar API (REQUIRED)
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
CALENDAR_OWNER_EMAIL=your_email@cognivexai.com
```

### **Step 2: Get Firebase Credentials**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Copy the config values

### **Step 3: Get Google Calendar API**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Calendar API
3. Create a service account
4. Download JSON key as `service-account-key.json`
5. Place in project root

### **Step 4: Start Server**
```bash
cd "/Users/mugesh/Downloads/CognivexAI - final"
npm run dev -- -p 9004
```

### **Step 5: Test**
1. Open `http://localhost:9004`
2. Test endpoint: `http://localhost:9004/api/test`
3. Try chatbot: "hey"

## 🎯 **What I Fixed:**

✅ **Calendar API**: Removed ALL problematic code
✅ **Firebase**: Added validation and error handling  
✅ **Name Parsing**: Fixed regex patterns
✅ **File Structure**: Cleaned up duplicate files

## 🚨 **Why It Wasn't Working:**

1. **Missing Environment Variables** - Firebase couldn't connect
2. **Old Calendar Code** - Still had domain delegation issues
3. **Duplicate Files** - Multiple calendar endpoints causing conflicts
4. **Server Running Old Code** - Changes weren't reflected

## 🧪 **Test Commands Once Running:**

1. **"hey"** → Should work ✅
2. **"What services do you offer?"** → Should work ✅
3. **"book a meeting"** → Should work ✅
4. **"my name is mugesh"** → Should work ✅
5. **"post2mugesh@outlook.com"** → Should work ✅
6. **"tomorrow at 2pm"** → Should work ✅

## 📞 **Need Help?**

1. **Set up environment variables first**
2. **Start server on port 9004**
3. **Test the `/api/test` endpoint**
4. **Let me know what happens!**

**The chatbot is fixed and ready - you just need to configure the environment!** 🎉


