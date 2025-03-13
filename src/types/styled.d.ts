import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryDark: string;
      secondary: string;
      secondaryDark: string;
      textPrimary: string;
      textSecondary: string;
      background: string;
      backgroundLight: string;
      backgroundDark: string;
      danger: string;
      warning: string;
      success: string;
      accent?: string;
      border?: string;
      backgroundInput?: string;
      textTertiary?: string;
    };
    fonts: {
      body: string;
      heading: string;
    };
    fontSizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
    };
    fontWeights: {
      light: number;
      normal: number;
      medium: number;
      bold: number;
      extrabold: number;
    };
    lineHeights: {
      normal: string;
      none: number;
      tight: number;
      base: number;
      loose: number;
    };
    space: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    sizes: {
      container: string;
    };
    radii: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      round: string;
      full: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    transitions: {
      default: string;
      slow: string;
      fast: string;
    };
    zIndices: {
      hide: number;
      auto: string;
      base: number;
      dropdown: number;
      sticky: number;
      fixed: number;
      overlay: number;
      modal: number;
      popover: number;
      tooltip: number;
    };
  }
} 