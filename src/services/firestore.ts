import { db } from './firebaseConfig';
import { collection, doc, getDoc, getDocs, query, where, limit, addDoc, orderBy } from 'firebase/firestore';

export interface Question {
  id: string;
  subject: string;
  topic: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  type?: 'standard' | 'newspaper';
}

export interface PYQQuestion extends Question {
  year: string;
  examBoard: string;
}

export interface PYQBoard {
  id: string;
  name: string;
  years: string[];
}

// ─── User Stats ───────────────────────────────────────────────
export const fetchUserStats = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().stats;
    }
    return { accuracy: 0, streak: 0, totalAttempted: 0 };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { accuracy: 0, streak: 0, totalAttempted: 0 };
  }
};

// ─── Standard Practice Questions ──────────────────────────────
// Fetches from the `questions` collection, filtering by subject/topic.
// Excludes newspaper-type questions unless explicitly requested.
export const fetchPracticeQuestions = async (
  subject: string,
  topic: string,
  limitCount: number = 10
): Promise<Question[]> => {
  try {
    // Build query constraints
    const constraints: any[] = [];

    if (subject && subject !== 'all') {
      constraints.push(where('subject', '==', subject));
    }
    if (topic && topic !== 'mix') {
      constraints.push(where('topic', '==', topic));
    }

    constraints.push(limit(limitCount));

    const q = query(collection(db, 'questions'), ...constraints);
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('No questions found in Firestore, returning mock data');
      return getMockQuestions(subject, topic);
    }

    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Question));
  } catch (error) {
    console.error('Error fetching questions:', error);
    return getMockQuestions(subject, topic);
  }
};

// ─── PYQ Questions ────────────────────────────────────────────
export const fetchPYQBoards = async (): Promise<PYQBoard[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'pyq_boards'));
    if (snapshot.empty) {
      return [
        { id: '1', name: 'APPSC Group 2', years: ['2023', '2022', '2021', '2020', '2019'] },
        { id: '2', name: 'APPSC Group 1', years: ['2023', '2022', '2021'] },
      ];
    }
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PYQBoard));
  } catch (error) {
    console.error('Error fetching PYQ boards:', error);
    return [
      { id: '1', name: 'APPSC Group 2', years: ['2023', '2022', '2021', '2020', '2019'] },
    ];
  }
};

export const fetchPYQs = async (
  year?: string,
  subject?: string,
  limitCount: number = 20
): Promise<PYQQuestion[]> => {
  try {
    const constraints: any[] = [];
    if (year) constraints.push(where('year', '==', year));
    if (subject && subject !== 'All') constraints.push(where('subject', '==', subject));
    constraints.push(limit(limitCount));

    const q = query(collection(db, 'pyqs'), ...constraints);
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return getMockPYQs();
    }

    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PYQQuestion));
  } catch (error) {
    console.error('Error fetching PYQs:', error);
    return getMockPYQs();
  }
};

// ─── Current Affairs / Newspaper Questions ────────────────────
export const fetchCurrentAffairs = async (limitCount: number = 10): Promise<Question[]> => {
  try {
    const q = query(
      collection(db, 'questions'),
      where('type', '==', 'newspaper'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return getMockCurrentAffairs();
    }

    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Question));
  } catch (error) {
    console.error('Error fetching current affairs:', error);
    return getMockCurrentAffairs();
  }
};

// ─── Mix Practice (All Types) ─────────────────────────────────
export const fetchMixQuestions = async (limitCount: number = 20): Promise<Question[]> => {
  try {
    // Fetch from both questions and pyqs collections
    const [questionsSnap, pyqsSnap] = await Promise.all([
      getDocs(query(collection(db, 'questions'), limit(Math.ceil(limitCount / 2)))),
      getDocs(query(collection(db, 'pyqs'), limit(Math.floor(limitCount / 2)))),
    ]);

    const allQuestions: Question[] = [
      ...questionsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Question)),
      ...pyqsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Question)),
    ];

    if (allQuestions.length === 0) {
      return getMockQuestions('all', 'mix');
    }

    // Shuffle
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    return allQuestions.slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching mix questions:', error);
    return getMockQuestions('all', 'mix');
  }
};

// ─── Save Attempt ─────────────────────────────────────────────
export const saveAttempt = async (uid: string, attempt: any) => {
  try {
    const userAttemptsRef = collection(db, 'users', uid, 'userAttempts');
    await addDoc(userAttemptsRef, {
      ...attempt,
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving attempt to Firestore:', error);
  }
};

// ─── Mock Data Fallbacks ──────────────────────────────────────
function getMockQuestions(subject: string, topic: string): Question[] {
  return [
    {
      id: 'mock-1',
      subject: subject || 'Polity',
      topic: topic || 'Fundamental Rights',
      text: 'Which part of the Constitution deals with Fundamental Rights?',
      options: [
        { id: 'a', text: 'Part II' },
        { id: 'b', text: 'Part III' },
        { id: 'c', text: 'Part IV' },
        { id: 'd', text: 'Part V' },
      ],
      correctOptionId: 'b',
      explanation: 'Part III of the Indian Constitution (Articles 12 to 35) deals with Fundamental Rights.',
    },
    {
      id: 'mock-2',
      subject: subject || 'Polity',
      topic: topic || 'Fundamental Rights',
      text: 'Which Article of the Indian Constitution abolishes untouchability?',
      options: [
        { id: 'a', text: 'Article 14' },
        { id: 'b', text: 'Article 15' },
        { id: 'c', text: 'Article 17' },
        { id: 'd', text: 'Article 19' },
      ],
      correctOptionId: 'c',
      explanation: 'Article 17 abolishes untouchability and forbids its practice in any form.',
    },
    {
      id: 'mock-3',
      subject: subject || 'Polity',
      topic: topic || 'Fundamental Rights',
      text: 'Right to Education is guaranteed under which Article?',
      options: [
        { id: 'a', text: 'Article 19' },
        { id: 'b', text: 'Article 21' },
        { id: 'c', text: 'Article 21A' },
        { id: 'd', text: 'Article 24' },
      ],
      correctOptionId: 'c',
      explanation: 'Article 21A was inserted by the 86th Constitutional Amendment Act, 2002, making education a fundamental right for children aged 6-14.',
    },
  ];
}

function getMockPYQs(): PYQQuestion[] {
  return [
    {
      id: 'pyq-1',
      subject: 'Polity',
      topic: 'Parliament',
      text: 'What is the maximum strength of the Lok Sabha?',
      options: [
        { id: 'a', text: '545' },
        { id: 'b', text: '550' },
        { id: 'c', text: '552' },
        { id: 'd', text: '555' },
      ],
      correctOptionId: 'c',
      explanation: 'The maximum strength of Lok Sabha is 552 — 530 from states, 20 from UTs, and 2 nominated by the President.',
      year: '2023',
      examBoard: 'APPSC Group 2',
    },
    {
      id: 'pyq-2',
      subject: 'History',
      topic: 'Modern India',
      text: 'Who founded the Indian National Congress in 1885?',
      options: [
        { id: 'a', text: 'Mahatma Gandhi' },
        { id: 'b', text: 'A.O. Hume' },
        { id: 'c', text: 'Dadabhai Naoroji' },
        { id: 'd', text: 'Bal Gangadhar Tilak' },
      ],
      correctOptionId: 'b',
      explanation: 'Allan Octavian Hume, a retired British civil servant, founded the Indian National Congress in 1885.',
      year: '2022',
      examBoard: 'APPSC Group 2',
    },
  ];
}

function getMockCurrentAffairs(): Question[] {
  return [
    {
      id: 'ca-1',
      subject: 'Current Affairs',
      topic: 'National',
      text: 'Which Indian city hosted the G20 Summit in 2023?',
      options: [
        { id: 'a', text: 'Mumbai' },
        { id: 'b', text: 'New Delhi' },
        { id: 'c', text: 'Bengaluru' },
        { id: 'd', text: 'Hyderabad' },
      ],
      correctOptionId: 'b',
      explanation: 'The 18th G20 Leaders Summit was held in New Delhi on September 9-10, 2023.',
      type: 'newspaper',
    },
    {
      id: 'ca-2',
      subject: 'Current Affairs',
      topic: 'Economy',
      text: 'What is India\'s GDP growth rate target for FY2024 as per RBI?',
      options: [
        { id: 'a', text: '6.0%' },
        { id: 'b', text: '6.5%' },
        { id: 'c', text: '7.0%' },
        { id: 'd', text: '7.5%' },
      ],
      correctOptionId: 'b',
      explanation: 'The RBI projected India\'s real GDP growth at 6.5% for FY2024.',
      type: 'newspaper',
    },
  ];
}
