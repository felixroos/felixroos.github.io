// https://dipeshwagle.com/blog/use-mdx-bundler-next-js#creating-single-post
import React from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import { getAllPosts, getSinglePost } from '../lib/mdx';
import { MetaProps } from '../types/layout';
import Layout from '../components/Layout';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import Tag from '../components/Tag';
// import 'prismjs/themes/prism-coy.css';
// import 'prismjs/themes/prism-dark.css';
// import 'prismjs/themes/prism-funky.css';
// import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/themes/prism-solarizedlight.css';
// import 'prismjs/themes/prism-tomorrow.css';
// import 'prismjs/themes/prism-twilight.css';
// import 'prismjs/themes/prism.css';

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
  const customMeta: MetaProps = {
    title: `${frontmatter.title} - Loophole Letters`,
    description: frontmatter.description,
    // image: `${WEBSITE_HOST_URL}${frontMatter.image}`,
    date: frontmatter.date,
    type: 'article',
  };
  // https://github.com/kentcdodds/mdx-bundler#globals
  const Component = React.useMemo(() => getMDXComponent(code) as any, [code]);
  return (
    <Layout>{/* sm:p-2 sm:border-2 sm:rounded-md */}
      <article className="bg-white prose font-serif max-w-none prose-headings:font-sans prose-headings:font-black prose-headings:text-slate-900">
        <div className="border-b-4 border-dotted pb-2 border-slate-900 mb-4">
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
          {/* frontmatter.image && <img src={frontmatter.image} /> */}
          <Component
            components={{
              a: CustomLink,
              /* h1: H(1),
              h2: H(2),
              h3: H(3),
              h4: H(4), */
              /* p: Themed.p,
              ul: Themed.ul,
              li: Themed.li,
              img: Themed.img,
              table: Themed.table,
              td: Themed.td,
              th: Themed.th,
              tr: Themed.tr, */
              /* input: CustomInput, */
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
