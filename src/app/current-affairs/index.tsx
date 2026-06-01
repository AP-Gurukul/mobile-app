import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, useTheme, Button, IconButton, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { fetchCurrentAffairs, Question } from '../../services/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CurrentAffairsScreen() {
  const theme = useTheme();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    const fetched = await fetchCurrentAffairs(20);
    setQuestions(fetched);
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onBackground }}>Current Affairs</Text>
        <IconButton icon="calendar-month-outline" onPress={() => {}} iconColor={theme.colors.onBackground} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Highlight Card */}
        <Surface style={[styles.highlightCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1 }]} elevation={0}>
          <View style={styles.highlightTextContainer}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
              Today's Quiz
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4, marginBottom: 16 }}>
              Stay updated with the latest news. {loading ? '...' : questions.length} questions waiting!
            </Text>
            <Button mode="contained" onPress={() => {}} style={{ alignSelf: 'flex-start', borderRadius: 8 }}>
              Start Now
            </Button>
          </View>
          <MaterialCommunityIcons name="newspaper-variant-multiple" size={64} color={theme.colors.primary} style={styles.highlightIcon} />
        </Surface>

        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Available Questions</Text>

        {loading ? (
           <View style={{ padding: 40, alignItems: 'center' }}>
             <ActivityIndicator size="large" color={theme.colors.primary} />
           </View>
        ) : questions.length === 0 ? (
          <Surface style={[styles.emptyCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1 }]} elevation={0}>
            <MaterialCommunityIcons name="newspaper" size={48} color={theme.colors.onSurfaceVariant} />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>No current affairs found</Text>
          </Surface>
        ) : (
          questions.map((q, idx) => (
            <View key={q.id || idx.toString()} style={[styles.quizCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1 }]}>
              <View style={styles.quizContent}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>{q.topic}</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }} numberOfLines={1}>{q.text}</Text>
                </View>
                <Button mode="outlined" compact onPress={() => {}} style={{ borderColor: theme.colors.outline }}>Read</Button>
              </View>
            </View>
          ))
        )}

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
  emptyCard: { padding: 32, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  quizCard: { marginBottom: 12, borderRadius: 12, padding: 16 },
  quizContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
