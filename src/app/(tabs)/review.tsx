import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useReviewStore, getWrongAnswers, getBookmarked, getFlagged, getWeakTopics } from '../../store/useReview';

const { width } = Dimensions.get('window');

interface SmartListItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string[];
  count: number;
}

export default function ReviewScreen() {
  const theme = useTheme();
  const attempts = useReviewStore((s: any) => s.attempts);

  const wrongAnswers = useMemo(() => getWrongAnswers(attempts), [attempts]);
  const bookmarked = useMemo(() => getBookmarked(attempts), [attempts]);
  const flagged = useMemo(() => getFlagged(attempts), [attempts]);
  const weakTopics = useMemo(() => getWeakTopics(attempts), [attempts]);

  const smartLists: SmartListItem[] = [
    {
      id: 'wrong',
      title: 'Wrong Answers',
      subtitle: 'Retry to improve',
      icon: 'close-circle-outline',
      gradient: ['#DC2626', '#EF4444'],
      count: wrongAnswers.length,
    },
    {
      id: 'bookmarked',
      title: 'Bookmarked',
      subtitle: 'Saved for later',
      icon: 'bookmark',
      gradient: ['#4F46E5', '#6366F1'],
      count: bookmarked.length,
    },
    {
      id: 'flagged',
      title: 'Flagged',
      subtitle: 'Marked during practice',
      icon: 'flag',
      gradient: ['#D97706', '#F59E0B'],
      count: flagged.length,
    },
    {
      id: 'weak',
      title: 'Weak Topics',
      subtitle: 'Below 50% accuracy',
      icon: 'alert-circle-outline',
      gradient: ['#7C3AED', '#8B5CF6'],
      count: weakTopics.length,
    },
  ];

  const hasData = wrongAnswers.length > 0 || bookmarked.length > 0 || flagged.length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.pageTitle, { color: theme.colors.onSurface }]}>Review Center</Text>
            <Text style={[styles.pageSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Smart lists from your practice
            </Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="text-box-check" size={24} color={theme.colors.primary} />
          </View>
        </View>

        {/* Empty State */}
        {!hasData && (
          <View style={[styles.emptyCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <View style={[styles.emptyIconWrap, { backgroundColor: theme.colors.surface }]}>
              <MaterialCommunityIcons name="book-open-page-variant" size={36} color={theme.colors.onSurfaceVariant} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
              No review items yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Start practicing to build your personalized review queue. Wrong answers, bookmarks, and weak topics appear here automatically.
            </Text>
          </View>
        )}

        {/* Smart List Cards */}
        <View style={styles.listsGrid}>
          {smartLists.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={styles.listCardWrap}
            >
              <LinearGradient
                colors={item.gradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.listCard}
              >
                <View style={styles.listCardTop}>
                  <View style={styles.listIconCircle}>
                    <MaterialCommunityIcons name={item.icon as any} size={22} color="#fff" />
                  </View>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{item.count}</Text>
                  </View>
                </View>
                <Text style={styles.listTitle}>{item.title}</Text>
                <Text style={styles.listSubtitle}>{item.subtitle}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weak Topics Breakdown */}
        {weakTopics.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Topics That Need Work
            </Text>
            {weakTopics.map((topic: any, index: number) => (
              <View
                key={index}
                style={[styles.weakCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1 }]}
              >
                <View style={styles.weakRow}>
                  <View style={[styles.weakDot, {
                    backgroundColor: topic.accuracy < 30 ? '#DC2626' : '#D97706',
                  }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.weakTopicName, { color: theme.colors.onSurface }]}>
                      {topic.topic}
                    </Text>
                    <Text style={[styles.weakMeta, { color: theme.colors.onSurfaceVariant }]}>
                      {topic.subject} · {topic.count} questions
                    </Text>
                  </View>
                  <View style={[
                    styles.accuracyPill,
                    {
                      backgroundColor: topic.accuracy < 30
                        ? (theme.dark ? '#450A0A' : '#FEE2E2')
                        : (theme.dark ? '#451A03' : '#FEF3C7'),
                    },
                  ]}>
                    <Text style={[styles.accuracyText, {
                      color: topic.accuracy < 30
                        ? (theme.dark ? '#FCA5A5' : '#DC2626')
                        : (theme.dark ? '#FCD34D' : '#D97706'),
                    }]}>
                      {topic.accuracy}%
                    </Text>
                  </View>
                </View>
                {/* Mini progress bar */}
                <View style={[styles.weakBarBg, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <View style={[styles.weakBarFill, {
                    width: `${topic.accuracy}%`,
                    backgroundColor: topic.accuracy < 30 ? '#DC2626' : '#D97706',
                  }]} />
                </View>
              </View>
            ))}
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
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Empty state
  emptyCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  // Smart list grid
  listsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  listCardWrap: {
    width: (width - 44) / 2,
  },
  listCard: {
    borderRadius: 20,
    padding: 18,
    height: 140,
    justifyContent: 'space-between',
  },
  listCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  listIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  listTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  listSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '500',
  },
  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  // Weak topic cards
  weakCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  weakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weakDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  weakTopicName: {
    fontSize: 15,
    fontWeight: '700',
  },
  weakMeta: {
    fontSize: 12,
    marginTop: 1,
  },
  accuracyPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  accuracyText: {
    fontSize: 13,
    fontWeight: '800',
  },
  weakBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  weakBarFill: {
    height: 6,
    borderRadius: 3,
  },
});
