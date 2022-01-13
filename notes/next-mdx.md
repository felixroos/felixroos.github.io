# experiment: using @next/mdx

## 1. copy files from posts to pages

## 2. install

- "@mdx-js/loader": "^1.6.22",
- "@next/mdx": "^12.0.8",

## 3. add config

next.config.js

```js
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      require('remark-math'), // does not seem to work..
      require('remark-code-titles'),
      require('remark-gfm'),
      // require('remark-toc'),
    ],
    rehypePlugins: [
      require('mdx-prism'),
      require('rehype-slug'),
      require('rehype-autolink-headings'),
      require('rehype-katex'),
    ],
  },
});
module.exports = withMDX({
  pageExtensions: ['tsx', 'md', 'mdx'],
  basePath: '',
  experimental: {
    scrollRestoration: true,
  },
});
```

## 4. migrate mdx file(s)

### 1. refactor frontmatter to exported object

```md
---
title: DIY Modular Synth
date: '2021-11-28'
tags: ['diy', 'electronics', 'synthesis']
description: Let's build a modular synth!
image: ./img/diy-modular-synth/midi2cv-styleshot.png
---
```

to

```js
export const frontmatter = {
  title: 'DIY Modular Synth',
  date: '2021-11-28',
  tags: ['diy', 'electronics', 'synthesis'],
  description: "Let's build a modular synth!",
  image: './img/diy-modular-synth/midi2cv-styleshot.png',
};
```

could possibly write a mdx plugin for that?

### 2. default export PostLayout

```js
// to end of file
import PostLayout from '../components/PostLayout';

export default ({ children }) => <PostLayout frontmatter={frontmatter}>{children}</PostLayout>;
```

### 3. add custom components

inside \_app.tsx:

```jsx
<MDXProvider components={{ a: CustomLink, img: Img }}>
  <Component {...pageProps} />
</MDXProvider>
```

## Pros

- hot reload
- faster bundling

## Cons

- not compatible with mdx-bundler => no gray-matter support in @next/mdx.
  - next-mdx-remote does support it but [no imports](https://github.com/hashicorp/next-mdx-remote/issues/143)
- cannot use es module remark-packages (as next.config.js does not support es modules) => deal breaker...
- mdx files tied to next.js and blog layout
- more verbose
- images?
- graphviz did not work when testing..
