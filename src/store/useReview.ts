import { create } from 'zustand';

export interface AttemptedQuestion {
  questionId: string;
  questionText: string;
  subject: string;
  topic: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  isBookmarked: boolean;
  isFlagged: boolean;
  timeSpentMs: number;
  attemptedAt: number; // timestamp
  explanation: string;
  options: { id: string; text: string }[];
}

interface ReviewState {
  // All attempted questions
  attempts: AttemptedQuestion[];

  // Add a batch of attempts from a session
  addAttempts: (newAttempts: AttemptedQuestion[]) => void;

  // Toggle bookmark
  toggleBookmark: (questionId: string) => void;

  // Toggle flag for review
  toggleFlag: (questionId: string) => void;

  // Get wrong answers
  getWrongAnswers: () => AttemptedQuestion[];

  // Get bookmarked
  getBookmarked: () => AttemptedQuestion[];

  // Get flagged
  getFlagged: () => AttemptedQuestion[];

  // Get weak topics (topics with < 50% accuracy)
  getWeakTopics: () => { topic: string; subject: string; accuracy: number; count: number }[];

  // Get stats
  getStats: () => {
    totalAttempted: number;
    correctCount: number;
    accuracy: number;
    avgTimeMs: number;
    subjectWise: Record<string, { correct: number; total: number; accuracy: number }>;
    topicWise: Record<string, { correct: number; total: number; accuracy: number }>;
  };
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  attempts: [],

  addAttempts: (newAttempts) =>
    set((state) => ({
      attempts: [...state.attempts, ...newAttempts],
    })),

  toggleBookmark: (questionId) =>
    set((state) => ({
      attempts: state.attempts.map((a) =>
        a.questionId === questionId ? { ...a, isBookmarked: !a.isBookmarked } : a
      ),
    })),

  toggleFlag: (questionId) =>
    set((state) => ({
      attempts: state.attempts.map((a) =>
        a.questionId === questionId ? { ...a, isFlagged: !a.isFlagged } : a
      ),
    })),

  getWrongAnswers: () => get().attempts.filter((a) => !a.isCorrect),

  getBookmarked: () => get().attempts.filter((a) => a.isBookmarked),

  getFlagged: () => get().attempts.filter((a) => a.isFlagged),

  getWeakTopics: () => {
    const topicMap: Record<string, { subject: string; correct: number; total: number }> = {};
    get().attempts.forEach((a) => {
      const key = `${a.subject}::${a.topic}`;
      if (!topicMap[key]) topicMap[key] = { subject: a.subject, correct: 0, total: 0 };
      topicMap[key].total++;
      if (a.isCorrect) topicMap[key].correct++;
    });

    return Object.entries(topicMap)
      .map(([key, val]) => ({
        topic: key.split('::')[1],
        subject: val.subject,
        accuracy: Math.round((val.correct / val.total) * 100),
        count: val.total,
      }))
      .filter((t) => t.accuracy < 50)
      .sort((a, b) => a.accuracy - b.accuracy);
  },

  getStats: () => {
    const attempts = get().attempts;
    const totalAttempted = attempts.length;
    const correctCount = attempts.filter((a) => a.isCorrect).length;
    const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
    const avgTimeMs =
      totalAttempted > 0
        ? Math.round(attempts.reduce((sum, a) => sum + a.timeSpentMs, 0) / totalAttempted)
        : 0;

    const subjectWise: Record<string, { correct: number; total: number; accuracy: number }> = {};
    const topicWise: Record<string, { correct: number; total: number; accuracy: number }> = {};

    attempts.forEach((a) => {
      // Subject
      if (!subjectWise[a.subject]) subjectWise[a.subject] = { correct: 0, total: 0, accuracy: 0 };
      subjectWise[a.subject].total++;
      if (a.isCorrect) subjectWise[a.subject].correct++;

      // Topic
      const topicKey = `${a.subject} - ${a.topic}`;
      if (!topicWise[topicKey]) topicWise[topicKey] = { correct: 0, total: 0, accuracy: 0 };
      topicWise[topicKey].total++;
      if (a.isCorrect) topicWise[topicKey].correct++;
    });

    // Calculate accuracy percentages
    Object.values(subjectWise).forEach((s) => (s.accuracy = Math.round((s.correct / s.total) * 100)));
    Object.values(topicWise).forEach((t) => (t.accuracy = Math.round((t.correct / t.total) * 100)));

    return { totalAttempted, correctCount, accuracy, avgTimeMs, subjectWise, topicWise };
  },
}));
