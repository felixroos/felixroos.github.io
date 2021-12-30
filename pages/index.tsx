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
      <p className="mb-8 pt-2 font-serif dark:text-gray-400">
        Welcome to my blog! This is where I write about music and coding stuff that I find interesting.
      </p>
      <section>
        {posts
          .filter((post) => !post.frontmatter.draft)
          .map((post) => (
            <Link href={`/${post.slug}`} key={post.slug}>
              <a className="block cursor-pointer py-6 hover:bg-slate-100 dark:hover:bg-slate-800 border-t-4 border-dotted border-slate-900 dark:border-slate-400">
                <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-2 sm:items-start sm:justify-between">
                  <div className="sm:flex sm:space-x-4">
                    <div>
                      <h1 className="block sm:hidden font-sans font-black text-2xl text-slate-900 dark:text-gray-200">
                        {post.frontmatter.title}
                      </h1>
                      <p className="block sm:hidden italic text-gray-500 dark:text-gray-400 mb-2">
                        {format(parseISO(post.frontmatter.date), 'MMMM yyyy')}
                      </p>
                      <div
                        className="w-full h-[120px] sm:w-[120px] sm:h-[120px] rounded-md sm:rounded-xl border border-slate-400 overflow-hidden shadow-md"
                        style={{
                          ...(post.frontmatter.image
                            ? {
                                backgroundImage: `url(${post.frontmatter.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }
                            : { backgroundColor: 'gray' }),
                        }}
                      ></div>
                    </div>
                    <div>
                      <h1 className="hidden sm:block font-sans font-black text-2xl dark:text-gray-200">
                        {post.frontmatter.title}
                      </h1>
                      <p className="hidden sm:block italic text-gray-500 dark:text-gray-400">
                        {format(parseISO(post.frontmatter.date), 'MMMM yyyy')}
                      </p>
                      <p className="font-serif mt-2 dark:text-gray-400">{post.frontmatter.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1 items-start whitespace-nowrap">
                    {post.frontmatter.tags?.map((tag, i) => (
                      <Tag key={i}>{tag}</Tag>
                    ))}
                  </div>
                </div>
              </a>
            </Link>
          ))}
      </section>
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
