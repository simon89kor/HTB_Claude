/**
 * HTB Design System Tokens
 * Figma 디자인에서 추출한 디자인 토큰
 */

export const colors = {
  primary: '#2dd4a8',
  primaryDark: '#1ab894',
  primaryLight: 'rgba(45, 212, 168, 0.15)',

  bgPrimary: '#FFFFFF',
  bgSecondary: '#F5F5F5',
  bgDark: '#1A1A1A',
  bgDarkAlt: '#2A2A2A',

  textPrimary: '#1A1A1A',
  textSecondary: '#888888',
  textTertiary: '#BBBBBB',
  textWhite: '#FFFFFF',

  border: '#E5E5E5',
  borderDark: '#333333',

  error: '#FF4444',
  warning: '#FFD93D',
  success: '#2dd4a8',

  // Social Login
  kakao: '#FEE500',
  apple: '#000000',
  google: '#FFFFFF',
} as const;

export const typography = {
  display: { fontSize: 28, fontWeight: '700' as const },
  h1: { fontSize: 22, fontWeight: '700' as const },
  h2: { fontSize: 18, fontWeight: '600' as const },
  h3: { fontSize: 16, fontWeight: '600' as const },
  body1: { fontSize: 15, fontWeight: '400' as const },
  body2: { fontSize: 13, fontWeight: '400' as const },
  caption: { fontSize: 11, fontWeight: '400' as const },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const bottomNav = {
  height: 60,
  background: colors.bgDark,
  activeColor: colors.primary,
  inactiveColor: '#888888',
} as const;

export const categories = [
  { key: 'all', label: '전체', emoji: '👀' },
  { key: 'exercise', label: '운동루틴', emoji: '💪' },
  { key: 'diet', label: '식단관리', emoji: '🥗' },
  { key: 'selfdev', label: '자기계발', emoji: '🎓' },
  { key: 'cert', label: '자격증', emoji: '📝' },
  { key: 'study', label: '학업', emoji: '📚' },
] as const;

export const routinePricing = {
  '1week': { label: '1 WEEK', price: 1400, days: 7 },
  '4week': { label: '4 WEEK', price: 5600, days: 28 },
  '100days': { label: '100 Days', price: 20000, days: 100 },
} as const;
