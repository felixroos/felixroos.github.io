import { format, parseISO } from 'date-fns';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';
import Tag from '../components/Tag';
// import { getAllPosts } from '../lib/api';
// import { PostType } from '../types/post';
import { getAllPosts } from '../lib/mdx';

type IndexProps = {
  posts: any[];
  // posts: PostType[];
};

export const Index = ({ posts }: IndexProps): JSX.Element => {
  return (
    <Layout>
      <p>Welcome to my blog! This is where I write about music and coding stuff that I find interesting.</p>
      {posts.map((post) => (
        <article key={post.slug} className="mt-12">
          <div className="float-right">
            {post.frontmatter.tags?.map((tag, i) => (
              <Tag key={i}>{tag}</Tag>
            ))}
          </div>
          <h1 className="mb-2 text-xxl">
            <Link as={`/${post.slug}`} href={`/[slug]`}>
              <a className="text-gray-900 dark:text-white dark:hover:text-blue-400">{post.frontmatter.title}</a>
            </Link>
          </h1>
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
            {format(parseISO(post.frontmatter.date), 'MMMM dd, yyyy')}
          </p>
          <p className="mb-3">{post.frontmatter.description}</p>
        </article>
      ))}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // const posts = getAllPosts(['date', 'description', 'slug', 'title']);
  // https://dipeshwagle.com/blog/use-mdx-bundler-next-js#creating-list-of-posts
  const posts = getAllPosts();

  return {
    props: { posts },
  };
};

export default Index;
