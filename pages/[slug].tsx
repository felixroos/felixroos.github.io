// https://dipeshwagle.com/blog/use-mdx-bundler-next-js#creating-single-post
import React from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import { getAllPosts, getSinglePost } from '../lib/mdx';
import { MetaProps } from '../types/layout';
import Layout from '../components/Layout';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import Tag from '../components/Tag';
/* import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link'; */

const CustomLink = ({ as, href, ...otherProps }) => {
  return (
    <Link as={as} href={href}>
      <a {...otherProps} className="custom-link" />
    </Link>
  );
};

const Post = ({ code, frontmatter }) => {
  const customMeta: MetaProps = {
    title: `${frontmatter.title} - Loophole Letters`,
    description: frontmatter.description,
    // image: `${WEBSITE_HOST_URL}${frontMatter.image}`,
    date: frontmatter.date,
    type: 'article',
  };
  const Component = React.useMemo(() => getMDXComponent(code) as any, [code]);
  return (
    <Layout customMeta={customMeta}>
      <article>
        <div className="float-right">
          {frontmatter.tags?.map((tag, i) => (
            <Tag key={i}>{tag}</Tag>
          ))}
        </div>
        <h1 className="mb-0 text-gray-900 dark:text-white">{frontmatter.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {format(parseISO(frontmatter.date), 'MMMM dd, yyyy')}
        </p>
        <div className="prose dark:prose-dark">
          <Component
            components={{
              a: CustomLink,
              // pre: CustomCode,
            }}
          />
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
