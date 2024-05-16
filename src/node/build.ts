import { InlineConfig, Plugin, build as viteBuild } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constant';
import { dirname, join } from 'path';
import type { RollupOutput } from 'rollup';
import fs from 'fs-extra';
import { pathToFileURL } from 'url';
import { SiteConfig } from 'shared/types';
import { createVitePlugins } from './vitePlugins';
import type { RouteObject } from 'react-router-dom';

const dynamicImport = new Function('m', 'return import(m)');

/**
 * 渲染出index.html
 * 处理chunk动态页面
 * @param render
 * @param root
 * @param clientBundle
 */
export async function renderPage(
  render: (pagePath: string) => Promise<string>,
  root: string,
  clientBundle: RollupOutput,
  routes: RouteObject[]
) {
  console.log('Rendering page in server side...');
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  await Promise.all(
    routes.map(async (route) => {
      const routePath = route.path;
      // console.log(routePath)
      const appHtml = await render(routePath);
      const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
</html>`.trim();
      const fileName = routePath.endsWith('/')
        ? `${routePath}index.html`
        : `${routePath}.html`;
      await fs.ensureDir(join(root, 'build', dirname(fileName)));
      await fs.writeFile(join(root, 'build', fileName), html);
    })
  );
  // await fs.remove(join(root, '.temp'));
  console.log('Rendering page finished');
}

/**
 * SSG 的核心逻辑
 * 构建出client端 + server端
 * @param root
 */
export async function build(root: string = process.cwd(), config: SiteConfig) {
  // 1. bundle client端 + server端
  const [clientBundle, serverBundle] = await bundle(root, config);
  // 2. 引入server-entry模块
  const serverEntryPath = join(root, '.temp', 'ssr-entry.js');
  // 3. 服务端渲染，产出html内容
  // console.log(pathToFileURL(serverEntryPath).toString());
  /**
   * react的render渲染函数
   */
  const { render, routes } = await import(
    pathToFileURL(serverEntryPath).toString()
  );
  // const { render } = await import(serverEntryPath)

  await renderPage(render, root, clientBundle as RollupOutput, routes);
}

/**
 * 完成客户端和服务器端的打包
 * @param root
 */
export async function bundle(root: string, config: SiteConfig) {
  try {
    /**
     * 在mjs中可以正常使用CJS模块
     * 但在 CJS 中无法正常使用mjs模块
     * 因为 CJS 模块是通过 require 进行同步加载的，
     * 而 ESM 模块是通过 import 异步加载。
     * 同步的 require 方法并不能导入 ESM 模块
     */
    const { default: ora } = await dynamicImport('ora');

    // console.log(root) // D:\font\mydemo\ReactPress\docs

    const spanner = ora('loading').start(
      'Building client + server bundles ...'
    );
    const resolveViteConfig = async (
      isServer: boolean
    ): Promise<InlineConfig> => {
      return {
        mode: 'production',
        root,
        plugins: await createVitePlugins(config, undefined, isServer),
        ssr: {
          // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
          noExternal: ['react-router-dom', 'lodash-es']
        },
        build: {
          ssr: isServer,
          // 输出产物目录
          outDir: isServer ? join(root, '.temp') : join(root, 'build'),
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? 'cjs' : 'esm'
            }
          }
        }
      };
    };
    const clientBuild = async () => {
      const client = await resolveViteConfig(false);
      return viteBuild(client);
    };
    const serverBuild = async () => {
      const server = await resolveViteConfig(true);
      return viteBuild(server);
    };
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);
    spanner.stop();

    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (err) {
    console.log(err);
  }
}
