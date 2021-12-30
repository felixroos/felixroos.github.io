import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import '../styles.css';
import '../fonts.css';
import { DefaultSeo } from 'next-seo';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <DefaultSeo
        titleTemplate="%s | Loophole Letters"
        description="Loophole Letters is a blog about music, coding and electronics."
        openGraph={{
          type: 'website',
          locale: 'en',
          url: 'https://felixroos.github.io/',
          site_name: 'Loophole Letters Blog',
          images: [
            {
              url: '/logo.png',
              width: 1024,
              height: 1024,
              alt: 'Loophole Letters Logo',
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;
