import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, useTheme, Button, IconButton, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>Welcome back,</Text>
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>Student</Text>
          </View>
          <IconButton icon="bell-outline" size={24} onPress={() => {}} />
        </View>

        {/* Continue Session Card */}
        <Card style={styles.card} onPress={() => router.push('/practice')}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: '600' }}>Continue Practice</Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              Indian Polity - Fundamental Rights
            </Text>
            <View style={styles.progressContainer}>
              <ProgressBar progress={0.6} color={theme.colors.primary} style={styles.progressBar} />
              <Text variant="labelSmall">12/20</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Daily Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={[styles.statCard, { backgroundColor: theme.colors.primaryContainer }]}>
            <Card.Content style={styles.statContent}>
              <Text variant="displaySmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}>14</Text>
              <Text variant="labelMedium" style={{ color: theme.colors.onPrimaryContainer }}>Day Streak</Text>
            </Card.Content>
          </Card>
          <Card style={[styles.statCard, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Card.Content style={styles.statContent}>
              <Text variant="displaySmall" style={{ color: theme.colors.onSecondaryContainer, fontWeight: 'bold' }}>85%</Text>
              <Text variant="labelMedium" style={{ color: theme.colors.onSecondaryContainer }}>Accuracy</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Smart Actions */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Recommended Actions</Text>
        
        <Card style={styles.actionCard} onPress={() => router.push('/review')}>
          <Card.Title
            title="Revise Weak Topics"
            subtitle="Economics & Modern History"
            left={(props) => <IconButton {...props} icon="brain" iconColor={theme.colors.error} />}
            right={(props) => <IconButton {...props} icon="chevron-right" />}
          />
        </Card>

        <Card style={styles.actionCard} onPress={() => router.push('/current-affairs')}>
          <Card.Title
            title="Daily Current Affairs"
            subtitle="10 questions waiting for you"
            left={(props) => <IconButton {...props} icon="newspaper-variant-outline" iconColor={theme.colors.primary} />}
            right={(props) => <IconButton {...props} icon="chevron-right" />}
          />
        </Card>

        <Card style={styles.actionCard} onPress={() => router.push('/pyq')}>
          <Card.Title
            title="Previous Year Papers"
            subtitle="Practice from official past exams"
            left={(props) => <IconButton {...props} icon="history" iconColor={theme.colors.tertiary} />}
            right={(props) => <IconButton {...props} icon="chevron-right" />}
          />
        </Card>

        <Card style={styles.actionCard} onPress={() => router.push('/tests')}>
          <Card.Title
            title="Upcoming Mock Test"
            subtitle="APPSC Group 2 Full Mock - Tomorrow"
            left={(props) => <IconButton {...props} icon="calendar-clock" iconColor={theme.colors.secondary} />}
            right={(props) => <IconButton {...props} icon="chevron-right" />}
          />
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  card: {
    marginBottom: 24,
    borderRadius: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
});
