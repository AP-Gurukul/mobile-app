import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

// You can customize the colors to match the APPSC Pandit brand
export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4F46E5', // Indigo
    secondary: '#10B981', // Emerald
    background: '#F9FAFB',
    surface: '#FFFFFF',
    error: '#EF4444',
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#6366F1', // Indigo Light
    secondary: '#34D399', // Emerald Light
    background: '#111827', // Gray 900
    surface: '#1F2937', // Gray 800
    error: '#F87171',
  },
};
