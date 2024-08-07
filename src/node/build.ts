import { InlineConfig, build as viteBuild } from 'vite';
import {
  CLIENT_ENTRY_PATH,
  EXTERNALS,
  MASK_SPLITTER,
  PACKET_ROOT,
  SERVER_ENTRY_PATH
} from './constant';
import path, { dirname, join } from 'path';
import type { RollupOutput } from 'rollup';
import fs from 'fs-extra';
import { pathToFileURL } from 'url';
import { SiteConfig } from 'shared/types';
import { createVitePlugins } from './vitePlugins';
import type { RouteObject } from 'react-router-dom';
import { RenderResult } from '../runtime/ssr-entry';
import { HelmetData } from 'react-helmet-async';

const dynamicImport = new Function('m', 'return import(m)');

const CLIENT_OUTPUT = 'build';

// SwitchAppearance: '../SwitchAppearance!!RPRESS!!D:/font/mydemo/ReactPress/src/theme-default/components/Nav/index.tsx'
async function buildRpress(
  root: string,
  rpressToPathMap: Record<string, string>
) {
  // { Aside: 'xxx' }
  // -> import { Aside } from 'xxx'
  // window.RPRESS = { Aside }
  // window.RPRESS_PROPS =
  // JSON.parse(document.querySelector('#rpress-props').textContent)
  const rpressInjectCode = `
  ${Object.entries(rpressToPathMap)
    .map(([rpressName, rpressPath]) => {
      return `
      import { ${rpressName} } from '${rpressPath}';
      `;
    })
    .join('')}
  window.RPRESS = { ${Object.keys(rpressToPathMap).join(', ')} };
  window.RPRESS_PROPS = JSON.parse(
    document.getElementById('rpress-props').textContent
  );
  `;

  // console.log('rpressInjectCode:  ' + rpressInjectCode);
  const injectId = 'rpress:inject';
  return viteBuild({
    mode: 'production',
    esbuild: {
      jsx: 'automatic'
    },
    build: {
      // 输出目录
      outDir: path.join(root, '.temp'),
      rollupOptions: {
        input: injectId,
        external: EXTERNALS
      }
    },
    plugins: [
      // 重点插件，用来加载我们拼接的 rpress 注册模块的代码
      // https://segmentfault.com/a/1190000043830025#item-3-4
      {
        name: 'rpress:inject',
        enforce: 'post', // 最后再处理入口文件
        // rpress:inject../../components/Aside/index!!RPRESS!!D:/font/mydemo/ReactPress/src/theme-default/Layout/DocLayout/index.tsx
        async resolveId(id) {
          if (id.includes(MASK_SPLITTER)) {
            const [originId, importer] = id.split(MASK_SPLITTER);
            // this.resolve会执行所有插件
            // 获取目标的信息，解析路径，否则无法通过打包
            // resp 是一个对象，包括解析后的路径、是否被 enternal 等
            const resp = await this.resolve(originId, importer, {
              skipSelf: true
            });
            /**
             * {
                external: false,
                id: 'D:/font/mydemo/ReactPress/src/theme-default/components/Aside/index.tsx',
                meta: {},
                moduleSideEffects: true,
                syntheticNamedExports: false
              }
             */
            return resp;
          }

          if (id === injectId) {
            return id;
          }
        },
        load(id) {
          if (id === injectId) {
            return rpressInjectCode;
          }
        },
        // 对于 rpress Bundle，我们只需要 JS 即可，其它资源文件可以删除
        generateBundle(_, bundle) {
          for (const name in bundle) {
            if (bundle[name].type === 'asset') {
              delete bundle[name];
            }
          }
        }
      }
    ]
  });
}

/**
 * 渲染出index.html
 * 处理chunk动态页面
 * @param render
 * @param root
 * @param clientBundle
 */
export async function renderPage(
  render: (pagePath: string, helmetContext: object) => Promise<RenderResult>,
  root: string,
  clientBundle: RollupOutput,
  routes: RouteObject[]
) {
  console.log('Rendering page in server side...');
  fs.existsSync(join(root, '.temp')) && (await fs.remove(join(root, '.temp')));
  // clientBundle中是一些依赖包的打包结果
  const recordRpress = {};

  const clientChunk = clientBundle.output.find((chunk) => {
    console.log(chunk);
    return chunk.type === 'chunk' && chunk.isEntry;
  });

  const handleRoutes = async (route) => {
    const routePath = route.path;
    const helmetContext = {
      context: {}
    } as HelmetData;
    // console.log(routePath);
    // 在node服务器中生成相应的html等文件
    const {
      appHtml,
      rpressProps = [],
      rpressToPathMap
    } = await render(routePath, helmetContext.context);
    const styleAssets = clientBundle.output.filter(
      (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.css')
    );

    let recordRpressKey = '';
    Object.entries(rpressToPathMap).map(([rpressName, rpressPath]) => {
      recordRpressKey += rpressName;
    });
    let rpressCode = '';
    // console.log(recordRpress)
    if (
      recordRpress[recordRpressKey] === null ||
      recordRpress[recordRpressKey] === undefined
    ) {
      const rpressBundle = await buildRpress(root, rpressToPathMap);
      // 交互的逻辑rpressProps为交互props的信息
      rpressCode = (rpressBundle as RollupOutput).output[0].code;
      recordRpress[recordRpressKey] = rpressCode;
    } else {
      rpressCode = recordRpress[recordRpressKey];
    }
    const { helmet } = helmetContext.context;
    const normalizeVendorFilename = (fileName: string) =>
      fileName.replace(/\//g, '_') + '.js';
    // 获取icon图片
    const lastIndex = routePath.lastIndexOf('/');
    let flag = '';
    if (lastIndex > 0 && lastIndex < routePath.length - 1) {
      flag = '.';
    }
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="referrer" content="no-referrer" />
  <link rel="shortcut icon" href=".${flag}/rpress.png" type="image/x-icon">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  ${helmet?.title?.toString() || ''}
  ${helmet?.meta?.toString() || ''}
  ${helmet?.link?.toString() || ''}
  ${helmet?.style?.toString() || ''}
  <meta name="description" content="xxx">
  ${styleAssets
    .map((item) => `<link rel="stylesheet" href="/${item.fileName}">`)
    .join('\n')}
  <script type="importmap">
    {
      "imports": {
        ${EXTERNALS.map(
          (name) => `"${name}": "/${normalizeVendorFilename(name)}"`
        ).join(',')}
      }
    }
  </script>
</head>
<body>
  <div id="root">${appHtml}</div>
  <script type="module">${rpressCode}</script>
  <script type="module" src="/${clientChunk?.fileName}"></script>
  <script id="rpress-props">${JSON.stringify(rpressProps)}</script>
</body>
</html>`.trim();
    const fileName = routePath.endsWith('/')
      ? `${routePath}index.html`
      : `${routePath}.html`;
    await fs.ensureDir(join(root, CLIENT_OUTPUT, dirname(fileName)));
    await fs.writeFile(join(root, CLIENT_OUTPUT, fileName), html);
  };

  const asyncFn = async () => {
    const allRoutes = [
      ...routes,
      {
        path: '/404'
      }
    ];
    for (const item of allRoutes) {
      await handleRoutes(item);
    }
  };

  await asyncFn();
  // fs.existsSync(join(root, '.temp')) && (await fs.remove(join(root, '.temp')));
  console.log('Rendering page finished');
}

/**
 * SSG 的核心逻辑
 * @param root
 */
export async function build(root: string = process.cwd(), config: SiteConfig) {
  // 1. 使用vite打包
  // clientBundle中是一些依赖包和逻辑的打包结果
  const clientBundle = await bundle(root, config);
  // 2. 引入server-entry模块
  const serverEntryPath = join(root, '.temp', 'ssr-entry.js');
  // 3. 服务端渲染，产出html内容
  // 这里为何要这样导入？
  // 因为我们使用了tsup工程，我们导入的应该是 打包完成之后 的server-ssr.js，而非server-ssr.ts
  /**
   * 获取render渲染函数和路由信息
   */
  const { render, routes } = await import(
    pathToFileURL(serverEntryPath).toString()
  );

  /**
   * 渲染输出文件
   */
  await renderPage(render, root, clientBundle as RollupOutput, routes);
}

/**
 * https://v3.vitejs.dev/guide/ssr.html#ssr-format
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
        plugins: await createVitePlugins(config, undefined, isServer, false),
        ssr: {
          // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
          noExternal: ['react-router-dom']
        },
        build: {
          ssr: isServer,
          // 输出产物目录
          outDir: isServer ? join(root, '.temp') : join(root, CLIENT_OUTPUT),
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? 'cjs' : 'esm'
            },
            external: EXTERNALS
          }
        }
      };
    };

    const clientBuild = async () => {
      const client = await resolveViteConfig(false);
      return await viteBuild(client);
    };
    const serverBuild = async () => {
      const server = await resolveViteConfig(true);
      return await viteBuild(server);
    };
    // const [clientBundle, serverBundle] = await Promise.all([
    //   clientBuild(),
    //   serverBuild()
    // ]);
    await serverBuild();
    const clientBundle = await clientBuild();
    // 打包获取图片等资源和vendors
    const publicDir = join(root, 'public');
    if (fs.pathExistsSync(publicDir)) {
      await fs.copy(publicDir, join(root, CLIENT_OUTPUT));
    }
    await fs.copy(join(PACKET_ROOT, 'vendors'), join(root, CLIENT_OUTPUT));

    spanner.stop();

    return clientBundle as RollupOutput;

    // return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (err) {
    console.log(err);
  }
}
