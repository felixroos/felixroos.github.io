import { ThemeProvider } from 'theme-ui';
import type { AppProps } from 'next/app';
import React from 'react';
import theme from '../components/theme';
// import 'katex/dist/katex.min.css';
import '../styles.css';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default MyApp;
