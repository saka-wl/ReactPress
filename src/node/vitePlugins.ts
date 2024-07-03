import { SiteConfig } from 'shared/types';
import { pluginIndexHtml } from './plugin-rpress/indexHtml';
/**
 * pluginReact 为局部热更新
 * https://www.npmjs.com/package/@vitejs/plugin-react
 */
import pluginReact from '@vitejs/plugin-react';
import { pluginConfig } from './plugin-rpress/config';
import { pluginRoutes } from './plugin-routes';
import { createMdxPlugins } from './plugin-mdx';
import pluginUnocss from 'unocss/vite';
import unocssOptions from './unocssOptions';
import path from 'path';
import { PACKET_ROOT } from './constant';
import babelPluginRpress from './babel-plugin-rpress';

const dynamicImport = new Function('m', 'return import(m)');

export async function createVitePlugins(
  config: SiteConfig,
  restart?: () => Promise<void>,
  isSSR = false,
  isDev = true
) {
  if (isDev) {
    return [
      pluginUnocss(unocssOptions),
      pluginIndexHtml(),
      pluginReact({
        // jsx转化js方式
        jsxRuntime: 'automatic',
        // include: /\.(js|jsx|ts|tsx|mdx)$/,
        // 控制jsx的导入位置
        jsxImportSource: isSSR
          ? path.join(PACKET_ROOT, 'src', 'runtime')
          : 'react'
      }),
      pluginConfig(config, restart),
      pluginRoutes({
        root: config.root,
        isSSR
      }),
      await createMdxPlugins()
    ];
  } else {
    const { visualizer } = await dynamicImport('rollup-plugin-visualizer');
    return [
      pluginUnocss(unocssOptions),
      pluginReact({
        jsxRuntime: 'automatic',
        // 控制jsx的导入位置
        jsxImportSource: isSSR
          ? path.join(PACKET_ROOT, 'src', 'runtime')
          : 'react',
        babel: {
          plugins: [babelPluginRpress]
        }
      }),
      pluginConfig(config, restart),
      pluginRoutes({
        root: config.root,
        isSSR
      }),
      await createMdxPlugins(),
      // 将这个visualizer插件放到最后的位置中
      visualizer()
    ];
  }
}
