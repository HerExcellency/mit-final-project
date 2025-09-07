import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase config from console.firebase.google.com
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };
const firebaseConfig = {
  apiKey: "AIzaSyC_-EiLNsvuYzwotef8hOSdDE9C1rUKTAw",
  authDomain: "compliance-monitor-4aac3.firebaseapp.com",
  projectId: "compliance-monitor-4aac3",
  storageBucket: "compliance-monitor-4aac3.firebasestorage.app",
  messagingSenderId: "583724915091",
  appId: "1:583724915091:web:eb5293b453cfa2f8bcb066",
  measurementId: "G-RNQT6KBKXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;