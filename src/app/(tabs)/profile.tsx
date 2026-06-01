import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button, Divider, Switch, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { useReviewStore, getStats } from '../../store/useReview';
import { useThemeStore } from '../../store/useThemeStore';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const theme = useTheme();
  const user = auth.currentUser;
  const attempts = useReviewStore((s: any) => s.attempts);
  const stats = useMemo(() => getStats(attempts), [attempts]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'settings'>('analytics');
  
  const themeMode = useThemeStore(state => state.themeMode);
  const setThemeMode = useThemeStore(state => state.setThemeMode);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/(auth)/login');
  };

  const initials = (user?.displayName || user?.email || 'S')[0].toUpperCase();

  const renderAnalytics = () => (
    <>
      {/* Stat Cards */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Attempted', value: `${stats.totalAttempted}`, icon: 'clipboard-list-outline', gradient: ['#4F46E5', '#6366F1'] },
          { label: 'Accuracy', value: `${stats.accuracy}%`, icon: 'target', gradient: ['#0D9488', '#14B8A6'] },
          { label: 'Correct', value: `${stats.correctCount}`, icon: 'check-circle-outline', gradient: ['#059669', '#10B981'] },
          { label: 'Avg Time', value: stats.avgTimeMs > 0 ? `${Math.round(stats.avgTimeMs / 1000)}s` : '—', icon: 'clock-outline', gradient: ['#7C3AED', '#8B5CF6'] },
        ].map((stat) => (
          <LinearGradient
            key={stat.label}
            colors={stat.gradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <MaterialCommunityIcons name={stat.icon as any} size={20} color="rgba(255,255,255,0.7)" />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </LinearGradient>
        ))}
      </View>

      {/* Subject Performance */}
      {Object.keys(stats.subjectWise).length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Subject Performance
          </Text>
          {Object.entries(stats.subjectWise).map(([subject, data]: [string, any]) => (
            <View
              key={subject}
              style={[styles.subjectCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1 }]}
            >
              <View style={styles.subjectRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.subjectName, { color: theme.colors.onSurface }]}>
                    {subject}
                  </Text>
                  <Text style={[styles.subjectMeta, { color: theme.colors.onSurfaceVariant }]}>
                    {data.correct}/{data.total} correct
                  </Text>
                </View>
                <View style={[
                  styles.accuracyPill,
                  {
                    backgroundColor: data.accuracy >= 70
                      ? (theme.dark ? '#064E3B' : '#D1FAE5')
                      : data.accuracy >= 40
                        ? (theme.dark ? '#451A03' : '#FEF3C7')
                        : (theme.dark ? '#450A0A' : '#FEE2E2'),
                  },
                ]}>
                  <Text style={[styles.accuracyText, {
                    color: data.accuracy >= 70
                      ? (theme.dark ? '#6EE7B7' : '#059669')
                      : data.accuracy >= 40
                        ? (theme.dark ? '#FCD34D' : '#D97706')
                        : (theme.dark ? '#FCA5A5' : '#DC2626'),
                  }]}>
                    {data.accuracy}%
                  </Text>
                </View>
              </View>
              <View style={[styles.barBg, { backgroundColor: theme.colors.surfaceVariant }]}>
                <View style={[styles.barFill, {
                  width: `${data.accuracy}%`,
                  backgroundColor: data.accuracy >= 70 ? '#10B981' : data.accuracy >= 40 ? '#F59E0B' : '#EF4444',
                }]} />
              </View>
            </View>
          ))}
        </>
      )}

      {Object.keys(stats.subjectWise).length === 0 && (
        <View style={[styles.emptyCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={[styles.emptyIconWrap, { backgroundColor: theme.colors.surface }]}>
            <MaterialCommunityIcons name="chart-line" size={32} color={theme.colors.onSurfaceVariant} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
            No analytics data yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Complete practice sessions to see your performance breakdown here.
          </Text>
        </View>
      )}
    </>
  );

  const renderSettings = () => (
    <>
      <View style={[styles.settingsCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1 }]}>
        <View style={styles.settingsHeader}>
          <MaterialCommunityIcons name="account-circle-outline" size={22} color={theme.colors.primary} />
          <Text style={[styles.settingsTitle, { color: theme.colors.onSurface }]}>Account</Text>
        </View>
        <Divider style={{ backgroundColor: theme.colors.surfaceVariant }} />
        <View style={styles.settingsBody}>
          <Text style={[styles.settingValue, { color: theme.colors.onSurface }]}>
            {user?.email || 'Not signed in'}
          </Text>
          <Text style={[styles.settingLabel, { color: theme.colors.onSurfaceVariant }]}>
            {user?.displayName || 'Student'}
          </Text>
        </View>
      </View>

      <View style={[styles.settingsCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1 }]}>
        <View style={styles.settingsHeader}>
          <MaterialCommunityIcons name="cog-outline" size={22} color={theme.colors.primary} />
          <Text style={[styles.settingsTitle, { color: theme.colors.onSurface }]}>Preferences</Text>
        </View>
        <Divider style={{ backgroundColor: theme.colors.surfaceVariant }} />
        <View style={styles.settingsBody}>
          <View style={settingStyles.row}>
            <Text style={[settingStyles.label, { color: theme.colors.onSurface }]}>Theme</Text>
            <SegmentedButtons
              value={themeMode}
              onValueChange={setThemeMode as any}
              buttons={[
                { value: 'system', label: 'System' },
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
              style={{ width: 220 }}
              density="small"
            />
          </View>
          <Divider style={{ backgroundColor: theme.colors.surfaceVariant, marginVertical: 8 }} />
          <SettingRow
            label="Language"
            value="English"
            theme={theme}
          />
          <Divider style={{ backgroundColor: theme.colors.surfaceVariant, marginVertical: 8 }} />
          <SettingRow
            label="Notifications"
            value="Enabled"
            theme={theme}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: theme.dark ? '#FCA5A5' : '#DC2626' }]}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="logout" size={20} color={theme.dark ? '#FCA5A5' : '#DC2626'} />
        <Text style={[styles.logoutText, { color: theme.dark ? '#FCA5A5' : '#DC2626' }]}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={theme.dark ? ['#1A1A1A', '#262626'] : ['#4F46E5', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.profileHero, theme.dark && { borderBottomWidth: 1, borderBottomColor: theme.colors.outline }]}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={[styles.userName, theme.dark && { color: theme.colors.onSurface }]}>
            {user?.displayName || 'Student'}
          </Text>
          <Text style={[styles.userEmail, theme.dark && { color: theme.colors.onSurfaceVariant }]}>
            {user?.email || ''}
          </Text>
        </LinearGradient>

        {/* Tab Switcher */}
        <View style={[styles.tabRow, { backgroundColor: theme.colors.surfaceVariant }]}>
          <TouchableOpacity
            onPress={() => setActiveTab('analytics')}
            style={[
              styles.tabButton,
              activeTab === 'analytics' && [styles.tabActive, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }],
            ]}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="chart-bar"
              size={18}
              color={activeTab === 'analytics' ? theme.colors.primary : theme.colors.onSurfaceVariant}
            />
            <Text style={[
              styles.tabLabel,
              { color: activeTab === 'analytics' ? theme.colors.primary : theme.colors.onSurfaceVariant },
            ]}>
              Analytics
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('settings')}
            style={[
              styles.tabButton,
              activeTab === 'settings' && [styles.tabActive, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }],
            ]}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="cog"
              size={18}
              color={activeTab === 'settings' ? theme.colors.primary : theme.colors.onSurfaceVariant}
            />
            <Text style={[
              styles.tabLabel,
              { color: activeTab === 'settings' ? theme.colors.primary : theme.colors.onSurfaceVariant },
            ]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'analytics' ? renderAnalytics() : renderSettings()}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ label, value, theme }: { label: string; value: string; theme: any }) {
  return (
    <View style={settingStyles.row}>
      <Text style={[settingStyles.label, { color: theme.colors.onSurface }]}>{label}</Text>
      <Text style={[settingStyles.value, { color: theme.colors.onSurfaceVariant }]}>{value}</Text>
    </View>
  );
}

const settingStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: { fontSize: 15, fontWeight: '500' },
  value: { fontSize: 13 },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  // Profile hero
  profileHero: {
    paddingVertical: 36,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
  },
  userName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
  },
  userEmail: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 2,
  },
  // Tab switcher
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabActive: {
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  statCard: {
    width: (width - 44) / 2,
    borderRadius: 18,
    padding: 18,
    height: 110,
    justifyContent: 'space-between',
  },
  statValue: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '600',
  },
  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  // Subject cards
  subjectCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '700',
  },
  subjectMeta: {
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
  barBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
  // Empty state
  emptyCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginTop: 8,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  // Settings
  settingsCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  settingsBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingValue: { fontSize: 15, fontWeight: '500' },
  settingLabel: { fontSize: 12, marginTop: 2 },
  // Logout
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
