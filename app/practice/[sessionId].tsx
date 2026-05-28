import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, useTheme, Button, IconButton, ProgressBar, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { fetchPracticeQuestions, Question } from '../../src/services/firestore';

export default function ActivePracticeSession() {
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
    const fetched = await fetchPracticeQuestions(
      subject as string, 
      topic as string, 
      parseInt(count as string) || 10
    );
    setQuestions(fetched);
    setLoading(false);
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finish Session
      router.replace({
        pathname: '/practice/result',
        // In a real app, you would pass the session ID to fetch results from store
        params: { score: calculateScore(), total: questions.length }
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
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text>No questions found for this topic.</Text>
        <Button mode="contained" onPress={() => router.back()} style={{ marginTop: 16 }}>Go Back</Button>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="close" onPress={() => router.back()} />
        <View style={styles.progressContainer}>
          <Text variant="labelLarge">{currentIndex + 1} of {questions.length}</Text>
          <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
        </View>
        <View style={styles.actions}>
          <IconButton icon="bookmark-outline" />
          {mode === 'timed' && <Text variant="labelLarge" style={{ color: theme.colors.error }}>14:59</Text>}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Question Area */}
        <Surface style={styles.questionCard} elevation={1}>
          <Text variant="titleLarge" style={styles.questionText}>
            {currentQuestion.text}
          </Text>
        </Surface>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedAnswers[currentIndex] === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => handleSelectOption(opt.id)}
                style={[
                  styles.optionButton,
                  { borderColor: theme.colors.outline },
                  isSelected && { 
                    backgroundColor: theme.colors.primaryContainer,
                    borderColor: theme.colors.primary 
                  }
                ]}
              >
                <Text style={[
                  styles.optionText,
                  isSelected && { color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }
                ]}>
                  {opt.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={[styles.footer, { borderTopColor: theme.colors.surfaceVariant }]}>
        <Button 
          mode="text" 
          onPress={handlePrevious} 
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        
        <Button 
          mode="contained" 
          onPress={handleNext}
          disabled={!selectedAnswers[currentIndex] && currentIndex < questions.length - 1} // Can't go next without selecting if not last? Actually, skipping is allowed.
        >
          {currentIndex === questions.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  progressContainer: { flex: 1, paddingHorizontal: 16 },
  progressBar: { height: 6, borderRadius: 3, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  content: { padding: 16 },
  questionCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  questionText: { lineHeight: 28 },
  optionsContainer: { gap: 12 },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionText: { fontSize: 16 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
  },
});
