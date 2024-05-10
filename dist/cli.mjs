import {
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_PATH
} from "./chunk-JEWFH6AK.mjs";
import {
  init_esm_shims
} from "./chunk-XDH75DKF.mjs";

// src/node/cli.ts
init_esm_shims();
import cac from "cac";
import { resolve } from "path";

// src/node/build.ts
init_esm_shims();
import { build as viteBuild } from "vite";
import { join } from "path";
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
  await fs.ensureDir(join(root, "build"));
  await fs.writeFile(join(root, "build/index.html"), html);
  await fs.remove(join(root, ".temp"));
}
async function build(root = process.cwd()) {
  const [clientBundle, serverBundle] = await bundle(root);
  const serverEntryPath = join(root, ".temp", "ssr-entry.js");
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  await renderPage(render, root, clientBundle);
}
async function bundle(root) {
  try {
    console.log("client building + server building ...");
    const { default: ora } = await import("./ora-KYAXMP6E.mjs");
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

// src/node/cli.ts
var cli = cac("rpress").version("0.0.1").help();
cli.command("dev [root]", "start dev server").action(async (root) => {
  const createServer = async () => {
    const { createDevServer } = await import("./dev.mjs");
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };
  await createServer();
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
