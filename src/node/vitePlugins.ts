import { SiteConfig } from 'shared/types';
import { pluginIndexHtml } from './plugin-rpress/indexHtml';
/**
 * pluginReact 为局部热更新
 */
import pluginReact from '@vitejs/plugin-react';
import { pluginConfig } from './plugin-rpress/config';
import { pluginRoutes } from './plugin-routes';
import { createMdxPlugins } from './plugin-mdx';

export async function createVitePlugins(
  config: SiteConfig,
  restart?: () => Promise<void>
) {
  return [
    pluginIndexHtml(),
    pluginReact({
      jsxRuntime: 'automatic'
    }),
    pluginConfig(config, restart),
    pluginRoutes({
      root: config.root
    }),
    await createMdxPlugins()
  ];
}
