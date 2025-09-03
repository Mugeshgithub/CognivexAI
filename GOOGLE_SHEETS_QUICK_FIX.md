# 🚨 GOOGLE SHEETS QUICK FIX

## ❌ **CURRENT ERRORS:**
1. **Permission Error**: "The caller does not have permission" (403)
2. **Range Error**: "Unable to parse range: Leads!A:F" (400)

## 🔧 **IMMEDIATE FIXES:**

### **Step 1: Create .env.local file**
Create a file called `.env.local` in your project root with:

```bash
# Google Sheets Configuration
GOOGLE_SHEETS_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms

# Google Service Account
GOOGLE_SERVICE_ACCOUNT_KEY=./service-account-key.json

# ElevenLabs API Key
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### **Step 2: Fix the Demo Sheet**
The demo sheet `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms` needs:
- **Sheet name**: `Sheet1` (not `Leads`)
- **Columns**: A1:F1 should have headers
- **Sharing**: Give access to `cognivexai-calendar@gen-lang-client-0125765869.iam.gserviceaccount.com`

### **Step 3: Restart Server**
```bash
npm run dev
```

## 🎯 **ALTERNATIVE: Create Your Own Sheet**

1. **Go to [Google Sheets](https://sheets.google.com)**
2. **Create new spreadsheet**
3. **Name it**: `CognivexAI - Leads`
4. **Set up columns** (A1:F1):
   ```
   Timestamp | Name | Email | Message | Session ID | Lead Score
   ```
5. **Share with service account**:
   - Click "Share" button
   - Add: `cognivexai-calendar@gen-lang-client-0125765869.iam.gserviceaccount.com`
   - Give "Editor" permission
6. **Get Sheet ID** from URL and update `.env.local`

## 🧪 **TEST AFTER FIX:**
1. Restart server
2. Open chatbot
3. Type: "My name is John, email john@test.com"
4. Check console for success message

---

**The main issue is the missing .env.local file and wrong sheet configuration!**

