// https://dipeshwagle.com/blog/use-mdx-bundler-next-js#creating-single-post
import React from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import { getAllPosts, getSinglePost } from '../lib/mdx';
import Layout from '../components/Layout';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import Tag from '../components/Tag';
import { useTheme } from 'next-themes';
import { Prism, TomorrowNight } from '../lib/prism';
import { NextSeo } from 'next-seo';
import Img from '../components/layout/Img';
import NextImage from 'next/image';

const CustomLink = ({ as, href, ...otherProps }) => {
  if (href.startsWith('http')) {
    return <a target="_blank" {...{ as, href, ...otherProps }} />;
  }
  return (
    <Link as={as} href={href}>
      <a {...otherProps} />
    </Link>
  );
};

const Post = ({ code, frontmatter }) => {
  // https://github.com/kentcdodds/mdx-bundler#globals
  const Component = React.useMemo(() => getMDXComponent(code, { NextImage }) as any, [code]);
  const { theme } = useTheme();
  return (
    <Layout loadKatex={frontmatter.loadKatex}>
      <NextSeo title={frontmatter.title} description={frontmatter.description} />
      {theme === 'light' && <Prism />}
      {theme === 'dark' && <TomorrowNight />}
      {/* sm:p-2 sm:border-2 sm:rounded-md */}
      <article
        className="prose font-serif max-w-none 
      prose-headings:font-sans prose-headings:font-black prose-headings:text-slate-900 
      dark:prose-headings:text-gray-200 
      dark:text-gray-400 dark:prose-strong:text-gray-400 dark:prose-code:text-slate-400
      dark:prose-a:text-gray-300 prose-a:text-slate-900
      prose-blockquote:text-slate-800 dark:prose-blockquote:text-slate-400"
      >
        <div className="border-b-4 border-dotted pb-2 border-slate-900 mb-4 dark:border-slate-400">
          <div className="md:flex justify-between">
            <h1 className="mb-4 ">{frontmatter.title}</h1>
            <div className="flex space-x-2 items-start pb-4 md:pb-0">
              {frontmatter.tags?.map((tag, i) => (
                <Tag key={i}>{tag}</Tag>
              ))}
            </div>
          </div>
          <p className="italic p-0 m-0">{format(parseISO(frontmatter.date), 'MMMM dd, yyyy')}</p>
        </div>
        <div>
          <Component components={{ a: CustomLink, img: Img }} />
        </div>
      </article>
    </Layout>
  );
};

export const getStaticProps = async ({ params }) => {
  const post = await getSinglePost(params.slug);
  return {
    props: { ...post },
  };
};

export const getStaticPaths = async () => {
  const paths = getAllPosts().map(({ slug }) => ({ params: { slug } }));
  return {
    paths,
    fallback: false,
  };
};

export default Post;
