import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme, configureFonts } from 'react-native-paper';

const customFonts = {
  displayLarge: { fontFamily: 'System', fontSize: 72, fontWeight: '500' as const, letterSpacing: -2, lineHeight: 76 },
  displayMedium: { fontFamily: 'System', fontSize: 56, fontWeight: '500' as const, letterSpacing: -1.4, lineHeight: 62 },
  displaySmall: { fontFamily: 'System', fontSize: 40, fontWeight: '500' as const, letterSpacing: -0.8, lineHeight: 46 },
  headlineLarge: { fontFamily: 'System', fontSize: 28, fontWeight: '500' as const, letterSpacing: -0.5, lineHeight: 34 },
  headlineMedium: { fontFamily: 'System', fontSize: 22, fontWeight: '500' as const, letterSpacing: -0.3, lineHeight: 28 },
  headlineSmall: { fontFamily: 'System', fontSize: 20, fontWeight: '400' as const, letterSpacing: -0.2, lineHeight: 28 },
  titleLarge: { fontFamily: 'System', fontSize: 22, fontWeight: '500' as const, letterSpacing: -0.3, lineHeight: 28 },
  titleMedium: { fontFamily: 'System', fontSize: 16, fontWeight: '500' as const, letterSpacing: 0, lineHeight: 24 },
  titleSmall: { fontFamily: 'System', fontSize: 14, fontWeight: '500' as const, letterSpacing: 0, lineHeight: 20 },
  bodyLarge: { fontFamily: 'System', fontSize: 16, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 24 },
  bodyMedium: { fontFamily: 'System', fontSize: 14, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 20 },
  bodySmall: { fontFamily: 'System', fontSize: 12, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 18 },
  labelLarge: { fontFamily: 'System', fontSize: 14, fontWeight: '500' as const, letterSpacing: 0, lineHeight: 20 },
  labelMedium: { fontFamily: 'System', fontSize: 12, fontWeight: '500' as const, letterSpacing: 0, lineHeight: 16 },
  labelSmall: { fontFamily: 'System', fontSize: 11, fontWeight: '500' as const, letterSpacing: 0, lineHeight: 16 },
};

const fontConfig = configureFonts({config: customFonts});

// Premium AP Gurukul brand colors
export const lightTheme = {
  ...DefaultTheme,
  fonts: fontConfig,
  colors: {
    ...DefaultTheme.colors,
    primary: '#111111',          // Charcoal
    onPrimary: '#FFFFFF',
    primaryContainer: '#0007cb', // Brand Blue
    onPrimaryContainer: '#FFFFFF',
    secondary: '#ff5600',        // Fin Orange
    onSecondary: '#FFFFFF',
    secondaryContainer: '#ff5600',
    onSecondaryContainer: '#FFFFFF',
    tertiary: '#626260',         // Ink Muted
    onTertiary: '#FFFFFF',
    background: '#f5f1ec',       // Canvas cream
    onBackground: '#111111',     // Ink
    surface: '#ffffff',          // Surface 1
    onSurface: '#111111',        // Ink
    surfaceVariant: '#ebe7e1',   // Surface 2
    onSurfaceVariant: '#626260', // Ink Muted
    inverseSurface: '#000000',   // Inverse Canvas
    inverseOnSurface: '#ffffff',
    error: '#DC2626',            // Red 600
    errorContainer: '#FEE2E2',   // Red 100
    onErrorContainer: '#991B1B', // Red 800
    outline: '#d3cec6',          // Hairline
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
  fonts: fontConfig,
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
