import { SitemapStream, streamToPromise } from 'sitemap';
import { WEBSITE_HOST_URL } from '../../components/Head';
import { getAllPosts } from '../../lib/mdx';

export default async (req, res) => {
  try {
    const smStream = new SitemapStream({
      hostname: WEBSITE_HOST_URL,
      cacheTime: 600000,
    });

    // List of posts
    // const post_slugs = ['news-1', 'news-2', 'news-3'];
    const post_slugs = getAllPosts()
      .filter(({ frontmatter }) => !frontmatter.draft)
      .map(({ slug }) => slug);

    // Create each URL row
    post_slugs.forEach((post) => {
      smStream.write({
        url: `${post}`,
        changefreq: 'daily',
        priority: 0.9,
      });
    });

    // End sitemap stream
    smStream.end();

    // XML sitemap string
    const sitemapOutput = (await streamToPromise(smStream)).toString();

    // Change headers
    res.writeHead(200, {
      'Content-Type': 'application/xml',
    });

    // Display output to user
    res.end(sitemapOutput);
  } catch (e) {
    console.log(e);
    res.send(JSON.stringify(e));
  }
};
