import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

// Premium AP Gurukul brand colors
export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4F46E5',        // Indigo 600
    onPrimary: '#FFFFFF',
    primaryContainer: '#E0E7FF', // Indigo 100
    onPrimaryContainer: '#312E81', // Indigo 900
    secondary: '#0D9488',       // Teal 600
    onSecondary: '#FFFFFF',
    secondaryContainer: '#CCFBF1', // Teal 100
    onSecondaryContainer: '#134E4A', // Teal 900
    tertiary: '#7C3AED',        // Violet 600
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#EDE9FE', // Violet 100
    onTertiaryContainer: '#4C1D95', // Violet 900
    background: '#F8FAFC',       // Slate 50
    onBackground: '#0F172A',     // Slate 900
    surface: '#FFFFFF',
    onSurface: '#0F172A',        // Slate 900
    surfaceVariant: '#F1F5F9',   // Slate 100
    onSurfaceVariant: '#64748B', // Slate 500
    error: '#DC2626',            // Red 600
    errorContainer: '#FEE2E2',   // Red 100
    onErrorContainer: '#991B1B', // Red 800
    outline: '#CBD5E1',          // Slate 300
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F8FAFC',
      level3: '#F1F5F9',
      level4: '#E2E8F0',
      level5: '#CBD5E1',
    },
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#818CF8',          // Indigo 400
    onPrimary: '#1E1B4B',
    primaryContainer: '#312E81', // Indigo 900
    onPrimaryContainer: '#C7D2FE', // Indigo 200
    secondary: '#2DD4BF',        // Teal 400
    onSecondary: '#042F2E',
    secondaryContainer: '#134E4A', // Teal 900
    onSecondaryContainer: '#99F6E4', // Teal 200
    tertiary: '#A78BFA',          // Violet 400
    onTertiary: '#2E1065',
    tertiaryContainer: '#4C1D95', // Violet 900
    onTertiaryContainer: '#DDD6FE', // Violet 200
    background: '#0B1120',        // Deep navy
    onBackground: '#E2E8F0',      // Slate 200
    surface: '#131C2E',           // Navy surface
    onSurface: '#E2E8F0',         // Slate 200
    surfaceVariant: '#1B2740',    // Navy variant
    onSurfaceVariant: '#94A3B8',  // Slate 400
    error: '#F87171',             // Red 400
    errorContainer: '#450A0A',    // Red 950
    onErrorContainer: '#FECACA',  // Red 200
    outline: '#334155',           // Slate 700
    elevation: {
      level0: 'transparent',
      level1: '#131C2E',
      level2: '#1B2740',
      level3: '#1E3050',
      level4: '#233B60',
      level5: '#2A4570',
    },
  },
};

// Shared gradient presets
export const gradients = {
  primary: ['#4F46E5', '#7C3AED'] as const,
  secondary: ['#0D9488', '#06B6D4'] as const,
  accent: ['#6366F1', '#8B5CF6'] as const,
  warm: ['#F59E0B', '#EF4444'] as const,
  success: ['#10B981', '#06B6D4'] as const,
  dark: ['#1E293B', '#0F172A'] as const,
  hero: ['#4F46E5', '#7C3AED', '#EC4899'] as const,
  heroDark: ['#312E81', '#4C1D95', '#831843'] as const,
};
