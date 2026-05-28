import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, useTheme, Button, Divider, IconButton, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../src/services/firebaseConfig';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { useReviewStore } from '../../src/store/useReview';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const theme = useTheme();
  const user = auth.currentUser;
  const stats = useReviewStore((s) => s.getStats());
  const [activeTab, setActiveTab] = useState<'analytics' | 'settings'>('analytics');

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/(auth)/login');
  };

  const renderAnalytics = () => (
    <>
      {/* Overall Stats */}
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Overall Performance
      </Text>
      <View style={styles.statsGrid}>
        <Surface style={[styles.statBox, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onPrimaryContainer }}>
            {stats.totalAttempted}
          </Text>
          <Text variant="labelMedium" style={{ color: theme.colors.onPrimaryContainer }}>Attempted</Text>
        </Surface>
        <Surface style={[styles.statBox, { backgroundColor: theme.colors.secondaryContainer }]} elevation={0}>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onSecondaryContainer }}>
            {stats.accuracy}%
          </Text>
          <Text variant="labelMedium" style={{ color: theme.colors.onSecondaryContainer }}>Accuracy</Text>
        </Surface>
        <Surface style={[styles.statBox, { backgroundColor: theme.colors.tertiaryContainer }]} elevation={0}>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onTertiaryContainer }}>
            {stats.correctCount}
          </Text>
          <Text variant="labelMedium" style={{ color: theme.colors.onTertiaryContainer }}>Correct</Text>
        </Surface>
        <Surface style={[styles.statBox, { backgroundColor: theme.colors.errorContainer }]} elevation={0}>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onErrorContainer }}>
            {stats.avgTimeMs > 0 ? Math.round(stats.avgTimeMs / 1000) + 's' : '-'}
          </Text>
          <Text variant="labelMedium" style={{ color: theme.colors.onErrorContainer }}>Avg Time</Text>
        </Surface>
      </View>

      {/* Subject-wise Breakdown */}
      {Object.keys(stats.subjectWise).length > 0 && (
        <>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Subject Performance
          </Text>
          {Object.entries(stats.subjectWise).map(([subject, data]) => (
            <Surface key={subject} style={styles.subjectCard} elevation={1}>
              <View style={styles.subjectRow}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>{subject}</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {data.correct}/{data.total} correct
                  </Text>
                </View>
                <View style={[
                  styles.accuracyPill,
                  { backgroundColor: data.accuracy >= 70 ? '#D1FAE5' : data.accuracy >= 40 ? '#FEF3C7' : '#FEE2E2' }
                ]}>
                  <Text style={{
                    fontWeight: 'bold',
                    color: data.accuracy >= 70 ? '#065F46' : data.accuracy >= 40 ? '#92400E' : '#991B1B',
                  }}>
                    {data.accuracy}%
                  </Text>
                </View>
              </View>
              {/* Simple bar */}
              <View style={[styles.barBg, { backgroundColor: theme.colors.surfaceVariant }]}>
                <View style={[styles.barFill, {
                  width: `${data.accuracy}%`,
                  backgroundColor: data.accuracy >= 70 ? '#10B981' : data.accuracy >= 40 ? '#F59E0B' : '#EF4444',
                }]} />
              </View>
            </Surface>
          ))}
        </>
      )}

      {Object.keys(stats.subjectWise).length === 0 && (
        <Surface style={[styles.emptyCard, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
          <IconButton icon="chart-line" size={48} iconColor={theme.colors.onSurfaceVariant} />
          <Text variant="titleMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
            No analytics data yet
          </Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
            Complete practice sessions to see your performance breakdown here.
          </Text>
        </Surface>
      )}
    </>
  );

  const renderSettings = () => (
    <>
      <Card style={styles.settingsCard}>
        <Card.Title title="Account" left={(props) => <IconButton {...props} icon="account-circle" />} />
        <Divider />
        <Card.Content style={{ paddingVertical: 12 }}>
          <Text variant="bodyLarge">{user?.email || 'Not signed in'}</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {user?.displayName || 'Student'}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.settingsCard}>
        <Card.Title title="Preferences" left={(props) => <IconButton {...props} icon="cog" />} />
        <Divider />
        <Card.Content style={{ paddingVertical: 8 }}>
          <View style={styles.settingRow}>
            <Text>Dark Mode</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Follow System</Text>
          </View>
          <Divider style={{ marginVertical: 8 }} />
          <View style={styles.settingRow}>
            <Text>Language</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>English</Text>
          </View>
          <Divider style={{ marginVertical: 8 }} />
          <View style={styles.settingRow}>
            <Text>Notifications</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Enabled</Text>
          </View>
        </Card.Content>
      </Card>

      <Button mode="outlined" onPress={handleLogout} textColor={theme.colors.error} style={styles.logoutButton}>
        Sign Out
      </Button>
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text variant="headlineLarge" style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}>
              {(user?.displayName || user?.email || 'S')[0].toUpperCase()}
            </Text>
          </View>
          <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginTop: 12 }}>
            {user?.displayName || 'Student'}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {user?.email || ''}
          </Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          <Button
            mode={activeTab === 'analytics' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('analytics')}
            style={styles.tabButton}
            compact
          >
            Analytics
          </Button>
          <Button
            mode={activeTab === 'settings' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('settings')}
            style={styles.tabButton}
            compact
          >
            Settings
          </Button>
        </View>

        <Divider style={{ marginBottom: 16 }} />

        {activeTab === 'analytics' ? renderAnalytics() : renderSettings()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  profileHeader: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center',
  },
  tabRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  tabButton: { flex: 1, borderRadius: 8 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12, marginTop: 8 },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24,
  },
  statBox: {
    width: (width - 44) / 2, paddingVertical: 20, paddingHorizontal: 16,
    borderRadius: 16, alignItems: 'center',
  },
  subjectCard: { padding: 16, borderRadius: 12, marginBottom: 8 },
  subjectRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  accuracyPill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  barBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  emptyCard: { padding: 32, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  settingsCard: { borderRadius: 12, marginBottom: 12 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  logoutButton: { marginTop: 24, borderRadius: 8, borderColor: '#EF4444' },
});
