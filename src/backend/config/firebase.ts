import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCpfHj8CLlrTWut2IWdzlSo8OknCIhbx10",
  authDomain: "sam-b-db.firebaseapp.com",
  projectId: "sam-b-db",
  storageBucket: "sam-b-db.firebasestorage.app",
  messagingSenderId: "454498541060",
  appId: "1:454498541060:web:df8995799245ce5774df51",
  measurementId: "G-P13261G44H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
