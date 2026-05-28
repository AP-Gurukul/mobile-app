import { Redirect } from 'expo-router';
import { auth } from '../services/firebaseConfig';

export default function Index() {
  const user = auth.currentUser;

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // TODO: Check if user has completed onboarding (exam selection)
  // For now, redirect to tabs
  return <Redirect href="/(tabs)" />;
}
