import { createServer as createViteDevServer } from 'vite';
import { PACKET_ROOT, PORT } from './constant/index.js';
import { resolveConfig } from './config.js';
import { createVitePlugins } from './vitePlugins.js';

/**
 * 创建一个vite开发服务器
 * @param root
 * @returns
 */
export async function createDevServer(
  root: string = process.cwd(),
  restart: () => Promise<void>
) {
  /**
   * config的类型，就是获取用户配置文件路径和配置文件内容
   * 
    config = {
      root: 'docs',
      configPath: 'D:\\font\\mydemo\\ReactPress\\docs\\config.ts',
      siteData: {
        title: 'SAKA_WL',
        description: 'SSG Framework',
        themeConfig: { nav: [] },
        vite: {}
      }
    }
   */
  const config = await resolveConfig(root, 'serve', 'development');
  // console.log(config.siteData);
  // console.log('config', config);
  return createViteDevServer({
    root: PACKET_ROOT,
    plugins: await createVitePlugins(config, restart),
    server: {
      port: PORT,
      fs: {
        allow: [PACKET_ROOT]
      }
    }
  });
}
