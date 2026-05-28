import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme, Divider, HelperText } from 'react-native-paper';
import { router } from 'expo-router';
import { auth } from '../../src/services/firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// Required for expo-auth-session to work on Android
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  // Google Auth setup
  // The webClientId comes from your Firebase console -> Authentication -> Sign-in method -> Google -> Web client ID
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '797079176348-st2nmgkral0451t1hti9f93e18327hgc.apps.googleusercontent.com',
    // androidClientId will be needed for standalone builds
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response);
    } else if (response?.type === 'error') {
      setError('Google Sign-In failed. Please try again.');
      setGoogleLoading(false);
    }
  }, [response]);

  const handleGoogleResponse = async (response: any) => {
    try {
      setGoogleLoading(true);
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      await signInWithCredential(auth, credential);
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Email auth error:', err);
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found. Please sign up first.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/email-already-in-use':
          setError('Email already in use. Please sign in instead.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid credentials. Check your email and password.');
          break;
        default:
          setError(err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await promptAsync();
    } catch (err: any) {
      setError('Could not start Google Sign-In.');
      setGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
            APPSC Pandit
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            Your journey to success starts here.
          </Text>
        </View>

        {error ? (
          <HelperText type="error" visible={true} style={styles.errorText}>
            {error}
          </HelperText>
        ) : null}

        <View style={styles.form}>
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={(t) => { setEmail(t); setError(''); }}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            left={<TextInput.Icon icon="email-outline" />}
          />
          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={(t) => { setPassword(t); setError(''); }}
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="lock-outline" />}
          />
          <Button
            mode="contained"
            onPress={handleEmailAuth}
            loading={loading}
            disabled={loading || googleLoading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
          <Button
            mode="text"
            onPress={() => { setIsSignUp(!isSignUp); setError(''); }}
            style={{ marginTop: 8 }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </View>

        <View style={styles.dividerContainer}>
          <Divider style={styles.divider} />
          <Text style={{ marginHorizontal: 16, color: theme.colors.onSurfaceVariant }}>OR</Text>
          <Divider style={styles.divider} />
        </View>

        <View style={styles.socialAuth}>
          <Button
            mode="outlined"
            icon="google"
            onPress={handleGoogleLogin}
            loading={googleLoading}
            disabled={loading || googleLoading || !request}
            style={styles.socialButton}
            contentStyle={styles.socialButtonContent}
          >
            Continue with Google
          </Button>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
  },
  socialAuth: {
    gap: 16,
  },
  socialButton: {
    borderRadius: 8,
  },
  socialButtonContent: {
    paddingVertical: 8,
  },
});
