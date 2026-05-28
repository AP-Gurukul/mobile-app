import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { auth } from '../../services/firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // We'll keep this hidden initially or skip it if we want the "Continue" flow, but standard Firebase needs it. Let's just show it.
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  // The webClientId from Firebase
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '797079176348-st2nmgkral0451t1hti9f93e18327hgc.apps.googleusercontent.com',
    // To FIX the Google Auth 400 Error on Expo Go:
    // You MUST create an iOS OAuth Client ID in Google Cloud Console with the bundle ID: host.exp.exponent
    // And place that string right here:
    iosClientId: '797079176348-eib61bm9stigtvbviu3h43a7qkbqvi94.apps.googleusercontent.com', // Replace this with actual iOS Client ID!
    androidClientId: '797079176348-st2nmgkral0451t1hti9f93e18327hgc.apps.googleusercontent.com', // Replace with actual Android Client ID!
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response);
    } else if (response?.type === 'error') {
      Alert.alert('Google Sign-In Failed', 'Please ensure you have configured Native iOS/Android Client IDs in Google Cloud.');
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
      Alert.alert('Google Auth Error', err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        Alert.alert('Error', 'Invalid credentials or account not found.');
      } else if (err.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Email already in use. Please log in.');
        setIsSignUp(false);
      } else {
        Alert.alert('Authentication Failed', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await promptAsync();
    } catch (err: any) {
      Alert.alert('Error', 'Could not start Google Sign-In.');
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="cube-outline" size={48} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>
            {isSignUp ? 'Create your free account' : 'Log in to your account'}
          </Text>

          {/* Google Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={loading || googleLoading || !request}
          >
            {googleLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="google" size={20} color="#4285F4" style={styles.googleIcon} />
                <Text style={styles.googleButtonText}>
                  {isSignUp ? 'Sign up with Google' : 'Log in with Google'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.formContainer}>
            <TextInput
              placeholder="Enter Your Email"
              placeholderTextColor="#71717A"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              textColor="#FFFFFF"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />

            <TextInput
              placeholder="Enter Your Password"
              placeholderTextColor="#71717A"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              textColor="#FFFFFF"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleEmailAuth}
              disabled={loading || googleLoading}
            >
              {loading ? (
                <ActivityIndicator color="#000000" size="small" />
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              {isSignUp ? 'Already a user? ' : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.footerLink}>
                {isSignUp ? 'Log in' : 'Sign up'}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#09090B', // Pitch black/dark gray background
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  logoContainer: {
    marginBottom: 32,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18181B', // Dark button background
    width: '100%',
    paddingVertical: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#27272A',
  },
  dividerText: {
    color: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    width: '100%',
    gap: 16,
  },
  input: {
    backgroundColor: '#18181B', // Very dark gray
    borderRadius: 24,
    height: 56,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  footerContainer: {
    flexDirection: 'row',
    marginTop: 32,
  },
  footerText: {
    color: '#A1A1AA',
    fontSize: 14,
  },
  footerLink: {
    color: '#71717A',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
