import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Chip, useTheme, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/useAuth';

const EXAM_OPTIONS = [
  { id: 'appsc_group_1', label: 'APPSC Group 1' },
  { id: 'appsc_group_2', label: 'APPSC Group 2' },
  { id: 'appsc_group_3', label: 'APPSC Group 3' },
  { id: 'appsc_group_4', label: 'APPSC Group 4' },
  { id: 'upsc_csev', label: 'UPSC CSE' },
];

export default function OnboardingScreen() {
  const theme = useTheme();
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const updateExamGoals = useAuthStore((state) => state.updateExamGoals);

  const toggleExam = (id: string) => {
    setSelectedExams((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    updateExamGoals(selectedExams);
    // In a real app, save this to Firestore here
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
            Personalize Your Journey
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
            What exams are you preparing for? (Select all that apply)
          </Text>
        </View>

        <Surface style={styles.chipContainer} elevation={0}>
          {EXAM_OPTIONS.map((exam) => (
            <Chip
              key={exam.id}
              selected={selectedExams.includes(exam.id)}
              onPress={() => toggleExam(exam.id)}
              style={styles.chip}
              mode={selectedExams.includes(exam.id) ? 'flat' : 'outlined'}
            >
              {exam.label}
            </Chip>
          ))}
        </Surface>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleComplete}
          disabled={selectedExams.length === 0}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 24,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: 'transparent',
  },
  chip: {
    borderRadius: 20,
  },
  footer: {
    padding: 24,
    paddingBottom: 32,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
