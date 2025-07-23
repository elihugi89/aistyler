import { createTheme } from '@rneui/themed';

const theme = createTheme({
  lightColors: {
    primary: '#6366f1',
    secondary: '#f59e0b',
    background: '#ffffff',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  },
  darkColors: {
    primary: '#818cf8',
    secondary: '#fbbf24',
    background: '#0f172a',
    success: '#34d399',
    error: '#f87171',
    warning: '#fbbf24',
  },
  mode: 'light',
});

export default theme; 