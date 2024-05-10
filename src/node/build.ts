import { InlineConfig, build as viteBuild } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constant';
import { join } from 'path';
import type { RollupOutput } from 'rollup';
import fs from 'fs-extra';
import { pathToFileURL } from 'url';
import { SiteConfig } from 'shared/types';
import pluginReact from '@vitejs/plugin-react';
import { pluginConfig } from './plugin-rpress/config';

const dynamicImport = new Function('m', 'return import(m)');

/**
 * 渲染出index.html
 * 处理chunk动态页面
 * @param render
 * @param root
 * @param clientBundle
 */
export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const appHtml = render();
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div id="root">${appHtml}</div>
        <script src="/${clientChunk.fileName}" type="module"></script>
    </body>
    </html>`.trim();
  await fs.ensureDir(join(root, 'build'));
  await fs.writeFile(join(root, 'build/index.html'), html);
  await fs.remove(join(root, '.temp'));
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
  console.log(pathToFileURL(serverEntryPath).toString());
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  // const { render } = await import(serverEntryPath)

  await renderPage(render, root, clientBundle as RollupOutput);
}

/**
 * 完成客户端和服务器端的打包
 * @param root
 */
export async function bundle(root: string, config: SiteConfig) {
  try {
    console.log('client building + server building ...');
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
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: 'production',
        root,
        plugins: [pluginReact(), pluginConfig(config)],
        ssr: {
          // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
          noExternal: ['react-router-dom']
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
      return viteBuild(resolveViteConfig(false));
    };
    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true));
    };
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);
    spanner.stop();

    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
    // return {
    //   clientBundle,
    //   serverBundle
    // }
  } catch (err) {
    console.log(err);
  }
}
