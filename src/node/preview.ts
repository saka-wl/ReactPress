import compression from 'compression';
// import express from "express"
import { resolve } from 'path';
import { resolveConfig } from './config';
import fs from 'fs-extra';
import sirv from 'sirv';

const dynamicImport = new Function('m', 'return import(m)');

const DEFAULT_PORT = 4173;

export async function preview(root: string, { port }: { port?: number }) {
  const config = await resolveConfig(root, 'serve', 'production');
  const listenPort = port ?? DEFAULT_PORT;
  const outputDir = resolve(root, 'build');
  const { default: express } = await dynamicImport('express');

  const notFoundPage = fs.readFileSync(resolve(outputDir, '404.html'), 'utf-8');
  // const compress = compression();
  const app = express();

  app.use(compression());

  // 静态资源服务
  const serve = sirv(outputDir, {
    etag: true,
    maxAge: 31536000,
    immutable: true,
    setHeaders(res, pathname) {
      if (pathname.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  });

  // app.use(compress);
  app.use(serve);
  app.use('*', function (req, res) {
    res.end(notFoundPage);
  });

  app.listen(listenPort, (err) => {
    if (err) {
      throw err;
    }
    console.log(
      `> Preview server is running at http://localhost:${listenPort}`
    );
  });
}
