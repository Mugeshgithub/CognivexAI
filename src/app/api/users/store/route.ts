import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate Firebase config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Firebase configuration missing required fields:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasProjectId: !!firebaseConfig.projectId,
    config: firebaseConfig
  });
}

// Initialize Firebase only if not already initialized
let app;
if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw new Error('Firebase initialization failed');
  }
} else {
  app = getApps()[0];
  console.log('✅ Using existing Firebase app');
}

const db = getFirestore(app);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, sessionId, messages, leadScore, interests } = body;

    console.log('📝 Storing user data:', { name, email, sessionId });

    // Validate required fields
    if (!name || !email || !sessionId) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, email, and sessionId are required' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Check if user already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    let userId: string;

    if (querySnapshot.empty) {
      // Create new user
      const userRef = doc(collection(db, 'users'));
      userId = userRef.id;
      
      const userData = {
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        leadScore: leadScore || 0,
        interests: interests || []
      };
      
      console.log('📝 Creating user with data:', userData);
      await setDoc(userRef, userData);
      console.log('✅ New user created:', userId);
    } else {
      // Update existing user
      const userDoc = querySnapshot.docs[0];
      userId = userDoc.id;
      
      const updateData = {
        name: name.trim(),
        updatedAt: new Date().toISOString(),
        leadScore: leadScore || userDoc.data().leadScore || 0,
        interests: interests || userDoc.data().interests || []
      };
      
      console.log('📝 Updating user with data:', updateData);
      await setDoc(userDoc.ref, updateData, { merge: true });
      console.log('✅ Existing user updated:', userId);
    }

    // Store chat session
    const sessionData = {
      sessionId,
      userId,
      messages: messages || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('📝 Creating session with data:', sessionData);
    const sessionRef = await addDoc(collection(db, 'chat_sessions'), sessionData);
    console.log('✅ Chat session stored:', sessionRef.id);

    return NextResponse.json({ 
      success: true, 
      userId, 
      sessionId: sessionRef.id,
      message: 'User data and session stored successfully' 
    });

  } catch (error) {
    console.error('❌ User storage error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to store user data';
    if (error instanceof Error) {
      if (error.message.includes('Invalid resource field value')) {
        errorMessage = 'Firebase configuration issue - please check environment variables';
      } else if (error.message.includes('Permission denied')) {
        errorMessage = 'Firebase permission issue - please check security rules';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Please check Firebase configuration and try again'
    }, { status: 500 });
  }
}
