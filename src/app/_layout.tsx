import { Stack, router, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme/theme';
import { useEffect, useState } from 'react';
import { auth } from '../services/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const themeMode = useThemeStore(state => state.themeMode);
  
  const isDark = themeMode === 'dark' || (themeMode === 'system' && colorScheme === 'dark');
  const theme = isDark ? darkTheme : lightTheme;
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsReady(true);
    });
    return unsubscribe;
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Not logged in, redirect to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Logged in but on auth screen, redirect to tabs
      router.replace('/(tabs)');
    }
  }, [user, isReady, segments]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="practice" options={{ headerShown: false }} />
        <Stack.Screen name="current-affairs" options={{ headerShown: false }} />
        <Stack.Screen name="pyq" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
