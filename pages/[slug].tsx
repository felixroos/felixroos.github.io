// https://dipeshwagle.com/blog/use-mdx-bundler-next-js#creating-single-post
import React from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import { getAllPosts, getSinglePost } from '../lib/mdx';
import { MetaProps } from '../types/layout';
import Layout from '../components/Layout';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import Tag from '../components/Tag';
import { Box, Heading, Paragraph, Themed } from 'theme-ui';
// import 'prismjs/themes/prism-coy.css';
// import 'prismjs/themes/prism-dark.css';
// import 'prismjs/themes/prism-funky.css';
import 'prismjs/themes/prism-okaidia.css';
// import 'prismjs/themes/prism-solarizedlight.css';
// import 'prismjs/themes/prism-tomorrow.css';
// import 'prismjs/themes/prism-twilight.css';
// import 'prismjs/themes/prism.css';

const CustomLink = ({ as, href, ...otherProps }) => {
  if (href.startsWith('http')) {
    return <Themed.a target="_blank" {...{ as, href, ...otherProps }} />;
  }
  return (
    <Link as={as} href={href}>
      <Themed.a {...otherProps} />
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
  // https://github.com/kentcdodds/mdx-bundler#globals
  const Component = React.useMemo(() => getMDXComponent(code) as any, [code]);
  const H = (size) => (props) => <Heading {...props} as={`h${size}`} sx={{ mb: 2, mt: 4 }} />;
  /* const CustomInput = (props) => {
    if (props.type === 'checkbox') {
      return <input style={{ border: '1px solid black' }} {...props} />;
    }
    return <input {...props} />;
  }; */
  return (
    <Layout>
      <Box as="article">
        <Box sx={{ float: 'right' }}>
          {frontmatter.tags?.map((tag, i) => (
            <Tag key={i}>{tag}</Tag>
          ))}
        </Box>
        <Heading sx={{ fontSize: 6 }}>{frontmatter.title}</Heading>
        <Paragraph mb={4} color="gray" sx={{ fontStyle: 'italic' }}>
          {format(parseISO(frontmatter.date), 'MMMM dd, yyyy')}
        </Paragraph>
        <Box>
          {/* frontmatter.image && <img src={frontmatter.image} /> */}
          <Component
            components={{
              a: CustomLink,
              h1: H(1),
              h2: H(2),
              h3: H(3),
              h4: H(4),
              p: Themed.p,
              ul: Themed.ul,
              li: Themed.li,
              img: Themed.img,
              table: Themed.table,
              td: Themed.td,
              th: Themed.th,
              tr: Themed.tr,
              /* input: CustomInput, */
            }}
          />
        </Box>
      </Box>
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
