import { Plugin, unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { rehypePluginPreWrapper } from '../../plugin-mdx/rehypePlugins/preWrapper';
import { rehypePluginShiki } from '../../plugin-mdx/rehypePlugins/shiki';
import shiki from 'shiki';
import { remarkPluginToc } from '../../plugin-mdx/remarkPlugins/toc';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkFrontmatter from 'remark-frontmatter';
import remarkStringify from 'rehype-stringify';
import remarkMdx from 'remark-mdx';
import { visit } from 'unist-util-visit';
import { parse } from 'acorn';
import fs from 'fs-extra';
import { join } from 'path';
import remarkPluginGFM from 'remark-gfm';

const mdContent1 = `---
pageType: home
name: wl
---
# HelloJs
## this is 
`;
const mdContent2 =
  '# h1\n## h2 `coderrrr`\n### h3 [link](https://islandjs.dev)\n#### h4\n##### h5\n';

const mdContent3 = fs.readFileSync(join(__dirname, './tmp.mdx'));

const processor1 = unified()
  .use(remarkMdx) // 添加mdx解析和序列化的支持
  .use(remarkParse) // mdx转换为语法树
  .use(remarkFrontmatter)
  .use(remarkMdxFrontmatter, { name: 'frontmatter' })
  .use(remarkStringify) // 语法树转换为mdx
  .parse(mdContent2);

let headToc: any = [];

visit(processor1, 'heading', (node, index, parent) => {
  if (node.depth) {
    headToc.push({
      id: Math.random().toString(),
      text: node.children[0].value
    });
  }
});

headToc = 'export const toc = ' + JSON.stringify(headToc);

processor1.children.push({
  type: 'mdxjsEsm',
  value: headToc,
  data: {
    estree: parse(headToc, {
      ecmaVersion: 2020,
      sourceType: 'module'
    })
  }
});

// console.log(processor1)

const Test3 = async () => {
  const rehypePlugin = () => {
    return (tree) => {
      visit(tree, 'element', (node) => {
        console.log(node);
      });
    };
  };

  const processor3 = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkStringify)
    .use(rehypePlugin);

  // .use(rehypePluginShiki, {
  //     codeToHtml: (
  //         await shiki.getHighlighter({
  //             theme: 'nord'
  //         })
  //     ).codeToHtml
  // })

  // console.log(processor3)
  const result = processor3.processSync(mdContent3);

  // console.log(result)
};

Test3();
