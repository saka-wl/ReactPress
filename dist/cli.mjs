import {
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_PATH,
  createDevServer,
  createVitePlugins
} from "./chunk-RZRGFZZY.mjs";
import {
  resolveConfig
} from "./chunk-4J7KUVM4.mjs";

// src/node/cli.ts
import cac from "cac";
import { resolve } from "path";

// src/node/build.ts
import { build as viteBuild } from "vite";
import { dirname, join } from "path";
import fs from "fs-extra";
import { pathToFileURL } from "url";
var dynamicImport = new Function("m", "return import(m)");
async function renderPage(render, root, clientBundle, routes) {
  console.log("Rendering page in server side...");
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
  await Promise.all(
    routes.map(async (route) => {
      const routePath = route.path;
      const appHtml = render(routePath);
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
      const fileName = routePath.endsWith("/") ? `${routePath}index.html` : `${routePath}.html`;
      await fs.ensureDir(join(root, "build", dirname(fileName)));
      await fs.writeFile(join(root, "build", fileName), html);
    })
  );
  await fs.remove(join(root, ".temp"));
  console.log("Rendering page finished");
}
async function build(root = process.cwd(), config) {
  const [clientBundle, serverBundle] = await bundle(root, config);
  const serverEntryPath = join(root, ".temp", "ssr-entry.js");
  const { render, routes } = await import(pathToFileURL(serverEntryPath).toString());
  await renderPage(render, root, clientBundle, routes);
}
async function bundle(root, config) {
  try {
    const { default: ora } = await dynamicImport("ora");
    const spanner = ora("loading").start(
      "Building client + server bundles ..."
    );
    const resolveViteConfig = async (isServer) => {
      return {
        mode: "production",
        root,
        plugins: await createVitePlugins(config, void 0, isServer),
        ssr: {
          // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
          noExternal: ["react-router-dom"]
        },
        build: {
          ssr: isServer,
          // 输出产物目录
          outDir: isServer ? join(root, ".temp") : join(root, "build"),
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
    return [clientBundle, serverBundle];
  } catch (err) {
    console.log(err);
  }
}

// src/node/cli.ts
var cli = cac("rpress").version("0.0.1").help();
cli.command("dev [root]", "start dev server").action(async (root) => {
  const createServer = async () => {
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
    const config = await resolveConfig(root, "build", "production");
    await build(root, config);
  } catch (err) {
    console.log(err);
  }
});
cli.parse();
