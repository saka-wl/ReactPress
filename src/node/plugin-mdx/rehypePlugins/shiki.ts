import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Text, Root } from 'hast';
// https://www.npmjs.com/package/hast-util-from-html
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
        // codeContent 为 "console.log(123);\n"
        // 转换为
        /**
         * '<pre class="shiki nord" style="background-color: #2e3440ff" tabindex="0">
         * <code>
         * <span class="line">
         * <span style="color: #D8DEE9">console</span>
         * <span style="color: #ECEFF4">.</span>
         * <span style="color: #88C0D0">log</span>
         * <span style="color: #D8DEE9FF">(</span>
         * <span style="color: #B48EAD">123</span>
         * <span style="color: #D8DEE9FF">)</span>
         * <span style="color: #81A1C1">;</span>
         * </span>
         * \n
         * <span class="line"></span>
         * </code>
         * </pre>'
         */
        const highlightedCode = codeToHtml(codeContent, { lang });
        // html string -> hast
        const fragmentAST = fromHtml(highlightedCode, { fragment: true });
        parent.children.splice(index, 1, ...fragmentAST.children);
      }
    });
  };
};
