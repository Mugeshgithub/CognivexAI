import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, sessionId, messages, leadScore, interests } = body;

    if (!email || !sessionId) {
      return NextResponse.json(
        { error: 'Email and sessionId are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    let userId: string;

    if (querySnapshot.empty) {
      // Create new user
      const userData = {
        name: name || email.split('@')[0],
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        leadScore: leadScore || 0,
        interests: interests || [],
        totalSessions: 1,
        lastSession: new Date().toISOString()
      };

      const userRef = await addDoc(usersRef, userData);
      userId = userRef.id;
    } else {
      // Update existing user
      const userDoc = querySnapshot.docs[0];
      userId = userDoc.id;
      
      await setDoc(doc(db, 'users', userId), {
        name: name || userDoc.data().name,
        updatedAt: new Date().toISOString(),
        lastSession: new Date().toISOString(),
        totalSessions: (userDoc.data().totalSessions || 0) + 1,
        ...(leadScore && { leadScore }),
        ...(interests && { interests })
      }, { merge: true });
    }

    // Store chat session
    const sessionData = {
      userId,
      sessionId,
      messages: messages || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      leadScore: leadScore || 0,
      interests: interests || []
    };

    await addDoc(collection(db, 'chat_sessions'), sessionData);

    return NextResponse.json({
      success: true,
      userId,
      message: 'User data and session stored successfully'
    });

  } catch (error) {
    console.error('❌ User storage error:', error);
    return NextResponse.json(
      { error: 'Failed to store user data' },
      { status: 500 }
    );
  }
}


