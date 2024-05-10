import cac from 'cac';
import { createDevServer } from './dev';
import { resolve } from 'path';
import { build } from './build';
import { resolveConfig } from './config';

const cli = cac('rpress').version('0.0.1').help();

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
      const config = await resolveConfig(root, 'build', 'production');
      await build(root, config);
    } catch (err) {
      console.log(err);
    }
  });

cli.parse();
