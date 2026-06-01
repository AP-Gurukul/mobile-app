import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, Auth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

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

// Initialize Auth with platform-aware persistence
// Web: uses browserLocalPersistence (localStorage)
// Native: uses getReactNativePersistence(AsyncStorage)
let auth: Auth;
try {
  if (Platform.OS === 'web') {
    auth = initializeAuth(app, {
      persistence: browserLocalPersistence,
    });
  } else {
    // Dynamic import to avoid bundling issues on web
    const { getReactNativePersistence } = require('firebase/auth');
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
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
