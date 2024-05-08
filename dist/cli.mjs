import { createRequire } from "module"; const require = createRequire(import.meta.url);
import {
  __dirname,
  init_esm_shims
} from "./chunk-FVIHHIYL.mjs";

// src/node/plugin-rpress/cli.ts
init_esm_shims();
import cac from "cac";

// src/node/plugin-rpress/dev.ts
init_esm_shims();
import { createServer as createViteDevServer } from "vite";

// src/node/constant/index.ts
init_esm_shims();
import { join } from "path";
var PORT = 3001;
var PACKET_ROOT = join(__dirname, "..");
var DEFAULT_TEMPLATE_PATH = join(PACKET_ROOT, "template.html");
var CLIENT_ENTRY_PATH = join(
  PACKET_ROOT,
  "src",
  "runtime",
  "client-entry.tsx"
);
var SERVER_ENTRY_PATH = join(
  PACKET_ROOT,
  "src",
  "runtime",
  "ssr-entry.tsx"
);

// src/node/plugin-rpress/indexHtml.ts
init_esm_shims();
import { readFile } from "fs/promises";
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
          let content = await readFile(DEFAULT_TEMPLATE_PATH, "utf-8");
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
import pluginReact from "@vitejs/plugin-react";
async function createDevServer(root = process.cwd()) {
  return createViteDevServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()],
    server: {
      port: PORT
    }
  });
}

// src/node/plugin-rpress/cli.ts
import { resolve } from "path";

// src/node/plugin-rpress/build.ts
init_esm_shims();
import { build as viteBuild } from "vite";
import { join as join2 } from "path";
import fs from "fs-extra";
import { pathToFileURL } from "url";
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
  await fs.ensureDir(join2(root, "build"));
  await fs.writeFile(join2(root, "build/index.html"), html);
  await fs.remove(join2(root, ".temp"));
}
async function build(root = process.cwd()) {
  const [clientBundle, serverBundle] = await bundle(root);
  const serverEntryPath = join2(root, ".temp", "ssr-entry.js");
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  await renderPage(render, root, clientBundle);
}
async function bundle(root) {
  try {
    console.log("client building + server building ...");
    const { default: ora } = await import("./ora-VY3Y2BZ6.mjs");
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
    return [clientBundle, serverBundle];
  } catch (err) {
    console.log(err);
  }
}

// src/node/plugin-rpress/cli.ts
var cli = cac("rpress").version("0.0.1").help();
cli.command("dev [root]", "start dev server").action(async (root) => {
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});
cli.command("build [root]", "build in production").action(async (root) => {
  try {
    root = resolve(root);
    await build(root);
  } catch (err) {
    console.log(err);
  }
});
cli.parse();
