// const fontFamily = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`;
const fontFamily = `'Merriweather','Georgia',serif`;
/* import { toTheme } from '@theme-ui/typography'
import wp2016 from 'typography-theme-wordpress-2016' */
import merge from 'deepmerge'

// const typography = toTheme(wp2016);
const typography = {};

export default merge(typography, {
  useCustomProperties: true,
  useColorSchemeMediaQuery: true,
  fonts: {
    body: fontFamily,
    heading: 'Montserrat, sans-serif',
  },
  fontSizes: [16, 18, 20, 24, 30, 36, 40, 48, 64, 72, 96],
  fontWeights: {
    lite: 200,
    body: 400,
    heading: 900,
  },
  lineHeights: {
    body: 1.75,
    heading: 1.1,
  },
  buttons: {
    primary: {
      color: 'background',
      bg: 'primary',
      '&:hover': {
        bg: 'text',
      }
    },
    secondary: {
      color: 'background',
      bg: 'secondary',
    },
    tag: {
      color: 'primary',
      border: theme => `1px solid ${theme.colors.primary}`,
      bg: 'background',
    },
  },
  colors: {
    primary: '#307AC6',
    secondary: '#27a727',
    background: '#fff',
    text: '#1b1e21',
    blue: '#4169e1',
    cyan: '#41b9e1',
    gray: '#667788',
    green: '#27a727',
    purple: '#6941e1',
    orange: '#fba100',
    pink: '#e141b9',
    red: '#ee5555',
    white: '#fff',
    yellow: '#FFDD22',
    lite: '#eee',
    modes: {
      dark: {
        text: '#fff',
        background: '#292C34',
        lite: '#333',
        primary: '#85DEFB',
      },
    },
  },
  space: [0, 4, 8, 16, 32, 64, 128],
  breakpoints: ['32em', '48em', '64em', '80em'],
  radii: [0, 3, 6],
  shadows: {
    card: '0 0 4px rgba(0, 0, 0, .125)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    outline: '0 0 0 3px rgba(66, 153, 225, 0.6)',
    inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
    none: 'none',
  },
  styles: {
    p: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.75,
      fontFamily
    },
    ul: {
      pt: 2,
    },
    li: {
      fontFamily: fontFamily,
      marginBottom: 14
    },
    a: {
      color: 'primary',
      cursor: 'pointer',
      textDecoration: 'none'
      // text-gray-900 dark:text-white dark:hover:text-blue-400
    },
    img: {
      maxWidth: '100%'
    },
    table: {
      width: '100%',
      borderSpacing: '0px'
    },
    td: {
      padding: 2,
      // textAlign: 'start',
      borderBottom: '1px solid black'
    },
    th: {
      padding: 2,
      fontSize: 1,
      // textAlign: 'start', // TODO: wtf?
      borderBottom: '1px solid black'
    },
    'input[type=checkbox]': {

    }
  }
});
