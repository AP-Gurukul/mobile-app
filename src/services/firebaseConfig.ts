import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In a real app, these should be in an environment variable (.env)
const firebaseConfig = {
  apiKey: 'AIzaSyCkJwRbqkzDTvR-mOn5lurJkO0hJLTtlwM',
  authDomain: 'ap-gurukul-43050.firebaseapp.com',
  projectId: 'ap-gurukul-43050',
  storageBucket: 'ap-gurukul-43050.firebasestorage.app',
  messagingSenderId: '797079176348',
  appId: '1:797079176348:android:7e34b7528e94d34dfa9959',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with persistence
// Use try-catch to handle hot reload / module re-evaluation where
// initializeAuth throws "auth/already-initialized"
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e: unknown) {
  const firebaseError = e as { code?: string };
  if (firebaseError.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw e;
  }
}

const db = getFirestore(app);

export { app, auth, db };
