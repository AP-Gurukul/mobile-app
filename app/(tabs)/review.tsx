import React from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Card, useTheme, IconButton, Badge, Surface, Divider, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReviewStore } from '../../src/store/useReview';

interface ReviewListItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  count: number;
  filterType: 'wrong' | 'bookmarked' | 'flagged' | 'weak';
}

export default function ReviewScreen() {
  const theme = useTheme();
  const wrongAnswers = useReviewStore((s) => s.getWrongAnswers());
  const bookmarked = useReviewStore((s) => s.getBookmarked());
  const flagged = useReviewStore((s) => s.getFlagged());
  const weakTopics = useReviewStore((s) => s.getWeakTopics());

  const smartLists: ReviewListItem[] = [
    {
      id: 'wrong',
      title: 'Wrong Answers',
      subtitle: 'Questions you got wrong — retry to improve',
      icon: 'close-circle-outline',
      iconColor: theme.colors.error,
      count: wrongAnswers.length,
      filterType: 'wrong',
    },
    {
      id: 'bookmarked',
      title: 'Bookmarked',
      subtitle: 'Important questions you saved for later',
      icon: 'bookmark-outline',
      iconColor: theme.colors.primary,
      count: bookmarked.length,
      filterType: 'bookmarked',
    },
    {
      id: 'flagged',
      title: 'Flagged for Review',
      subtitle: 'Questions marked during practice',
      icon: 'flag-outline',
      iconColor: '#F59E0B',
      count: flagged.length,
      filterType: 'flagged',
    },
    {
      id: 'weak',
      title: 'Weak Topics',
      subtitle: 'Topics below 50% accuracy — needs revision',
      icon: 'alert-circle-outline',
      iconColor: '#EF4444',
      count: weakTopics.length,
      filterType: 'weak',
    },
  ];

  const hasData = wrongAnswers.length > 0 || bookmarked.length > 0 || flagged.length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          Review Center
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 24 }}>
          Smart lists built from your practice sessions
        </Text>

        {!hasData && (
          <Surface style={[styles.emptyCard, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
            <IconButton icon="book-open-page-variant" size={48} iconColor={theme.colors.onSurfaceVariant} />
            <Text variant="titleMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
              No review items yet
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
              Start practicing to build your personalized review queue. Wrong answers, bookmarks, and weak topics will appear here automatically.
            </Text>
          </Surface>
        )}

        {/* Smart Lists */}
        {smartLists.map((item) => (
          <Card key={item.id} style={styles.listCard} onPress={() => {}}>
            <Card.Title
              title={item.title}
              subtitle={item.subtitle}
              left={(props) => <IconButton {...props} icon={item.icon} iconColor={item.iconColor} />}
              right={(props) => (
                <View style={styles.badgeContainer}>
                  <Badge style={[styles.badge, { backgroundColor: item.count > 0 ? item.iconColor : theme.colors.surfaceVariant }]}>
                    {item.count}
                  </Badge>
                  <IconButton {...props} icon="chevron-right" />
                </View>
              )}
            />
          </Card>
        ))}

        <Divider style={{ marginVertical: 24 }} />

        {/* Weak Topics Breakdown */}
        {weakTopics.length > 0 && (
          <>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Topics That Need Work
            </Text>
            {weakTopics.map((topic, index) => (
              <Surface key={index} style={styles.weakTopicCard} elevation={1}>
                <View style={styles.weakTopicRow}>
                  <View style={{ flex: 1 }}>
                    <Text variant="titleSmall">{topic.topic}</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {topic.subject} • {topic.count} questions attempted
                    </Text>
                  </View>
                  <View style={styles.accuracyBadge}>
                    <Text variant="labelLarge" style={{ color: topic.accuracy < 30 ? theme.colors.error : '#F59E0B', fontWeight: 'bold' }}>
                      {topic.accuracy}%
                    </Text>
                  </View>
                </View>
              </Surface>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  title: { fontWeight: 'bold', marginBottom: 4 },
  listCard: { marginBottom: 12, borderRadius: 12 },
  badgeContainer: { flexDirection: 'row', alignItems: 'center' },
  badge: { color: '#fff', fontWeight: 'bold' },
  emptyCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12 },
  weakTopicCard: { padding: 16, borderRadius: 12, marginBottom: 8 },
  weakTopicRow: { flexDirection: 'row', alignItems: 'center' },
  accuracyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
