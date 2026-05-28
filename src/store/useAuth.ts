import { create } from 'zustand';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  examGoals: string[];
  preferences: {
    language: 'en' | 'te';
    level: 'beginner' | 'intermediate' | 'advanced';
  };
}

interface AuthState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updateExamGoals: (goals: string[]) => void;
  updatePreferences: (prefs: Partial<UserProfile['preferences']>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateExamGoals: (goals) => set((state) => ({
    user: state.user ? { ...state.user, examGoals: goals } : null
  })),
  updatePreferences: (prefs) => set((state) => ({
    user: state.user ? { 
      ...state.user, 
      preferences: { ...state.user.preferences, ...prefs } 
    } : null
  })),
}));
