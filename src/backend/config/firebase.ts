import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const isNode = typeof process !== 'undefined' && process.env;

const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || (isNode ? process.env.VITE_FIREBASE_API_KEY : ''),
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || (isNode ? process.env.VITE_FIREBASE_AUTH_DOMAIN : ''),
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || (isNode ? process.env.VITE_FIREBASE_PROJECT_ID : ''),
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || (isNode ? process.env.VITE_FIREBASE_STORAGE_BUCKET : ''),
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || (isNode ? process.env.VITE_FIREBASE_MESSAGING_SENDER_ID : ''),
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || (isNode ? process.env.VITE_FIREBASE_APP_ID : ''),
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || (isNode ? process.env.VITE_FIREBASE_MEASUREMENT_ID : '')
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Enable persistence for offline support and faster loading
if (typeof window !== 'undefined') {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Persistence failed: Browser does not support it');
    }
  });
}

export default app;
