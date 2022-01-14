import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import '../styles.css';
import '../fonts.css';
import { DefaultSeo } from 'next-seo';
import Head from 'next/head';
import { WEBSITE_HOST_URL } from '../components/Head';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <Head>
        <meta charSet="utf-8" />
        <meta name="google-site-verification" content="wp4E26TNY3Zd1V8nc5aARrFgpjNWT2pf6LU5KYriEzY" />
        <meta name="google-site-verification" content="GUM6yOXbPTHwXHN0i93w-YXjkuXD2kDm2C7lI9n4-40" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0" />
        <link rel="alternate" type="application/rss+xml" title={`RSS Feed for ${WEBSITE_HOST_URL}`} href="/rss.xml" />
        <link
          rel="alternate"
          type="application/atom+xml"
          title={`Atom Feed for ${WEBSITE_HOST_URL}`}
          href="/atom.xml"
        />
        {/* <!-- Für Apple-Geräte --> */}
        <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon-180x180.png" />
        {/* <!-- Für Browser --> */}
        <link rel="shortcut icon" type="image/x-icon" href="favicon/favicon-32x32.ico" />
        <link rel="icon" type="image/png" sizes="96x96" href="favicon/favicon-96x96.png" />
        {/* <!-- Für Windows Metro --> */}
        <meta name="msapplication-square310x310logo" content="favicon/mstile-310x310.png" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
      </Head>
      <DefaultSeo
        titleTemplate="%s | Loophole Letters"
        description="Loophole Letters is a blog about music, coding and electronics."
        openGraph={{
          type: 'website',
          locale: 'en',
          url: WEBSITE_HOST_URL,
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
