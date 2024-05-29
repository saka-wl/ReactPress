import type { Plugin } from 'unified';
// 生成 id
import Slugger from 'github-slugger';
import { visit } from 'unist-util-visit';
import { Root } from 'mdast';
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm';
import { ecmaVersion, parse } from 'acorn';
import { Program } from '@mdx-js/mdx/lib/core';

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

interface ChildNode {
  type: 'link' | 'text' | 'inlineCode';
  value?: string;
  children?: ChildNode[];
}

/**
 * 生成类似以下的格式
 * export const tocs = [
      {
        "id": "框架定位",
        "text": "框架定位",
        "depth": 2
      }, ...
 * ]
 * @returns 
 */
export const remarkPluginToc: Plugin<[], Root> = () => {
  return (tree) => {
    const toc: TocItem[] = [];
    const slugger = new Slugger();
    let title = '';

    visit(tree, 'heading', (node) => {
      if (!node.depth || !node.children?.length) {
        return;
      }
      if (node.depth === 1) {
        title = (node.children[0] as ChildNode).value;
      }
      // h2 - h4
      // node.children 是一个数组，包含几种情况:
      // 1. 文本节点，如 '## title'
      // 结构如下:
      // {
      //   type: 'text',
      //   value: 'title'
      // }
      // 2. 链接节点，如 '## [title](/path)'
      // 结构如下:
      // {
      //   type: 'link',
      //     {
      //       type: 'text',
      //       value: 'title'
      //     }
      //   ]
      // }
      // 3. 内联代码节点，如 '## `title`'
      // 结构如下:
      // {
      //   type: 'inlineCode',
      //   value: 'title'
      // }
      if (node.depth > 1 && node.depth < 5) {
        const originalText = (node.children as ChildNode[])
          .map((child) => {
            switch (child.type) {
              case 'link':
                return child.children?.map((c) => c.value).join('');
              default:
                return child.value;
            }
          })
          .join('');
        // A -> A
        // A -> A-1
        const id = slugger.slug(originalText);
        toc.push({
          id,
          text: originalText,
          depth: node.depth
        });
      }
    });

    const treeAddMsg = (name: string, value: string, isString: boolean) => {
      let inserted;
      if (!isString) {
        inserted = `export const ${name} = ${value}`;
      } else {
        inserted = `export const ${name} = '${value}'`;
      }
      tree.children.push({
        type: 'mdxjsEsm',
        value: inserted,
        data: {
          estree: parse(inserted, {
            ecmaVersion: 2020,
            sourceType: 'module'
          })
        }
      } as MdxjsEsm);
    };

    // 注入 export const toc = [] 信息
    treeAddMsg('toc', JSON.stringify(toc, null, 2), false);

    /**
     * h1 标题
     */
    if (title) treeAddMsg('title', title, true);
  };
};

// const insertedCode = `export const toc = ${JSON.stringify(toc, null, 2)}`;
// tree.children.push({
//   type: 'mdxjsEsm',
//   value: insertedCode,
//   data: {
//     estree: parse(insertedCode, {
//       ecmaVersion: '2020' as ecmaVersion,
//       sourceType: 'module'
//     })
//   }
// } as MdxjsEsm);

//   const insertedTitle = `export const title = '${title}'`;
//   tree.children.push({
//     type: 'mdxjsEsm',
//     value: insertedTitle,
//     data: {
//       estree: parse(insertedTitle, {
//         ecmaVersion: 2020,
//         sourceType: 'module'
//       }) as unknown as Program
//     }
//   } as MdxjsEsm);
