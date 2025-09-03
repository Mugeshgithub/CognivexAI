# 🚀 Quick Google Sheet Setup

## 📊 **Step 1: Create Your Sheet**
1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet
3. Name it: `CognivexAI - Leads`

## 📋 **Step 2: Set Up Columns**
In the first row (A1:F1), add these headers:
```
A1: Timestamp | B1: Name | C1: Email | D1: Message | E1: Session ID | F1: Lead Score
```

## 🔐 **Step 3: Share with Service Account**
1. Click "Share" button
2. Add: `cognivexai-calendar@gen-lang-client-0125765869.iam.gserviceaccount.com`
3. Give "Editor" permission
4. Click "Send"

## 🔧 **Step 4: Get Sheet ID**
1. Copy the URL from your browser
2. Extract the ID (long string between /d/ and /edit)
3. Update `.env.local`:
```bash
GOOGLE_SHEETS_ID=YOUR_SHEET_ID_HERE
```

## 🧪 **Step 5: Test**
1. Restart server: `npm run dev`
2. Open chatbot
3. Type: "My name is John, email john@test.com"
4. Check your Google Sheet - new row should appear!

---

**This will make lead capture work immediately!** 🎯

