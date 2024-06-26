import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

interface ElementIsVisited extends Element {
  isVisited: boolean;
}

/**
 * 添加语言类型标签
 *   <pre>
 *       <code class="language-js">console.log(123);</code>
 *   </pre>
 *   -->>
 *   <div class="language-js">
 *       <span class="lang">js</span>
 *       <pre>
 *           <code class="">console.log(123);</code>
 *       </pre>
 *   </div>
 * @returns
 */
export const rehypePluginPreWrapper: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      // 1. 找到 pre 元素
      if (
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0].tagName === 'code' &&
        !node.isVisited
      ) {
        const codeNode = node.children[0];
        const codeClassName = codeNode.properties?.className?.toString() || '';
        // language-xxx
        const lang = codeClassName.split('-')[1];

        // codeNode.properties.className = '';

        const clonedNode: ElementIsVisited = {
          type: 'element',
          tagName: 'pre',
          children: node.children,
          properties: {},
          isVisited: true
        };

        // 修改原来的 pre 标签 -> div 标签
        node.tagName = 'div';
        node.properties = node.properties || {};
        node.properties.className = codeClassName;

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
