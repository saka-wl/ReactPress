import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { rehypePluginShiki } from '../../plugin-mdx/rehypePlugins/shiki';
import shiki from 'shiki';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeStringify from 'rehype-stringify';
import remarkStringify from 'remark-stringify';
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
const mdContent2 = `# h1
## h2 hello
### h3 [link](https://islandjs.dev)
#### h4
##### h5`;

const mdContent3 = fs.readFileSync(join(__dirname, './tmp.mdx'), 'utf-8');

const Test1 = async () => {
  const processor = await unified()
    .use(remarkParse) // mdx -> mdast
    .use(remarkRehype) // mdast -> hast
    .use(rehypeStringify) // hast -> HTML
    .process(mdContent2);

  console.log(processor);
};

// Test1()

const Test2 = async () => {
  const rehypePlugin = () => {
    return (tree) => {
      visit(tree, 'element', (node) => {
        if (
          node.tagName === 'pre' &&
          node.type === 'element' &&
          node.children[0].tagName === 'code' &&
          node.children[0].type === 'element' &&
          !node.isVisited
        ) {
          const codeNode = node.children[0];
          const codeNodeClassName =
            codeNode.properties?.className?.toString() || '';
          const lang = codeNodeClassName.split('-')[1];
          const clonedNode = {
            type: 'element',
            tagName: 'pre',
            children: node.children,
            properties: {},
            isVisited: true
          };
          node.tagName = 'div';
          node.properties = node.properties || {};
          node.properties.className = [codeNodeClassName];

          node.children = [
            {
              type: 'element',
              tagName: 'span',
              properties: {
                className: 'lang'
              },
              children: [
                {
                  type: 'text',
                  value: lang
                }
              ]
            },
            clonedNode
          ];
        }
      });
    };
  };

  const { codeToHtml } = await shiki.getHighlighter({
    theme: 'nord'
  });

  const mdx = '```javascript\nconst a = 20;\n```';

  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePlugin)
    .use(rehypePluginShiki, { codeToHtml })
    .use(rehypeStringify);

  const result = processor.processSync(mdx);

  console.log(result);
};

// Test2();

const Test3 = async () => {
  const tocPlugin = function () {
    return function (tree) {
      let headToc: any = [];
      visit(tree, 'heading', (node, index, parent) => {
        if (node.depth) {
          headToc.push({
            id: Math.random().toString(),
            text: node.children[0].value
          });
        }
      });
      headToc = `export const toc = ${JSON.stringify(headToc, null, 2)}`;
      tree.children.push({
        type: 'mdxjsEsm',
        value: headToc,
        data: {
          estree: parse(headToc, {
            ecmaVersion: 2020,
            sourceType: 'module'
          })
        }
      });
    };
  };

  const treeTest = () => {
    return (tree) => {
      console.log(tree);
    };
  };

  const process = await unified()
    .use(remarkParse) // mdx -> mdast
    // .use(remarkFrontmatter, ['yaml', 'toml'])
    // .use(remarkMdxFrontmatter, { name: "frontmatter" })
    // .use(treeTest)
    .use(tocPlugin)
    .use(remarkMdx) // 支持ESM，JSX语法
    .use(remarkStringify) // hast -> mdx
    .process(mdContent3);

  console.log(process);
};

Test3();
