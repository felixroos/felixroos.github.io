import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import '../styles.css';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;
