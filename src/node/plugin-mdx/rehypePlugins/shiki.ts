import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Text, Root } from 'hast';
import { fromHtml } from 'hast-util-from-html';
// 用于完成代码高亮
// import shiki from 'shiki';

interface Options {
  codeToHtml(code: string, options?: any): string;
}

/**
 * 处理代码高亮
 * @param param0
 * @returns
 */
export const rehypePluginShiki: Plugin<[Options], Root> = ({ codeToHtml }) => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // 执行回调
      /**
       * <pre>
       *    <code class="language-js">console.log(123);</code>
       * </pre>
       * -->>
       */
      if (
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0].tagName === 'code'
      ) {
        // 接下来我们需要获取 『语法名称』 和 『代码内容』
        const codeNode = node.children[0];
        const codeContent = (codeNode.children[0] as Text).value;
        const codeClassName = codeNode.properties?.className?.toString() || '';
        const lang = codeClassName.split('-')[1];
        if (!lang) return;
        // 添加高亮
        // console.log("highlightedCode", highlighter)
        const highlightedCode = codeToHtml(codeContent, { lang });
        // AST转换
        const fragmentAST = fromHtml(highlightedCode, { fragment: true });
        parent.children.splice(index, 1, ...fragmentAST.children);
      }
    });
  };
};
