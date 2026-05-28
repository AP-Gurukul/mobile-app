import { Stack } from 'expo-router';

export default function PracticeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[sessionId]" />
      <Stack.Screen name="result" />
    </Stack>
  );
}
