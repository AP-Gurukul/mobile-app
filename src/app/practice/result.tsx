import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Button, Card, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

export default function SessionResultScreen() {
  const theme = useTheme();
  const { score, total } = useLocalSearchParams();
  
  const parsedScore = parseInt(score as string) || 0;
  const parsedTotal = parseInt(total as string) || 10;
  const accuracy = parsedTotal > 0 ? Math.round((parsedScore / parsedTotal) * 100) : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
          Session Complete!
        </Text>

        <View style={[styles.scoreCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1 }]}>
          <View style={styles.scoreContent}>
            <Text variant="displayLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
              {parsedScore} <Text variant="headlineMedium">/ {parsedTotal}</Text>
            </Text>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
              Final Score
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1 }]}>
            <View style={styles.statContent}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>{accuracy}%</Text>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Accuracy</Text>
            </View>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1 }]}>
            <View style={styles.statContent}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>{parsedTotal - parsedScore}</Text>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Incorrect</Text>
            </View>
          </View>
        </View>

        <Divider style={{ marginVertical: 24 }} />

        <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 16 }}>Next Actions</Text>
        
        <View style={styles.actions}>
          <Button mode="contained" onPress={() => {}} style={styles.actionButton}>
            Review Explanations
          </Button>
          <Button mode="outlined" onPress={() => router.push('/practice')} style={styles.actionButton}>
            Practice Another Topic
          </Button>
          <Button mode="text" onPress={() => router.replace('/(tabs)')} style={styles.actionButton}>
            Back to Home
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  title: { textAlign: 'center', fontWeight: 'bold', marginBottom: 32, marginTop: 16 },
  scoreCard: { borderRadius: 24, marginBottom: 24, alignItems: 'center' },
  scoreContent: { paddingVertical: 32, alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: 16 },
  statBox: { flex: 1, borderRadius: 16 },
  statContent: { alignItems: 'center', paddingVertical: 16 },
  actions: { gap: 16 },
  actionButton: { borderRadius: 8, paddingVertical: 4 },
});
