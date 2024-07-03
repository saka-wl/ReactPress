import fs from 'fs-extra';
import { join } from 'path';
import { exec, spawn } from 'child_process';

const template = (root: string, port: number) => `
const compression = require("compression")
const { resolve } = require("path")
const fs = require("fs-extra")
const sirv = require("sirv")
const express = require('express')

const DEFAULT_PORT = 4173;

function startServer(root, port) {
  const listenPort = port ?? DEFAULT_PORT;
  const outputDir = resolve(root);

  const notFoundPage = fs.readFileSync(resolve(outputDir, '404.html'), 'utf-8');
  const app = express();

  app.use(compression())

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

  app.use(serve);
  app.use('*', function (req, res) {
    res.end(notFoundPage);
  });

  app.listen(listenPort, (err) => {
    if (err) {
      throw err;
    }
    console.log(
      '> Preview server is running at http://localhost:' + listenPort
    );
  });
}

startServer('${root}', ${port})  
`;

export const addExpressServer = async (
  root: string,
  port: number,
  linux: string
) => {
  console.log(linux);
  fs.existsSync(join(__dirname, '../server')) &&
    (await fs.remove(join(__dirname, '../server')));
  const originFileDir = join(root, './build');
  await fs.ensureDir(join(__dirname, '../server'));

  if (fs.pathExistsSync(originFileDir)) {
    await fs.copy(originFileDir, join(__dirname, '../server'));
    await fs.ensureFile(join(__dirname, '../server/app.js'));
    await fs.writeFile(
      join(__dirname, '../server/app.js'),
      template(linux, port)
    );
  }

  exec('cd server && npm init -y', (err) => {
    console.log(err);
    exec('cd server && npm i compression fs-extra sirv express', (err) => {
      console.log(err);
    });
  });

  // let ls1 = spawn('npm', ['init', '-y'])
  // let ls2 = spawn('npm', ['i'])

  // try {
  //     ls1.stdout.on('data', (data) => {
  //         console.log(`stdout: ${data}`);
  //     });

  //     ls1.stderr.on('data', (data) => {
  //         console.error(`stderr: ${data}`);
  //     });

  //     ls1.on('close', (code) => {
  //         ls2.stdout.on('data', (data) => {
  //             console.log(`stdout: ${data}`);
  //         });

  //         ls2.stderr.on('data', (data) => {
  //             console.error(`stderr: ${data}`);
  //         });
  //     });
  // } catch (err) {
  //     console.log(err)
  // }
};
