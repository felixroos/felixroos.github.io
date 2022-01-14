import NextHead from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { MetaProps } from '../types/layout';

export const WEBSITE_HOST_URL = 'https://loophole-letters.vercel.app';

const Head = ({ customMeta, loadKatex }: { customMeta?: MetaProps; loadKatex?: boolean }): JSX.Element => {
  const router = useRouter();
  const meta: MetaProps = {
    title: 'Loophole Letters',
    description: 'This is where felixroos writes about music and coding and stuff that he finds interesting.',
    image: `${WEBSITE_HOST_URL}/images/site-preview.png`,
    type: 'website',
    ...customMeta,
  };

  return (
    <NextHead>
      <title>{meta.title}</title>
      <meta content={meta.description} name="description" />
      <link rel="canonical" href={`${WEBSITE_HOST_URL}${router.asPath}`} />
      {/* loadKatex flag is set in *.mdx files when katex (InlineMath or BlockMath) is used. 
      importing 'katex/dist/katex.css' does not work because:
      "No loader is configured for ".woff2" / ".ttf" files" */}
      {loadKatex && (
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
          integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
          crossOrigin="anonymous"
        />
      )}
      {meta.date && <meta property="article:published_time" content={meta.date} />}
    </NextHead>
  );
};

export default Head;
