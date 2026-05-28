import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In a real app, these should be in an environment variable (.env)
// Based on the provided LICENSE.json
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

// Initialize Auth with AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
