import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme, Button, IconButton, Chip, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TestItem {
  id: string;
  title: string;
  type: 'mini' | 'sectional' | 'full';
  questions: number;
  duration: number; // minutes
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

const getTypeColor = (type: string, theme: any) => {
  switch (type) {
    case 'mini': return theme.colors.secondaryContainer;
    case 'sectional': return theme.colors.primaryContainer;
    case 'full': return theme.colors.tertiaryContainer;
    default: return theme.colors.surfaceVariant;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'mini': return '⚡ Mini Test';
    case 'sectional': return '📚 Sectional';
    case 'full': return '🎯 Full Mock';
    default: return type;
  }
};

export default function TestsScreen() {
  const theme = useTheme();

  const available = MOCK_TESTS.filter((t) => t.status === 'available');
  const upcoming = MOCK_TESTS.filter((t) => t.status === 'upcoming');
  const completed = MOCK_TESTS.filter((t) => t.status === 'completed');

  const renderTestCard = (test: TestItem) => (
    <Card key={test.id} style={styles.testCard}>
      <Card.Content>
        <View style={styles.testHeader}>
          <View style={{ flex: 1 }}>
            <Chip
              compact
              style={[styles.typeChip, { backgroundColor: getTypeColor(test.type, theme) }]}
              textStyle={{ fontSize: 11 }}
            >
              {getTypeLabel(test.type)}
            </Chip>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginTop: 8 }}>
              {test.title}
            </Text>
          </View>
          {test.status === 'completed' && test.score !== undefined && (
            <View style={[styles.scoreBadge, { backgroundColor: test.score >= 70 ? '#D1FAE5' : '#FEF3C7' }]}>
              <Text style={{ fontWeight: 'bold', color: test.score >= 70 ? '#065F46' : '#92400E' }}>
                {test.score}%
              </Text>
            </View>
          )}
        </View>

        <View style={styles.testMeta}>
          <View style={styles.metaItem}>
            <IconButton icon="help-circle-outline" size={16} style={styles.metaIcon} />
            <Text variant="bodySmall">{test.questions} Qs</Text>
          </View>
          <View style={styles.metaItem}>
            <IconButton icon="clock-outline" size={16} style={styles.metaIcon} />
            <Text variant="bodySmall">{test.duration} min</Text>
          </View>
          {test.subject && (
            <View style={styles.metaItem}>
              <IconButton icon="book-outline" size={16} style={styles.metaIcon} />
              <Text variant="bodySmall">{test.subject}</Text>
            </View>
          )}
        </View>
      </Card.Content>
      <Card.Actions>
        {test.status === 'available' && (
          <Button mode="contained" compact onPress={() => {}}>Start Test</Button>
        )}
        {test.status === 'upcoming' && (
          <Button mode="outlined" compact disabled>Coming Soon</Button>
        )}
        {test.status === 'completed' && (
          <>
            <Button mode="text" compact onPress={() => {}}>View Analysis</Button>
            <Button mode="outlined" compact onPress={() => {}}>Reattempt</Button>
          </>
        )}
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          Test Series
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 24 }}>
          Practice under real exam conditions
        </Text>

        {/* Available Tests */}
        {available.length > 0 && (
          <>
            <Text variant="titleMedium" style={styles.sectionTitle}>Available Now</Text>
            {available.map(renderTestCard)}
          </>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <>
            <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 16 }]}>Upcoming</Text>
            {upcoming.map(renderTestCard)}
          </>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <>
            <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 16 }]}>Completed</Text>
            {completed.map(renderTestCard)}
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
  sectionTitle: { fontWeight: 'bold', marginBottom: 12 },
  testCard: { borderRadius: 12, marginBottom: 12 },
  testHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  typeChip: { alignSelf: 'flex-start' },
  scoreBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  testMeta: { flexDirection: 'row', marginTop: 12, gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaIcon: { margin: 0, padding: 0 },
});
