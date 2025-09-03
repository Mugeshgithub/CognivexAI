# 🚀 Cal.com + n8n Integration Guide

## 📋 **What We've Implemented**

### ✅ **Phase 1: Cal.com Integration (COMPLETED)**
- [x] Installed `@cal.com/embed-react` package
- [x] Created `CalComWidget` component
- [x] Integrated Cal.com widget into chatbot
- [x] Created webhook endpoint for n8n integration
- [x] Added Firebase storage for bookings

### 🔄 **Phase 2: n8n Workflow Integration (IN PROGRESS)**
- [ ] Configure Cal.com webhook settings
- [ ] Set up n8n webhook trigger
- [ ] Test automation pipeline
- [ ] Add custom data processing

---

## 🛠️ **Setup Instructions**

### **Step 1: Environment Variables**
Add this to your `.env.local`:

```bash
# Cal.com Integration
N8N_WEBHOOK_URL=https://mugesh1831.app.n8n.cloud/webhook/cal-com-booking
```

### **Step 2: Cal.com Configuration**
1. **Login to Cal.com** with your account (`mugesh`)
2. **Create Event Type**: "consultation" (30 min)
3. **Set Availability**: Business hours, no weekends
4. **Configure Webhook**: Point to your endpoint

### **Step 3: n8n Webhook Setup**
1. **Add Webhook Trigger** to your existing workflow
2. **URL**: `https://mugesh1831.app.n8n.cloud/webhook/cal-com-booking`
3. **Method**: POST
4. **Test**: Send sample data to verify

---

## 🔗 **Integration Flow**

```
User → Chatbot → "Schedule Meeting" → Cal.com Widget → 
Booking Confirmed → Webhook → n8n → Google Calendar + Notifications
```

### **Data Flow:**
1. **User books** via Cal.com widget in chatbot
2. **Cal.com sends** webhook to your API
3. **Your API forwards** data to n8n
4. **n8n creates** Google Calendar event
5. **n8n sends** notifications (email, Slack, etc.)

---

## 🧪 **Testing the Integration**

### **Test 1: Basic Cal.com Widget**
1. Refresh your browser at `http://localhost:9004`
2. Type: "I want to schedule a call"
3. Provide name and email
4. **Cal.com widget should appear!**

### **Test 2: Webhook Endpoint**
```bash
curl -X GET http://localhost:9004/api/cal-com/webhook
# Should return: {"message": "Cal.com webhook endpoint is active", "status": "ready"}
```

### **Test 3: n8n Integration**
1. Make a test booking via Cal.com
2. Check your n8n workflow executions
3. Verify Google Calendar event creation

---

## 🔧 **Troubleshooting**

### **Cal.com Widget Not Loading**
- Check browser console for errors
- Verify Cal.com account and event type
- Ensure `mugesh/consultation` exists

### **Webhook Not Working**
- Check n8n webhook URL configuration
- Verify environment variables
- Test webhook endpoint manually

### **n8n Workflow Issues**
- Check webhook trigger configuration
- Verify data mapping in workflow
- Test with sample payload

---

## 📊 **Next Steps**

### **Immediate (Today)**
1. ✅ Test Cal.com widget in chatbot
2. ✅ Configure Cal.com webhook settings
3. ✅ Set up n8n webhook trigger

### **This Week**
1. 🔄 Test complete booking flow
2. 🔄 Customize n8n workflow
3. 🔄 Add error handling

### **Next Week**
1. 🚀 Add advanced features
2. 🚀 Analytics and reporting
3. 🚀 Multi-language support

---

## 🎯 **Success Metrics**

- [ ] Cal.com widget loads in chatbot
- [ ] Bookings create Google Calendar events
- [ ] n8n workflow executes automatically
- [ ] Notifications sent successfully
- [ ] Data stored in Firebase

---

## 📞 **Need Help?**

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables
3. Test webhook endpoints manually
4. Check n8n workflow logs

**Ready to test?** Start with refreshing your browser and testing the Cal.com widget! 🚀
