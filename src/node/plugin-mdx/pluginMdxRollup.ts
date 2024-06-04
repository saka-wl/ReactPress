// https://mdxjs.com/packages/rollup/
import pluginMdx from '@mdx-js/rollup';
import type { Plugin } from 'vite';
// 生成github风格的GFM(Markdown)
import remarkPluginGFM from 'remark-gfm';
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
// 添加id属性
import rehypePluginSlug from 'rehype-slug';
// 将mdx文件中命名的变量提取出来
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
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
    remarkPlugins: [
      remarkPluginGFM,
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: 'frontmatter' }],
      remarkPluginToc
    ],
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
