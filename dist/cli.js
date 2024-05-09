"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _module = require('module'); const require = _module.createRequire.call(void 0, import.meta.url);


var _chunkXPIMDWV3js = require('./chunk-XPIMDWV3.js');

// src/node/plugin-rpress/cli.ts
_chunkXPIMDWV3js.init_cjs_shims.call(void 0, );
var _cac = require('cac'); var _cac2 = _interopRequireDefault(_cac);

// src/node/plugin-rpress/dev.ts
_chunkXPIMDWV3js.init_cjs_shims.call(void 0, );
var _vite = require('vite');

// src/node/constant/index.ts
_chunkXPIMDWV3js.init_cjs_shims.call(void 0, );
var _path = require('path');
var PORT = 3001;
var PACKET_ROOT = _path.join.call(void 0, __dirname, "..");
var DEFAULT_TEMPLATE_PATH = _path.join.call(void 0, PACKET_ROOT, "template.html");
var CLIENT_ENTRY_PATH = _path.join.call(void 0, 
  PACKET_ROOT,
  "src",
  "runtime",
  "client-entry.tsx"
);
var SERVER_ENTRY_PATH = _path.join.call(void 0, 
  PACKET_ROOT,
  "src",
  "runtime",
  "ssr-entry.tsx"
);

// src/node/plugin-rpress/indexHtml.ts
_chunkXPIMDWV3js.init_cjs_shims.call(void 0, );
var _promises = require('fs/promises');
function pluginIndexHtml() {
  return {
    name: "rpress:index-html",
    /**
     * 在template.html中加入script标签，可以修改html内容
     * 介绍：https://juejin.cn/post/7210278786592292920#heading-3
     * @param html
     * @returns
     */
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    /**
     * 配置服务器
     * @param server
     * @returns
     */
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let content = await _promises.readFile.call(void 0, DEFAULT_TEMPLATE_PATH, "utf-8");
          content = await server.transformIndexHtml(
            req.url,
            content,
            req.originalUrl
          );
          res.setHeader("Content-Type", "text/html");
          res.end(content);
        });
      };
    }
  };
}

// src/node/plugin-rpress/dev.ts
var _pluginreact = require('@vitejs/plugin-react'); var _pluginreact2 = _interopRequireDefault(_pluginreact);
async function createDevServer(root = process.cwd()) {
  return _vite.createServer.call(void 0, {
    root,
    plugins: [pluginIndexHtml(), _pluginreact2.default.call(void 0, )],
    server: {
      port: PORT,
      fs: {
        allow: [PACKET_ROOT]
      }
    }
  });
}

// src/node/plugin-rpress/cli.ts


// src/node/plugin-rpress/build.ts
_chunkXPIMDWV3js.init_cjs_shims.call(void 0, );


var _fsextra = require('fs-extra'); var _fsextra2 = _interopRequireDefault(_fsextra);
var _url = require('url');
async function renderPage(render, root, clientBundle) {
  const appHtml = render();
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
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
  await _fsextra2.default.ensureDir(_path.join.call(void 0, root, "build"));
  await _fsextra2.default.writeFile(_path.join.call(void 0, root, "build/index.html"), html);
  await _fsextra2.default.remove(_path.join.call(void 0, root, ".temp"));
}
async function build(root = process.cwd()) {
  const [clientBundle, serverBundle] = await bundle(root);
  const serverEntryPath = _path.join.call(void 0, root, ".temp", "ssr-entry.js");
  const { render } = await Promise.resolve().then(() => _interopRequireWildcard(require(_url.pathToFileURL.call(void 0, serverEntryPath).toString())));
  await renderPage(render, root, clientBundle);
}
async function bundle(root) {
  try {
    console.log("client building + server building ...");
    const { default: ora } = await Promise.resolve().then(() => _interopRequireWildcard(require("./ora-SXPEACQO.js")));
    const spanner = ora();
    spanner.start("Building client + server bundles ...");
    const resolveViteConfig = (isServer) => {
      return {
        mode: "production",
        root,
        build: {
          ssr: isServer,
          // 输出产物目录
          outDir: isServer ? ".temp" : "build",
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? "cjs" : "esm"
            }
          }
        }
      };
    };
    const clientBuild = async () => {
      return _vite.build.call(void 0, resolveViteConfig(false));
    };
    const serverBuild = async () => {
      return _vite.build.call(void 0, resolveViteConfig(true));
    };
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);
    spanner.stop();
    return [clientBundle, serverBundle];
  } catch (err) {
    console.log(err);
  }
}

// src/node/plugin-rpress/cli.ts
var cli = _cac2.default.call(void 0, "rpress").version("0.0.1").help();
cli.command("dev [root]", "start dev server").action(async (root) => {
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});
cli.command("build [root]", "build in production").action(async (root) => {
  try {
    root = _path.resolve.call(void 0, root);
    await build(root);
  } catch (err) {
    console.log(err);
  }
});
cli.parse();
