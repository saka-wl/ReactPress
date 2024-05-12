import pluginMdx from '@mdx-js/rollup';
import type { Plugin } from 'vite';
import remarkPluginGFM from 'remark-gfm';
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
import rehypePluginSlug from 'rehype-slug';
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter';
import remarkPluginFrontmatter from 'remark-frontmatter';
import { rehypePluginPreWrapper } from './rehypePlugins/preWrapper';
import { rehypePluginShiki } from './rehypePlugins/shiki';
import shiki from 'shiki';

export async function pluginMdxRollup(): Promise<Plugin> {
  const codeToHtml = (
    await shiki.getHighlighter({
      theme: 'nord'
    })
  ).codeToHtml;
  return pluginMdx({
    remarkPlugins: [
      remarkPluginGFM,
      remarkPluginFrontmatter,
      remarkPluginMDXFrontMatter as any
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
