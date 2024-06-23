import { expect, test, describe } from 'vitest';

import { Plugin, unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { rehypePluginPreWrapper } from '../../plugin-mdx/rehypePlugins/preWrapper';
import { rehypePluginShiki } from '../../plugin-mdx/rehypePlugins/shiki';
import shiki from 'shiki';
import { remarkPluginToc } from '../../plugin-mdx/remarkPlugins/toc';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkFrontmatter from 'remark-frontmatter';
import remarkStringify from 'remark-stringify';
import remarkMdx from 'remark-mdx';

describe('Markdown compile cases', async () => {
  // 初始化 processor

  const mdContent1 = `---
pageType: home
name: wl
---
# HelloJs
## this is 
`;
  const mdContent2 =
    '# h1\n## h2 `coderrrr`\n### h3 [link](https://islandjs.dev)\n#### h4\n##### h5\n```js\nconsole.log(123);\n```';

  test('Compile MDX', async () => {
    const processor = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkPluginToc)
      .use(remarkFrontmatter)
      .use(remarkMdxFrontmatter, { name: 'frontmatter' })
      .use(remarkStringify)
      .parse(mdContent1);
    // const result = processor.processSync(mdContent1);
    // console.log("Compile MDX:\n" + result.value.toString())
    console.log('Compile MDX:\n' + processor);
  });

  test('Compile TOC', async () => {
    const processor = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .use(rehypePluginPreWrapper)
      .use(rehypePluginShiki, {
        codeToHtml: (
          await shiki.getHighlighter({
            theme: 'nord'
          })
        ).codeToHtml
      });
    const result = processor.processSync(mdContent2);
    // console.log("Compile TOC:\n" + result.value.toString())
  });
});
