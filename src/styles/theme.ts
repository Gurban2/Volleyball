import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: '#FF3A2F',       // Bright Red
    primaryDark: '#D41E17',   // Darker Red
    secondary: '#1E88E5',     // Bright Blue
    secondaryDark: '#1565C0', // Darker Blue
    textPrimary: '#1A1A1A',   // Almost Black
    textSecondary: '#444444', // Dark Gray
    background: '#F0F0F0',    // Light Gray
    backgroundLight: '#FFFFFF', // White
    backgroundDark: '#DDDDDD', // Medium Gray
    danger: '#FF3A2F',        // Red
    warning: '#FFC107',       // Yellow
    success: '#4CAF50',       // Green
    accent: '#7B1FA2',        // Purple
    border: '#DDDDDD',        // Medium Gray
    backgroundInput: '#FFFFFF', // White
    textTertiary: '#888888',   // Light Gray Text
  },
  fonts: {
    body: "'Montserrat', 'Roboto', sans-serif",
    heading: "'Montserrat', 'Roboto', sans-serif",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    normal: 'normal',
    none: 1,
    tight: 1.25,
    base: 1.5,
    loose: 2,
  },
  space: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  sizes: {
    container: '1200px',
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    round: '50%',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
  transitions: {
    default: 'all 0.3s ease',
    slow: 'all 0.6s ease',
    fast: 'all 0.15s ease',
  },
  zIndices: {
    hide: -1,
    auto: 'auto',
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },
}; 