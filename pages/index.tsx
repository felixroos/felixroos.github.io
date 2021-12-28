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
      <p className="mb-8 pt-2 font-serif">
        Welcome to my blog! This is where I write about music and coding stuff that I find interesting.
      </p>
      <div className="space-y-4">
        {posts
          .filter((post) => !post.frontmatter.draft)
          .map((post) => (
            <Link as={`/${post.slug}`} href={`/[slug]`} key={post.slug}>
              <article className="cursor-pointer  border border-gray-300 p-2 bg-slate-50  hover:bg-slate-100 shadow-md rounded-md ">
                <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-2 sm:items-start sm:justify-between">
                  <div className="sm:flex sm:space-x-4">
                    <div>
                      <h1 className="block sm:hidden font-sans font-black text-2xl">
                        <a>{post.frontmatter.title}</a>
                      </h1>
                      <p className="block sm:hidden italic text-gray-500 mb-2">
                        {format(parseISO(post.frontmatter.date), 'MMMM yyyy')}
                      </p>
                      <div
                        className="w-full h-[120px] sm:w-[120px] sm:h-[120px] rounded-md sm:rounded-full"
                        style={{
                          border: '1px solid gray',
                          overflow: 'hidden',
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
                      <h1 className="hidden sm:block font-sans font-black text-2xl">
                        <a>{post.frontmatter.title}</a>
                      </h1>
                      <p className="hidden sm:block italic text-gray-500 ">
                        {format(parseISO(post.frontmatter.date), 'MMMM yyyy')}
                      </p>
                      <p className="font-serif mt-2">{post.frontmatter.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1 items-start whitespace-nowrap">
                    {post.frontmatter.tags?.map((tag, i) => (
                      <Tag key={i}>{tag}</Tag>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          ))}
      </div>
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
