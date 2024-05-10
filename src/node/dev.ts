import { createServer as createViteDevServer } from 'vite';
import { PACKET_ROOT, PORT } from './constant/index.js';
import { pluginIndexHtml } from './plugin-rpress/indexHtml.js';
/**
 * pluginReact 为局部热更新
 */
import pluginReact from '@vitejs/plugin-react';
import { resolveConfig } from './config.js';
import { pluginConfig } from './plugin-rpress/config.js';

/**
 * 创建一个vite开发服务器
 * @param root
 * @returns
 */
export async function createDevServer(
  root: string = process.cwd(),
  restart: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development');
  console.log(config.siteData);
  // console.log(config);
  return createViteDevServer({
    root: PACKET_ROOT,
    plugins: [pluginIndexHtml(), pluginReact(), pluginConfig(config, restart)],
    server: {
      port: PORT,
      fs: {
        allow: [PACKET_ROOT]
      }
    }
  });
}
