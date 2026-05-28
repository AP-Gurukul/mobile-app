import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme, Button, IconButton, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const DAILY_QUIZZES = [
  { id: '1', date: 'Oct 24, 2023', title: 'Daily Current Affairs Quiz', questions: 10, status: 'pending' },
  { id: '2', date: 'Oct 23, 2023', title: 'Daily Current Affairs Quiz', questions: 10, status: 'completed', score: 8 },
  { id: '3', date: 'Oct 22, 2023', title: 'Daily Current Affairs Quiz', questions: 10, status: 'completed', score: 9 },
];

export default function CurrentAffairsScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Current Affairs</Text>
        <IconButton icon="calendar-month-outline" onPress={() => {}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Highlight Card */}
        <Surface style={[styles.highlightCard, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
          <View style={styles.highlightTextContainer}>
            <Text variant="titleLarge" style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}>
              Today's Quiz
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginTop: 4, marginBottom: 16 }}>
              Stay updated with the latest news. 10 questions waiting!
            </Text>
            <Button mode="contained" onPress={() => {}} style={{ alignSelf: 'flex-start' }}>
              Start Now
            </Button>
          </View>
          <IconButton icon="newspaper-variant-multiple" size={64} iconColor={theme.colors.primary} style={styles.highlightIcon} />
        </Surface>

        <Text variant="titleMedium" style={styles.sectionTitle}>Previous Quizzes</Text>

        {DAILY_QUIZZES.map((quiz) => (
          <Card key={quiz.id} style={styles.quizCard}>
            <Card.Content style={styles.quizContent}>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{quiz.date}</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{quiz.questions} Questions</Text>
              </View>
              {quiz.status === 'completed' ? (
                <View style={styles.scoreContainer}>
                  <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                    {quiz.score}/10
                  </Text>
                </View>
              ) : (
                <Button mode="contained-tonal" compact onPress={() => {}}>Start</Button>
              )}
            </Card.Content>
          </Card>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 4 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  highlightCard: {
    flexDirection: 'row',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  highlightTextContainer: { flex: 1, zIndex: 2 },
  highlightIcon: { position: 'absolute', right: -10, bottom: -10, opacity: 0.2, zIndex: 1 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 16 },
  quizCard: { marginBottom: 12, borderRadius: 12 },
  quizContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scoreContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
