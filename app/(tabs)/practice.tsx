import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Button, SegmentedButtons, Surface, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const SUBJECTS = [
  { id: 'polity', label: 'Indian Polity' },
  { id: 'history', label: 'Indian History' },
  { id: 'economy', label: 'Economy' },
  { id: 'geography', label: 'Geography' },
];

const TOPICS: Record<string, string[]> = {
  polity: ['Fundamental Rights', 'Directive Principles', 'Parliament', 'Judiciary'],
  history: ['Ancient India', 'Medieval India', 'Modern India', 'Freedom Struggle'],
  economy: ['Banking & Finance', 'Inflation', 'National Income', 'Taxation'],
  geography: ['Physical Geography', 'Indian Geography', 'World Geography', 'Climate'],
};

export default function PracticeScreen() {
  const theme = useTheme();
  const [selectedSubject, setSelectedSubject] = useState<string>('polity');
  const [selectedTopic, setSelectedTopic] = useState<string>('Fundamental Rights');
  const [questionCount, setQuestionCount] = useState<string>('10');
  const [mode, setMode] = useState<string>('practice'); // practice | timed

  const handleStart = () => {
    // Navigate to active session with params
    router.push({
      pathname: '/practice/[sessionId]',
      params: { sessionId: 'new', subject: selectedSubject, topic: selectedTopic, count: questionCount, mode }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
          Start Practice
        </Text>
        
        {/* Subject Selection */}
        <Surface style={styles.section} elevation={1}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Select Subject</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {SUBJECTS.map((subject) => (
              <Button
                key={subject.id}
                mode={selectedSubject === subject.id ? 'contained' : 'outlined'}
                onPress={() => {
                  setSelectedSubject(subject.id);
                  setSelectedTopic(TOPICS[subject.id][0]);
                }}
                style={styles.chip}
              >
                {subject.label}
              </Button>
            ))}
          </ScrollView>
        </Surface>

        {/* Topic Selection */}
        <Surface style={styles.section} elevation={1}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Select Topic</Text>
          <View style={styles.topicList}>
            {TOPICS[selectedSubject]?.map((topic) => (
              <List.Item
                key={topic}
                title={topic}
                onPress={() => setSelectedTopic(topic)}
                style={[
                  styles.topicItem,
                  selectedTopic === topic && { backgroundColor: theme.colors.primaryContainer }
                ]}
                titleStyle={selectedTopic === topic && { color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}
                right={props => selectedTopic === topic ? <List.Icon {...props} icon="check" color={theme.colors.primary} /> : null}
              />
            ))}
          </View>
        </Surface>

        {/* Configuration */}
        <Surface style={styles.section} elevation={1}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Session Configuration</Text>
          <View style={styles.configRow}>
            <Text>Number of Questions</Text>
            <SegmentedButtons
              value={questionCount}
              onValueChange={setQuestionCount}
              buttons={[
                { value: '10', label: '10' },
                { value: '20', label: '20' },
                { value: '30', label: '30' },
              ]}
              style={styles.segmentedButton}
            />
          </View>
          <View style={styles.configRow}>
            <Text>Mode</Text>
            <SegmentedButtons
              value={mode}
              onValueChange={setMode}
              buttons={[
                { value: 'practice', label: 'Practice' },
                { value: 'timed', label: 'Timed' },
              ]}
              style={styles.segmentedButton}
            />
          </View>
        </Surface>

      </ScrollView>

      <View style={styles.footer}>
        <Button mode="contained" onPress={handleStart} style={styles.startButton} contentStyle={styles.startButtonContent}>
          Start Session
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  title: { fontWeight: 'bold', marginBottom: 24 },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: { fontWeight: 'bold', marginBottom: 16 },
  horizontalScroll: { flexDirection: 'row', marginBottom: 8 },
  chip: { marginRight: 8, borderRadius: 20 },
  topicList: { borderRadius: 8, overflow: 'hidden' },
  topicItem: { borderBottomWidth: 1, borderBottomColor: '#e0e0e0', paddingVertical: 4 },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  segmentedButton: { width: 160 },
  footer: { padding: 16, paddingBottom: 32 },
  startButton: { borderRadius: 8 },
  startButtonContent: { paddingVertical: 8 },
});
