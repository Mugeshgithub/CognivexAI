# 📧 EmailJS Setup Guide for CognivexAI

## 🚨 **IMMEDIATE FIX NEEDED**

Your EmailJS is in "strict mode" which requires a private key. Here's how to fix it:

## **Step 1: Get Your EmailJS Private Key**

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Click on **"Account"** in the left sidebar
3. Look for **"Private Key"** section
4. Copy your private key (it looks like: `user_abc123def456`)

## **Step 2: Update Environment Variables**

Add this to your `.env.local` file:

```bash
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
EMAILJS_PRIVATE_KEY=your_private_key_here
```

## **Step 3: Create Email Templates**

You need to create these templates in EmailJS:

### **Template 1: Welcome Lead**
- **Template ID**: `welcome_lead`
- **Subject**: `Welcome to CognivexAI - Let's Build Something Amazing!`
- **Content**:
```
Hello {{lead_name}},

Welcome to CognivexAI! We're excited to have you on board.

**What We Do:**
{{services}}

**Next Steps:**
1. Schedule a consultation call
2. Discuss your project requirements
3. Get a custom AI solution

**Contact Us:**
Email: {{contact_email}}

Best regards,
The CognivexAI Team
```

### **Template 2: Meeting Confirmation**
- **Template ID**: `meeting_confirmation`
- **Subject**: `Meeting Confirmed: {{meeting_summary}}`
- **Content**:
```
Hello {{to_name}},

Your meeting has been confirmed!

**Meeting Details:**
📅 Date: {{meeting_date}}
⏰ Time: {{meeting_time}}
⏱️ Duration: {{meeting_duration}}
📋 Summary: {{meeting_summary}}

**Calendar Link:**
{{calendar_link}}

**Contact:**
{{contact_email}}

See you soon!
CognivexAI Team
```

### **Template 3: Team Notification**
- **Template ID**: `team_notification`
- **Subject**: `New Lead: {{lead_name}} - {{lead_email}}`
- **Content**:
```
**New Lead Alert! 🎯**

**Lead Details:**
👤 Name: {{lead_name}}
📧 Email: {{lead_email}}
💬 Message: {{lead_message}}
⭐ Lead Score: {{lead_score}}
📅 Meeting: {{meeting_details}}

**Action Required:**
- Review lead information
- Follow up within 24 hours
- Schedule consultation if needed

---
CognivexAI Lead Management System
```

## **Step 4: Test Email Functionality**

1. **Restart your development server**
2. **Test lead capture**: "My name is John, email john@test.com"
3. **Test meeting booking**: "Book a consultation for tomorrow at 2 PM"
4. **Check console logs** for email success/failure

## **Alternative: Use Gmail API (More Reliable)**

If EmailJS continues to have issues, we can switch to Gmail API which is more reliable:

```bash
# Add to .env.local
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token
```

## **Current Status:**
- ✅ Lead capture working
- ✅ Google Sheets integration working  
- ✅ Calendar booking working
- ❌ Email automation failing (needs private key)

## **Next Steps After Fix:**
1. Test email functionality
2. Move to Phase 2: Enhanced Intelligence
3. Implement advanced features

---

**Need help?** Check EmailJS documentation or let me know if you want to switch to Gmail API instead.




