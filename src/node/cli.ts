import cac from 'cac';
import { createDevServer } from './dev';
import { join, resolve } from 'path';
import { build } from './build';
import { resolveConfig } from './config';
import { preview } from './preview';
import fs from 'fs-extra';
import { addExpressServer } from './server';
import { handleAlgoliaJson } from './getAlgoliaJson';

const cli = cac('rpress').version('0.0.1').help();

// rpress dev [root]
// rpress build [root]
// rpress preview [root]
// rpress server [root]
// rpress getJson [root]

/**
 * 创建一个npm命令
 */
cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  // root为传入的目录，没有就默认为程序当前运行命令
  const createServer = async () => {
    // const { createDevServer } = await import('./dev.js');
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };
  await createServer();
});

/**
 * 流程：（将runtime内的app.jsx遍历转换为index.html与js）
 * 将目标目录root先
 * vite打包生成client + server ->
 * 处理index.html文件，加入script标签 ->
 * 生成文件，删除
 */
cli
  .command('build [root]', 'build in production')
  .action(async (root: string) => {
    try {
      root = resolve(root);
      fs.existsSync(join(root, 'build')) &&
        (await fs.remove(join(root, 'build')));
      fs.existsSync(join(root, '.temp')) &&
        (await fs.remove(join(root, '.temp')));
      // fs.existsSync(join(root, '../.temp')) &&
      //   (await fs.remove(join(root, '../.temp')));
      const config = await resolveConfig(root, 'build', 'production');
      await build(root, config);
    } catch (err) {
      console.log(err);
    }
  });

cli
  .command('preview [root]', 'preview production build')
  .option('--port <port>', 'port to use for preview server')
  .action(async (root: string, { port }: { port: number }) => {
    try {
      root = resolve(root);
      await preview(root, { port });
    } catch (e) {
      console.log(e);
    }
  });

/**
 * 添加express框架的代码
 */
cli
  .command('server [... args]', 'add a server by node-express')
  .option('--port <port>', 'port to use for adding a server')
  .action(async (args: Array<string>, { port }: { port: number }) => {
    try {
      await addExpressServer(args[0], port, args[1]);
    } catch (e) {
      console.log(e);
    }
  });

cli.command('getJson [root]').action(async (root: string) => {
  const config = await resolveConfig(root, 'build', 'production');
  await handleAlgoliaJson(root, config);
});

cli.parse();
