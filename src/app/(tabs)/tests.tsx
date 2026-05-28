import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme, Button, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface TestItem {
  id: string;
  title: string;
  type: 'mini' | 'sectional' | 'full';
  questions: number;
  duration: number;
  subject?: string;
  status: 'upcoming' | 'available' | 'completed';
  score?: number;
}

const MOCK_TESTS: TestItem[] = [
  { id: '1', title: 'Quick Polity Check', type: 'mini', questions: 10, duration: 10, subject: 'Polity', status: 'available' },
  { id: '2', title: 'Economy Sectional', type: 'sectional', questions: 30, duration: 30, subject: 'Economy', status: 'available' },
  { id: '3', title: 'APPSC Group 2 Mock 1', type: 'full', questions: 150, duration: 150, status: 'available' },
  { id: '4', title: 'History Sectional', type: 'sectional', questions: 25, duration: 25, subject: 'History', status: 'upcoming' },
  { id: '5', title: 'Weekly Assessment', type: 'mini', questions: 15, duration: 15, status: 'completed', score: 80 },
];

const TYPE_CONFIG: Record<string, { label: string; emoji: string; gradient: string[] }> = {
  mini: { label: 'Mini Test', emoji: '⚡', gradient: ['#0D9488', '#14B8A6'] },
  sectional: { label: 'Sectional', emoji: '📚', gradient: ['#4F46E5', '#6366F1'] },
  full: { label: 'Full Mock', emoji: '🎯', gradient: ['#7C3AED', '#8B5CF6'] },
};

export default function TestsScreen() {
  const theme = useTheme();

  const available = MOCK_TESTS.filter((t) => t.status === 'available');
  const upcoming = MOCK_TESTS.filter((t) => t.status === 'upcoming');
  const completed = MOCK_TESTS.filter((t) => t.status === 'completed');

  const renderTestCard = (test: TestItem) => {
    const config = TYPE_CONFIG[test.type];
    return (
      <View
        key={test.id}
        style={[styles.testCard, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.testTop}>
          <View style={{ flex: 1 }}>
            <View style={styles.typeRow}>
              <LinearGradient
                colors={config.gradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.typeBadge}
              >
                <Text style={styles.typeBadgeText}>{config.emoji} {config.label}</Text>
              </LinearGradient>
            </View>
            <Text style={[styles.testTitle, { color: theme.colors.onSurface }]}>
              {test.title}
            </Text>
          </View>
          {test.status === 'completed' && test.score !== undefined && (
            <View style={[
              styles.scoreBadge,
              {
                backgroundColor: test.score >= 70
                  ? (theme.dark ? '#064E3B' : '#D1FAE5')
                  : (theme.dark ? '#451A03' : '#FEF3C7'),
              },
            ]}>
              <Text style={[styles.scoreText, {
                color: test.score >= 70
                  ? (theme.dark ? '#6EE7B7' : '#059669')
                  : (theme.dark ? '#FCD34D' : '#D97706'),
              }]}>
                {test.score}%
              </Text>
            </View>
          )}
        </View>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="help-circle-outline" size={15} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
              {test.questions} Qs
            </Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="clock-outline" size={15} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
              {test.duration} min
            </Text>
          </View>
          {test.subject && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="book-outline" size={15} color={theme.colors.onSurfaceVariant} />
              <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                {test.subject}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.testActions}>
          {test.status === 'available' && (
            <TouchableOpacity activeOpacity={0.85}>
              <LinearGradient
                colors={config.gradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startTestBtn}
              >
                <Text style={styles.startTestText}>Start Test</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          {test.status === 'upcoming' && (
            <View style={[styles.comingSoonBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.onSurfaceVariant} />
              <Text style={[styles.comingSoonText, { color: theme.colors.onSurfaceVariant }]}>Coming Soon</Text>
            </View>
          )}
          {test.status === 'completed' && (
            <View style={styles.completedActions}>
              <TouchableOpacity style={[styles.outlineBtn, { borderColor: theme.colors.outline }]} activeOpacity={0.7}>
                <Text style={[styles.outlineBtnText, { color: theme.colors.primary }]}>View Analysis</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.outlineBtn, { borderColor: theme.colors.outline }]} activeOpacity={0.7}>
                <Text style={[styles.outlineBtnText, { color: theme.colors.primary }]}>Reattempt</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.pageTitle, { color: theme.colors.onSurface }]}>Test Series</Text>
            <Text style={[styles.pageSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Practice under real exam conditions
            </Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <MaterialCommunityIcons name="timer" size={24} color={theme.colors.tertiary} />
          </View>
        </View>

        {/* Available Tests */}
        {available.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Available Now</Text>
            {available.map(renderTestCard)}
          </>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, marginTop: 8 }]}>Upcoming</Text>
            {upcoming.map(renderTestCard)}
          </>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, marginTop: 8 }]}>Completed</Text>
            {completed.map(renderTestCard)}
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  // Test card
  testCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  testTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  typeRow: { marginBottom: 8 },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '800',
  },
  // Meta
  metaRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Actions
  testActions: {
    marginTop: 14,
  },
  startTestBtn: {
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  startTestText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  completedActions: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  outlineBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
