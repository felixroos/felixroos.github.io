import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <link rel="alternate" type="application/rss+xml" title="RSS Feed for felixroos.github.io" href="/rss.xml" />
          <link
            rel="alternate"
            type="application/atom+xml"
            title="Atom Feed for felixroos.github.io"
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
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
