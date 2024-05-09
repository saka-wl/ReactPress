import { createServer as createViteDevServer } from 'vite';
import { PACKET_ROOT, PORT } from '../constant/index.js';
import { pluginIndexHtml } from './indexHtml.js';
/**
 * pluginReact 为局部热更新
 */
import pluginReact from '@vitejs/plugin-react';

/**
 * 创建一个vite开发服务器
 * @param root
 * @returns
 */
export async function createDevServer(root: string = process.cwd()) {
  return createViteDevServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()],
    server: {
      port: PORT,
      fs: {
        allow: [PACKET_ROOT]
      }
    }
  });
}
