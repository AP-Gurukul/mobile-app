import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Text, useTheme, Button, IconButton, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchPracticeQuestions, fetchMixQuestions, Question, saveAttempt } from '../../services/firestore';
import { auth } from '../../services/firebaseConfig';
import { useReviewStore } from '../../store/useReview';

const { width } = Dimensions.get('window');
const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function ActivePracticeSession() {
  const addAttempts = useReviewStore(state => state.addAttempts);
  const theme = useTheme();
  const { subject, topic, count, mode } = useLocalSearchParams();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const limitCount = parseInt(count as string) || 10;

    let fetched: Question[];
    if (subject === 'all' && topic === 'mix') {
      // Mix Practice mode — pull from all collections
      fetched = await fetchMixQuestions(limitCount);
    } else {
      fetched = await fetchPracticeQuestions(
        subject as string,
        topic as string,
        limitCount
      );
    }

    setQuestions(fetched);
    setLoading(false);
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionId }));
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finish Session
      const score = calculateScore();
      const total = questions.length;

      const sessionAttempts = questions.map((q, idx) => ({
        questionId: q.id,
        questionText: q.text,
        subject: q.subject,
        topic: q.topic,
        selectedOptionId: selectedAnswers[idx] || '',
        correctOptionId: q.correctOptionId,
        isCorrect: selectedAnswers[idx] === q.correctOptionId,
        isBookmarked: false,
        isFlagged: false,
        timeSpentMs: 0,
        attemptedAt: Date.now(),
        explanation: q.explanation,
        options: q.options,
      }));

      addAttempts(sessionAttempts);

      if (auth.currentUser?.uid) {
        await saveAttempt(auth.currentUser.uid, {
          subject: subject as string,
          topic: topic as string,
          score,
          total,
          mode: mode as string,
          timestamp: new Date().toISOString(),
        });
      }

      router.replace({
        pathname: '/practice/result',
        params: { score: score.toString(), total: total.toString() },
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctOptionId) score++;
    });
    return score;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
            Loading questions…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <MaterialCommunityIcons name="book-off-outline" size={64} color={theme.colors.onSurfaceVariant} />
        <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>No questions found</Text>
        <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
          Try selecting a different topic or subject.
        </Text>
        <Button mode="contained" onPress={() => router.back()} style={{ marginTop: 20, borderRadius: 12 }}>
          Go Back
        </Button>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="close" size={22} color={theme.colors.onSurface} />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={styles.progressLabelRow}>
            <Text style={[styles.progressLabel, { color: theme.colors.onSurfaceVariant }]}>
              Question {currentIndex + 1} of {questions.length}
            </Text>
            {mode === 'timed' && (
              <View style={styles.timerBadge}>
                <MaterialCommunityIcons name="clock-outline" size={14} color="#DC2626" />
                <Text style={styles.timerText}>14:59</Text>
              </View>
            )}
          </View>
          <ProgressBar
            progress={progress}
            color={theme.colors.primary}
            style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}
          />
        </View>

        <TouchableOpacity style={styles.bookmarkBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="bookmark-outline" size={22} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subject/Topic badge */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.badgeText, { color: theme.colors.onSurfaceVariant }]}>
              {currentQuestion.subject}
            </Text>
          </View>
          {currentQuestion.topic && (
            <View style={[styles.badge, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text style={[styles.badgeText, { color: theme.colors.onSurfaceVariant }]}>
                {currentQuestion.topic}
              </Text>
            </View>
          )}
        </View>

        {/* Question Card */}
        <View style={[styles.questionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
          <Text style={[styles.questionText, { color: theme.colors.onSurface }]}>
            {currentQuestion.text}
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((opt: any, idx: number) => {
            const isSelected = selectedAnswers[currentIndex] === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => handleSelectOption(opt.id)}
                activeOpacity={0.7}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isSelected ? (theme.dark ? '#1E2740' : '#EEF2FF') : theme.colors.surface,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                <View style={[
                  styles.optionLabel,
                  {
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant,
                  },
                ]}>
                  <Text style={[
                    styles.optionLabelText,
                    { color: isSelected ? '#FFFFFF' : theme.colors.onSurfaceVariant },
                  ]}>
                    {OPTION_LABELS[idx]}
                  </Text>
                </View>
                <Text style={[
                  styles.optionText,
                  {
                    color: theme.colors.onSurface,
                    fontWeight: isSelected ? '600' : '400',
                  },
                ]}>
                  {opt.text}
                </Text>
                {isSelected && (
                  <MaterialCommunityIcons name="check-circle" size={22} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline }]}>
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          activeOpacity={0.7}
          style={[
            styles.navButton,
            {
              borderColor: currentIndex === 0 ? theme.colors.surfaceVariant : theme.colors.outline,
              opacity: currentIndex === 0 ? 0.4 : 1,
            },
          ]}
        >
          <MaterialCommunityIcons name="chevron-left" size={20} color={theme.colors.onSurface} />
          <Text style={[styles.navButtonText, { color: theme.colors.onSurface }]}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>
          <LinearGradient
            colors={isLastQuestion ? ['#059669', '#10B981'] : ['#111111', '#333333'] as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'Submit' : 'Next'}
            </Text>
            <MaterialCommunityIcons
              name={isLastQuestion ? 'check' : 'chevron-right'}
              size={20}
              color="#fff"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingWrap: { alignItems: 'center', gap: 16 },
  loadingText: { fontSize: 15, fontWeight: '500' },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 16 },
  emptySubtitle: { fontSize: 14, marginTop: 6, textAlign: 'center' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: { flex: 1 },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: { fontSize: 13, fontWeight: '600' },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timerText: { color: '#DC2626', fontSize: 13, fontWeight: '700' },
  progressBar: { height: 8, borderRadius: 4 },
  bookmarkBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content
  content: { padding: 16, paddingBottom: 24 },

  // Badges
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Question card
  questionCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 28,
    letterSpacing: -0.2,
  },

  // Options
  optionsContainer: { gap: 12 },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 14,
  },
  optionLabel: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  navButtonText: { fontSize: 14, fontWeight: '600' },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    minHeight: 44,
  },
  nextButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
