import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyAkGCc-W6KD-yIYoI8rxxq8h5H8h2e_an8',
  authDomain: 'gramador-dc5a5.firebaseapp.com',
  projectId: 'gramador-dc5a5',
  storageBucket: 'gramador-dc5a5.firebasestorage.app',
  messagingSenderId: '737506139117',
  appId: '1:737506139117:web:dfe91bc39222b7f46565e4',
  measurementId: 'G-12XDTHHXP4',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;
