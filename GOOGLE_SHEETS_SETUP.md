# 🚀 Google Sheets Setup for Lead Management

## 📊 **Step 1: Create Your Google Sheet**

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: `CognivexAI - Leads`
4. Copy this URL from your browser address bar

## 🔧 **Step 2: Update Environment Variables**

Add this to your `.env.local` file:
```bash
GOOGLE_SHEETS_ID=YOUR_SPREADSHEET_ID_HERE
```

**Replace `YOUR_SPREADSHEET_ID_HERE` with the ID from your sheet URL**

## 📋 **Step 3: Set Up Sheet Structure**

Create these columns in your sheet:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| **Timestamp** | **Name** | **Email** | **Message** | **Session ID** | **Lead Score** |

## 🔐 **Step 4: Share Sheet with Service Account**

1. Click "Share" button in your Google Sheet
2. Add this email: `cognivexai-calendar@gen-lang-client-0125765869.iam.gserviceaccount.com`
3. Give it **"Editor"** permission
4. Click "Send"

## 🧪 **Step 5: Test the Integration**

1. Start your server: `npm run dev`
2. Open chatbot
3. Type: "My name is John, email john@test.com"
4. Check your Google Sheet - new row should appear!

## 📈 **What Happens Now:**

✅ **Leads automatically saved** to Google Sheets
✅ **Real-time data capture** from chatbot
✅ **Lead scoring** and session tracking
✅ **Complete lead management** system

## 🔍 **Troubleshooting:**

If leads aren't saving:
1. Check service account has "Editor" access
2. Verify spreadsheet ID in `.env.local`
3. Check server console for error messages
4. Ensure Google Sheets API is enabled in Google Cloud Console

---

**Your chatbot is now a complete lead generation machine!** 🎯




