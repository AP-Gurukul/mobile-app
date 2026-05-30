import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme, Button, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const SUBJECTS = [
  { id: 'polity', label: 'Indian Polity', icon: 'gavel' },
  { id: 'history', label: 'Indian History', icon: 'pillar' },
  { id: 'economy', label: 'Economy', icon: 'chart-line' },
  { id: 'geography', label: 'Geography', icon: 'earth' },
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
  const [mode, setMode] = useState<string>('practice');

  const handleStart = () => {
    router.push({
      pathname: '/practice/[sessionId]',
      params: { sessionId: 'new', subject: selectedSubject, topic: selectedTopic, count: questionCount, mode },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.pageTitle, { color: theme.colors.onSurface }]}>Start Practice</Text>
            <Text style={[styles.pageSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Choose a subject & topic to begin
            </Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="book-open-variant" size={24} color={theme.colors.primary} />
          </View>
        </View>

        {/* Subject Selection */}
        <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>Subject</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {SUBJECTS.map((subject) => {
            const isSelected = selectedSubject === subject.id;
            return (
              <TouchableOpacity
                key={subject.id}
                onPress={() => {
                  setSelectedSubject(subject.id);
                  setSelectedTopic(TOPICS[subject.id][0]);
                }}
                activeOpacity={0.8}
                style={styles.subjectChipWrap}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={['#4F46E5', '#6366F1'] as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.subjectChip}
                  >
                    <MaterialCommunityIcons name={subject.icon as any} size={18} color="#fff" />
                    <Text style={styles.subjectChipTextActive}>{subject.label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.subjectChip, {
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.outline,
                  }]}>
                    <MaterialCommunityIcons name={subject.icon as any} size={18} color={theme.colors.onSurfaceVariant} />
                    <Text style={[styles.subjectChipText, { color: theme.colors.onSurface }]}>
                      {subject.label}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Topic Selection */}
        <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>Topic</Text>
        <View style={[styles.topicCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1 }]}>
          {TOPICS[selectedSubject]?.map((topic, index) => {
            const isSelected = selectedTopic === topic;
            return (
              <TouchableOpacity
                key={topic}
                onPress={() => setSelectedTopic(topic)}
                style={[
                  styles.topicRow,
                  index < TOPICS[selectedSubject].length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.surfaceVariant,
                  },
                  isSelected && { backgroundColor: theme.dark ? '#1E2740' : '#EEF2FF' },
                ]}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.radioOuter,
                  { borderColor: isSelected ? theme.colors.primary : theme.colors.outline },
                ]}>
                  {isSelected && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
                </View>
                <Text style={[
                  styles.topicText,
                  { color: theme.colors.onSurface },
                  isSelected && { fontWeight: '700', color: theme.colors.primary },
                ]}>
                  {topic}
                </Text>
                {isSelected && (
                  <MaterialCommunityIcons name="check" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Configuration */}
        <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>Configuration</Text>
        <View style={[styles.configCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1 }]}>
          <View style={styles.configRow}>
            <Text style={[styles.configLabel, { color: theme.colors.onSurface }]}>Questions</Text>
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
          <View style={[styles.configDivider, { backgroundColor: theme.colors.surfaceVariant }]} />
          <View style={styles.configRow}>
            <Text style={[styles.configLabel, { color: theme.colors.onSurface }]}>Mode</Text>
            <SegmentedButtons
              value={mode}
              onValueChange={setMode}
              buttons={[
                { value: 'practice', label: '📝 Practice' },
                { value: 'timed', label: '⏱️ Timed' },
              ]}
              style={styles.segmentedButton}
            />
          </View>
        </View>
      </ScrollView>

      {/* Start Button */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleStart} activeOpacity={0.85}>
          <LinearGradient
            colors={['#4F46E5', '#7C3AED'] as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButton}
          >
            <MaterialCommunityIcons name="play" size={22} color="#fff" />
            <Text style={styles.startText}>Start Session</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },
  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  pageTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 14, marginTop: 2 },
  headerIcon: {
    width: 48, height: 48, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  // Section label
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 4,
    letterSpacing: -0.2,
  },
  // Subject chips
  horizontalScroll: { flexDirection: 'row', marginBottom: 20 },
  subjectChipWrap: { marginRight: 10 },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
  },
  subjectChipText: { fontSize: 13, fontWeight: '600' },
  subjectChipTextActive: { color: '#fff', fontSize: 13, fontWeight: '600' },
  // Topic card
  topicCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  radioInner: {
    width: 10, height: 10, borderRadius: 5,
  },
  topicText: { flex: 1, fontSize: 15 },
  // Config
  configCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configLabel: { fontSize: 15, fontWeight: '600' },
  configDivider: { height: 1, marginVertical: 14 },
  segmentedButton: { width: 170 },
  // Footer
  footer: {
    padding: 16,
    paddingBottom: 28,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  startText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
