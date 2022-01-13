import { format, parseISO } from 'date-fns';
import Layout from './Layout';
import Tag from './Tag';

// this was used for next-mdx experiment...
export default ({ children, loadKatex = false, frontmatter }) => (
  <Layout loadKatex={loadKatex}>
    <article
      className="prose font-serif max-w-none 
      prose-headings:font-sans prose-headings:font-black prose-headings:text-slate-900 
      dark:prose-headings:text-gray-200 
      dark:text-gray-400 dark:prose-strong:text-gray-400 dark:prose-code:text-slate-400
      dark:prose-a:text-gray-300 prose-a:text-slate-900
      prose-blockquote:text-slate-800 dark:prose-blockquote:text-slate-400"
    >
      <div className="border-b-4 border-dotted pb-2 border-slate-900 mb-4 dark:border-slate-400">
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
      <div>{children}</div>
    </article>
  </Layout>
);
