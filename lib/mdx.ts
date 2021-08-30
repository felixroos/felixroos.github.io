// taken from https://dipeshwagle.com/blog/use-mdx-bundler-next-js#reading-mdx-files

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import mdxPrism from 'mdx-prism';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { compareDesc, parseISO } from 'date-fns';
import math from 'remark-math'
import katex from 'rehype-katex'

export const POSTS_PATH = path.join(process.cwd(), "posts");
export const ROOT = process.cwd();

export const getSourceOfFile = (fileName) => {
  return fs.readFileSync(path.join(POSTS_PATH, fileName));
};

export const getAllPosts = () => {
  return fs
    .readdirSync(POSTS_PATH)
    .filter((path) => /\.mdx?$/.test(path))
    .map((fileName) => {
      const source = getSourceOfFile(fileName);
      const slug = fileName.replace(/\.mdx?$/, "");
      const { data } = matter(source);

      return {
        frontmatter: data,
        slug: slug,
      };
    })
    .filter(({ frontmatter }) => !frontmatter.tags?.includes('draft'))
    .sort((a, b) => compareDesc(parseISO(a.frontmatter.date), parseISO(b.frontmatter.date)));
};

export const getSinglePost = async (slug) => {
  const source = getSourceOfFile(slug + ".mdx") as any;
  console.log('bundle:', slug);
  if (process.platform === "win32") {
    process.env.ESBUILD_BINARY_PATH = path.join(
      ROOT,
      "node_modules",
      "esbuild",
      "esbuild.exe"
    );
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      ROOT,
      "node_modules",
      "esbuild",
      "bin",
      "esbuild"
    );
  }
  const { code, frontmatter } = await bundleMDX(source, {
    xdmOptions(options) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [...(options.remarkPlugins ?? []), require('remark-code-titles'), require('remark-gfm'), math]
      options.rehypePlugins = [...(options.rehypePlugins ?? []), mdxPrism, rehypeSlug, rehypeAutolinkHeadings, katex]

      return options
    },
    cwd: POSTS_PATH,
  });

  return {
    frontmatter,
    code,
  };
};