import { format, parseISO } from 'date-fns';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';
import { Box, Heading, Paragraph, Themed } from 'theme-ui';
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
      <Paragraph sx={{ pb: 4, pt: 2 }}>
        Welcome to my blog! This is where I write about music and coding stuff that I find interesting.
      </Paragraph>
      {posts.map((post) => (
        <Box as="article" sx={{ mb: 4, clear: 'both' }} key={post.slug}>
          <Box sx={{ float: 'left' }}>
            <div
              style={{
                marginRight: 16,
                marginBottom: 10,
                width: 120,
                height: 120,
                borderRadius: '50%',
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
          </Box>
          <Box sx={{ float: 'right' }}>
            {post.frontmatter.tags?.map((tag, i) => (
              <Tag key={i}>{tag}</Tag>
            ))}
          </Box>
          <Heading>
            <Link as={`/${post.slug}`} href={`/[slug]`}>
              <Themed.a>{post.frontmatter.title}</Themed.a>
            </Link>
          </Heading>
          <Paragraph color="gray" sx={{ fontStyle: 'italic' }}>
            {format(parseISO(post.frontmatter.date), 'MMMM dd, yyyy')}
          </Paragraph>
          <Paragraph className="mb-3">{post.frontmatter.description}</Paragraph>
        </Box>
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
