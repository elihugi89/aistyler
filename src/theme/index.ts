import { Theme } from '@rneui/themed';

export const colors = {
  primary: '#6200EE',
  primaryDark: '#3700B3',
  secondary: '#03DAC6',
  secondaryDark: '#018786',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  error: '#B00020',
  onPrimary: '#FFFFFF',
  onSecondary: '#000000',
  onBackground: '#000000',
  onSurface: '#000000',
  onError: '#FFFFFF',
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const typography = {
  h1: {
    fontSize: 96,
    fontWeight: '300',
    letterSpacing: -1.5,
  },
  h2: {
    fontSize: 60,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 48,
    fontWeight: '400',
    letterSpacing: 0,
  },
  h4: {
    fontSize: 34,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  h5: {
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: 0,
  },
  h6: {
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 0.15,
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.15,
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  button: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1.25,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.4,
  },
  overline: {
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
} as const;

export const theme = {
  colors,
  spacing,
  typography,
} as const;

export type Theme = typeof theme; 