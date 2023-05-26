import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAWCNk1qX5NAi9kkfa_UXZJuNG88moeEBo',
  authDomain: 'anmol-chat.firebaseapp.com',
  projectId: 'anmol-chat',
  storageBucket: 'anmol-chat.appspot.com',
  messagingSenderId: '521080029803',
  appId: '1:521080029803:web:3499e8b71af0404840272e',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Firebase Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const signInWithGoogle = () => {
  signInWithRedirect(auth, provider);
};
export const storage = getStorage();
export const db = getFirestore();
