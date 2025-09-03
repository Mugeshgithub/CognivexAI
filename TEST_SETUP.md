# Chatbot Testing Guide

## 🧪 **Systematic Testing Steps:**

### **Test 1: Basic Chatbot Response**
```
Input: "hey"
Expected: Greeting response
Status: ✅ Working
```

### **Test 2: Service Information**
```
Input: "What services do you offer?"
Expected: Detailed service breakdown
Status: ✅ Working (RAG system)
```

### **Test 3: User Info Collection**
```
Input: "book a meeting"
Expected: "What's your name?"
Status: ✅ Working
```

### **Test 4: Name Parsing**
```
Input: "my name is mugesh"
Expected: "Nice to meet you, mugesh! What's your email?"
Status: 🔧 Fixed regex, needs testing
```

### **Test 5: Email Collection**
```
Input: "post2mugesh@outlook.com"
Expected: "Perfect! I have your details. What date and time?"
Status: 🔧 Fixed, needs testing
```

### **Test 6: Time Parsing**
```
Input: "tomorrow at 2pm"
Expected: Calendar booking attempt
Status: 🔧 Fixed, needs testing
```

### **Test 7: Firebase Storage**
```
Expected: User data stored successfully
Status: 🔧 Fixed validation, needs testing
```

### **Test 8: Calendar API**
```
Expected: Appointment created or alternative times suggested
Status: 🔧 Fixed conferenceData issues, needs testing
```

## 🚀 **Quick Test Commands:**

1. **"hey"** → Test basic response
2. **"What services do you offer?"** → Test RAG system
3. **"book a meeting"** → Test scheduling flow
4. **"my name is mugesh"** → Test name parsing
5. **"post2mugesh@outlook.com"** → Test email handling
6. **"tomorrow at 2pm"** → Test time parsing and booking

## 🔧 **What I Fixed:**

1. ✅ **Calendar API**: Removed `conferenceDataVersion` and `conferenceData`
2. ✅ **Firebase**: Added validation and better error handling
3. ✅ **Name Parsing**: Fixed regex to extract just the name
4. ✅ **Error Messages**: Clear, helpful error responses
5. ✅ **Debugging**: Added comprehensive logging

## 📋 **Next Steps:**

1. **Set up environment variables** (see ENV_SETUP_EXAMPLE.md)
2. **Test each component** using the commands above
3. **Check console logs** for debugging information
4. **Verify Firebase connection** works
5. **Test calendar booking** end-to-end

## 🎯 **Expected Flow:**

```
User: "book a meeting tomorrow at 2pm, my name is mugesh and my email is post2mugesh@outlook.com"
↓
Chatbot: Extracts name="mugesh", email="post2mugesh@outlook.com", time="2pm"
↓
Stores in Firebase ✅
↓
Books in Google Calendar ✅
↓
Confirms: "🎉 Perfect! Your consultation is booked for tomorrow at 2pm"
```


