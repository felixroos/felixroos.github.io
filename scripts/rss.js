import { getAllPosts } from '../lib/mdx.js';
import { Feed } from 'feed';
import path from 'path';
import fs from 'fs';

// run this script like this:
// babel-node --plugins @babel/plugin-transform-modules-commonjs scripts/rss.js
// cannot use native node esmodules because adding "type": "module" to package.json breaks next.js

console.log('update rss feed...');

const siteUrl = 'https://loophole-letters.vercel.app/';

const feed = new Feed({
  title: 'Loophole Letters Blog',
  description: 'Coding, Music and Electronics',
  id: siteUrl,
  link: siteUrl,
  language: 'en',
  copyright: '©Felix Roos',
  image: siteUrl + 'logo.png',
});

const posts = getAllPosts().filter((post) => !post.frontmatter.draft);

posts.forEach((post) =>
  feed.addItem({
    title: post.frontmatter.title,
    id: siteUrl + post.slug,
    link: siteUrl + post.slug,
    description: post.frontmatter.description,
    date: new Date(post.frontmatter.date),
    image: siteUrl + post.frontmatter.image.replace('./', ''),
    author: [
      {
        name: 'Felix Roos',
        email: 'flix91@gmail.com',
        link: 'https://github.com/felixroos',
      },
    ],
  })
);

feed.addCategory('Technology');

feed.addContributor({
  name: 'Felix Roos',
  email: 'flix91@gmail.com',
  link: 'https://github.com/felixroos',
});

const PUBLIC_PATH = path.join(process.cwd(), 'public');

const folder = path.dirname(PUBLIC_PATH);
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}
fs.writeFileSync(path.join(PUBLIC_PATH, 'rss.xml'), feed.rss2());
fs.writeFileSync(path.join(PUBLIC_PATH, 'atom.xml'), feed.atom1());
fs.writeFileSync(path.join(PUBLIC_PATH, 'feed.json'), feed.json1());

console.log('rss feed updated');
