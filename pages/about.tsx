import React from 'react';
import Layout from '../components/Layout';

export const About = (): JSX.Element => {
  return (
    <Layout
      customMeta={{
        title: 'About',
      }}
    >
      <h1>About Page</h1>
      <p>Welcome to the about page...</p>
      <p>
        Thanks to Hunter Chang for the wonderful{' '}
        <a href="https://dev.to/changoman/next-js-blog-starter-with-typescript-and-mdx-3kc6">Next.js blog starter</a>
      </p>
    </Layout>
  );
};

export default About;
