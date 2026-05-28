import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme, IconButton, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { gradients } from '../../theme/theme';

const { width } = Dimensions.get('window');

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: readonly string[];
  route: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'practice',
    title: 'Practice',
    subtitle: 'Topic-wise MCQs',
    icon: 'book-open-variant',
    gradient: ['#4F46E5', '#6366F1'],
    route: '/(tabs)/practice',
  },
  {
    id: 'tests',
    title: 'Mock Tests',
    subtitle: 'Full-length exams',
    icon: 'timer-outline',
    gradient: ['#7C3AED', '#8B5CF6'],
    route: '/(tabs)/tests',
  },
  {
    id: 'current-affairs',
    title: 'Current Affairs',
    subtitle: 'Daily updates',
    icon: 'newspaper-variant-outline',
    gradient: ['#0D9488', '#14B8A6'],
    route: '/current-affairs',
  },
  {
    id: 'pyq',
    title: 'PYQ Papers',
    subtitle: 'Past year papers',
    icon: 'history',
    gradient: ['#D97706', '#F59E0B'],
    route: '/pyq',
  },
];

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <LinearGradient
          colors={['#4F46E5', '#7C3AED'] as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroGreeting}>Welcome back 👋</Text>
              <Text style={styles.heroName}>Student</Text>
            </View>
            <TouchableOpacity style={styles.bellButton}>
              <MaterialCommunityIcons name="bell-outline" size={22} color="#fff" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          {/* Continue Session */}
          <TouchableOpacity
            style={styles.continueCard}
            onPress={() => router.push('/practice')}
            activeOpacity={0.8}
          >
            <View style={styles.continueTop}>
              <View style={styles.continueIconWrap}>
                <MaterialCommunityIcons name="play-circle" size={20} color="#4F46E5" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.continueTitle}>Continue Practice</Text>
                <Text style={styles.continueSubtitle}>Indian Polity – Fundamental Rights</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#94A3B8" />
            </View>
            <View style={styles.continueBottom}>
              <ProgressBar
                progress={0.6}
                color="#4F46E5"
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>12/20</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statPill, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={[styles.statNumber, { color: theme.colors.onPrimaryContainer }]}>14</Text>
            <Text style={[styles.statLabel, { color: theme.colors.onPrimaryContainer }]}>🔥 Streak</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Text style={[styles.statNumber, { color: theme.colors.onSecondaryContainer }]}>85%</Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSecondaryContainer }]}>Accuracy</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <Text style={[styles.statNumber, { color: theme.colors.onTertiaryContainer }]}>248</Text>
            <Text style={[styles.statLabel, { color: theme.colors.onTertiaryContainer }]}>Solved</Text>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Quick Actions
        </Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              activeOpacity={0.85}
              onPress={() => router.push(action.route as any)}
              style={styles.actionCardWrap}
            >
              <LinearGradient
                colors={action.gradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionCard}
              >
                <View style={styles.actionIconCircle}>
                  <MaterialCommunityIcons name={action.icon as any} size={24} color="#fff" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommended Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Recommended for You
        </Text>

        <TouchableOpacity
          style={[styles.recommendCard, { backgroundColor: theme.colors.surface }]}
          onPress={() => router.push('/(tabs)/review')}
          activeOpacity={0.7}
        >
          <View style={[styles.recommendIcon, { backgroundColor: '#FEE2E2' }]}>
            <MaterialCommunityIcons name="brain" size={24} color="#DC2626" />
          </View>
          <View style={styles.recommendContent}>
            <Text style={[styles.recommendTitle, { color: theme.colors.onSurface }]}>
              Revise Weak Topics
            </Text>
            <Text style={[styles.recommendSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Economics & Modern History need attention
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.recommendCard, { backgroundColor: theme.colors.surface }]}
          onPress={() => router.push('/(tabs)/tests')}
          activeOpacity={0.7}
        >
          <View style={[styles.recommendIcon, { backgroundColor: '#E0E7FF' }]}>
            <MaterialCommunityIcons name="calendar-clock" size={24} color="#4F46E5" />
          </View>
          <View style={styles.recommendContent}>
            <Text style={[styles.recommendTitle, { color: theme.colors.onSurface }]}>
              Upcoming Mock Test
            </Text>
            <Text style={[styles.recommendSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              APPSC Group 2 Full Mock – Tomorrow
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.recommendCard, { backgroundColor: theme.colors.surface, marginBottom: 24 }]}
          onPress={() => router.push('/current-affairs')}
          activeOpacity={0.7}
        >
          <View style={[styles.recommendIcon, { backgroundColor: '#CCFBF1' }]}>
            <MaterialCommunityIcons name="newspaper-variant-outline" size={24} color="#0D9488" />
          </View>
          <View style={styles.recommendContent}>
            <Text style={[styles.recommendTitle, { color: theme.colors.onSurface }]}>
              Daily Current Affairs
            </Text>
            <Text style={[styles.recommendSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              10 new questions available today
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  // Hero
  heroCard: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 24,
    padding: 20,
    paddingBottom: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroGreeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  heroName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: -0.5,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    borderWidth: 1.5,
    borderColor: '#4F46E5',
  },
  // Continue card
  continueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  continueTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  continueSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  continueBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    gap: 10,
  },
  statPill: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    opacity: 0.85,
  },
  // Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 28,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  // Actions grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 12,
    gap: 10,
  },
  actionCardWrap: {
    width: (width - 44) / 2,
  },
  actionCard: {
    borderRadius: 20,
    padding: 18,
    height: 130,
    justifyContent: 'space-between',
  },
  actionIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  actionSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '500',
  },
  // Recommend cards
  recommendCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  recommendIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendContent: {
    flex: 1,
    marginLeft: 14,
  },
  recommendTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  recommendSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
