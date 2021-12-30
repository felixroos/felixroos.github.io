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
