import { db } from './firebaseConfig';
import { collection, doc, getDoc, getDocs, query, where, limit, addDoc } from 'firebase/firestore';

export interface Question {
  id: string;
  subject: string;
  topic: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

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

export const fetchPracticeQuestions = async (subject: string, topic: string, limitCount: number = 10): Promise<Question[]> => {
  try {
    const q = query(
      collection(db, 'unifiedDatabase'),
      where('subject', '==', subject),
      where('topic', '==', topic),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
  } catch (error) {
    console.error('Error fetching questions:', error);
    // Return mock data for development if Firebase rules fail or DB is empty
    return [
      {
        id: '1',
        subject: 'Polity',
        topic: 'Fundamental Rights',
        text: 'Which part of the Constitution deals with Fundamental Rights?',
        options: [
          { id: 'a', text: 'Part II' },
          { id: 'b', text: 'Part III' },
          { id: 'c', text: 'Part IV' },
          { id: 'd', text: 'Part V' }
        ],
        correctOptionId: 'b',
        explanation: 'Part III of the Indian Constitution (Articles 12 to 35) deals with Fundamental Rights.'
      }
    ];
  }
};

export const saveAttempt = async (uid: string, attempt: any) => {
  try {
    const userAttemptsRef = collection(db, 'users', uid, 'userAttempts');
    // Save document with auto-generated ID
    await addDoc(userAttemptsRef, {
      ...attempt,
      savedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving attempt to Firestore:', error);
  }
};
