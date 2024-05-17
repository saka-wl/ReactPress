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

export async function createVitePlugins(
  config: SiteConfig,
  restart?: () => Promise<void>,
  isSSR = false
) {
  return [
    pluginUnocss(unocssOptions),
    pluginIndexHtml(),
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
    await createMdxPlugins()
  ];
}
