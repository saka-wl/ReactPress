// https://mdxjs.com/packages/rollup/
import pluginMdx from '@mdx-js/rollup';
import type { Plugin } from 'vite';
// 生成github风格的GFM(Markdown)
import remarkPluginGFM from 'remark-gfm';
// https://www.npmjs.com/package/rehype-autolink-headings
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
// 添加id属性 https://www.npmjs.com/package/rehype-slug
import rehypePluginSlug from 'rehype-slug';
// https://www.npmjs.com/package/remark-mdx-frontmatter 生成ESM导出信息
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
// https://www.npmjs.com/package/remark-frontmatter 获取元信息
import remarkFrontmatter from 'remark-frontmatter';
import { rehypePluginPreWrapper } from './rehypePlugins/preWrapper';
import { rehypePluginShiki } from './rehypePlugins/shiki';
// https://shiki.style/guide/install  添加高亮，荧光
import shiki from 'shiki';
import { remarkPluginToc } from './remarkPlugins/toc';

export async function pluginMdxRollup(): Promise<Plugin> {
  const codeToHtml = (
    await shiki.getHighlighter({
      theme: 'nord'
    })
  ).codeToHtml;
  return pluginMdx({
    // 对mdast的处理
    remarkPlugins: [
      remarkPluginGFM,
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: 'frontmatter' }],
      remarkPluginToc
    ],
    // 对HTML的AST的处理
    rehypePlugins: [
      rehypePluginSlug,
      [
        /**
         * 生成锚点信息和跳转链接
         */
        rehypePluginAutolinkHeadings,
        {
          properties: {
            class: 'header-anchor'
          },
          content: {
            type: 'text',
            value: '#'
          }
        }
      ],
      // 处理代码块
      rehypePluginPreWrapper,
      [
        rehypePluginShiki,
        {
          codeToHtml
        }
      ]
    ]
  }) as unknown as Plugin;
}
