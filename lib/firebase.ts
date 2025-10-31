import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

let firebaseConfig;

if (process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG) {
  try {
    firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG);
  } catch (error) {
    console.error('Error parsing NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG:', error);
    firebaseConfig = null;
  }
}

if (!firebaseConfig) {
  try {
    const configData = require('../firebase-config.json');
    firebaseConfig = configData.client;
    
    if (firebaseConfig.apiKey === 'YOUR_API_KEY' || 
        firebaseConfig.projectId === 'YOUR_PROJECT_ID') {
      throw new Error('Firebase client config not set');
    }
  } catch (error) {
    console.error('Error loading firebase config:', error);
    firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
  }
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
