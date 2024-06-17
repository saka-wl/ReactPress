import {
  CLIENT_ENTRY_PATH,
  EXTERNALS,
  MASK_SPLITTER,
  PACKET_ROOT,
  SERVER_ENTRY_PATH,
  createDevServer,
  createVitePlugins
} from "./chunk-A3SCRJOK.mjs";
import {
  resolveConfig
} from "./chunk-FT4M4DY2.mjs";

// src/node/cli.ts
import cac from "cac";
import { join as join2, resolve as resolve2 } from "path";

// src/node/build.ts
import { build as viteBuild } from "vite";
import path, { dirname, join } from "path";
import fs from "fs-extra";
import { pathToFileURL } from "url";
var dynamicImport = new Function("m", "return import(m)");
var CLIENT_OUTPUT = "build";
async function buildRpress(root, rpressToPathMap) {
  const rpressInjectCode = `
  ${Object.entries(rpressToPathMap).map(([rpressName, rpressPath]) => {
    return `
      import { ${rpressName} } from '${rpressPath}';
      `;
  }).join("")}
  window.RPRESS = { ${Object.keys(rpressToPathMap).join(", ")} };
  window.RPRESS_PROPS = JSON.parse(
    document.getElementById('rpress-props').textContent
  );
  `;
  console.log("rpressInjectCode:  " + rpressInjectCode);
  const injectId = "rpress:inject";
  return viteBuild({
    mode: "production",
    esbuild: {
      jsx: "automatic"
    },
    build: {
      // 输出目录
      outDir: path.join(root, ".temp"),
      rollupOptions: {
        input: injectId,
        external: EXTERNALS
      }
    },
    plugins: [
      // 重点插件，用来加载我们拼接的 rpress 注册模块的代码
      // https://segmentfault.com/a/1190000043830025#item-3-4
      {
        name: "rpress:inject",
        enforce: "post",
        // rpress:inject../../components/Aside/index!!RPRESS!!D:/font/mydemo/ReactPress/src/theme-default/Layout/DocLayout/index.tsx
        async resolveId(id) {
          if (id.includes(MASK_SPLITTER)) {
            const [originId, importer] = id.split(MASK_SPLITTER);
            const resp = await this.resolve(originId, importer, {
              skipSelf: true
            });
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
        generateBundle(_, bundle2) {
          for (const name in bundle2) {
            if (bundle2[name].type === "asset") {
              delete bundle2[name];
            }
          }
        }
      }
    ]
  });
}
async function renderPage(render, root, clientBundle, routes) {
  console.log("Rendering page in server side...");
  fs.existsSync(join(root, ".temp")) && await fs.remove(join(root, ".temp"));
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
  await Promise.all(
    [
      ...routes,
      {
        path: "/404"
      }
    ].map(async (route) => {
      const routePath = route.path;
      const helmetContext = {
        context: {}
      };
      console.log(routePath);
      const {
        appHtml,
        rpressProps = [],
        rpressToPathMap
      } = await render(routePath, helmetContext.context);
      const styleAssets = clientBundle.output.filter(
        (chunk) => chunk.type === "asset" && chunk.fileName.endsWith(".css")
      );
      const rpressBundle = await buildRpress(root, rpressToPathMap);
      const rpressCode = rpressBundle.output[0].code;
      const { helmet } = helmetContext.context;
      const normalizeVendorFilename = (fileName2) => fileName2.replace(/\//g, "_") + ".js";
      const lastIndex = routePath.lastIndexOf("/");
      let flag = "";
      if (lastIndex > 0 && lastIndex < routePath.length - 1) {
        flag = ".";
      }
      const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="referrer" content="no-referrer" />
    <link rel="shortcut icon" href=".${flag}/rpress.png" type="image/x-icon">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    ${helmet?.title?.toString() || ""}
    ${helmet?.meta?.toString() || ""}
    ${helmet?.link?.toString() || ""}
    ${helmet?.style?.toString() || ""}
    <meta name="description" content="xxx">
    ${styleAssets.map((item) => `<link rel="stylesheet" href="/${item.fileName}">`).join("\n")}
    <script type="importmap">
      {
        "imports": {
          ${EXTERNALS.map(
        (name) => `"${name}": "/${normalizeVendorFilename(name)}"`
      ).join(",")}
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
      const fileName = routePath.endsWith("/") ? `${routePath}index.html` : `${routePath}.html`;
      await fs.ensureDir(join(root, CLIENT_OUTPUT, dirname(fileName)));
      await fs.writeFile(join(root, CLIENT_OUTPUT, fileName), html);
    })
  );
  console.log("Rendering page finished");
}
async function build(root = process.cwd(), config) {
  const clientBundle = await bundle(root, config);
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
        plugins: await createVitePlugins(config, void 0, isServer, false),
        ssr: {
          // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
          noExternal: ["react-router-dom"]
        },
        build: {
          ssr: isServer,
          // 输出产物目录
          outDir: isServer ? join(root, ".temp") : join(root, CLIENT_OUTPUT),
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? "cjs" : "esm"
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
    await serverBuild();
    const clientBundle = await clientBuild();
    const publicDir = join(root, "public");
    if (fs.pathExistsSync(publicDir)) {
      await fs.copy(publicDir, join(root, CLIENT_OUTPUT));
    }
    await fs.copy(join(PACKET_ROOT, "vendors"), join(root, CLIENT_OUTPUT));
    spanner.stop();
    return clientBundle;
  } catch (err) {
    console.log(err);
  }
}

// src/node/preview.ts
import { resolve } from "path";
import fs2 from "fs-extra";
import sirv from "sirv";
var dynamicImport2 = new Function("m", "return import(m)");
var DEFAULT_PORT = 4173;
async function preview(root, { port }) {
  const config = await resolveConfig(root, "serve", "production");
  const listenPort = port ?? DEFAULT_PORT;
  const outputDir = resolve(root, "build");
  const { default: express } = await dynamicImport2("express");
  const notFoundPage = fs2.readFileSync(resolve(outputDir, "404.html"), "utf-8");
  const app = express();
  const serve = sirv(outputDir, {
    etag: true,
    maxAge: 31536e3,
    immutable: true,
    setHeaders(res, pathname) {
      if (pathname.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    }
  });
  app.use(serve);
  app.use("*", function(req, res) {
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

// src/node/cli.ts
import fs3 from "fs-extra";
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
    root = resolve2(root);
    fs3.existsSync(join2(root, "build")) && await fs3.remove(join2(root, "build"));
    fs3.existsSync(join2(root, ".temp")) && await fs3.remove(join2(root, ".temp"));
    const config = await resolveConfig(root, "build", "production");
    await build(root, config);
  } catch (err) {
    console.log(err);
  }
});
cli.command("preview [root]", "preview production build").option("--port <port>", "port to use for preview server").action(async (root, { port }) => {
  try {
    root = resolve2(root);
    await preview(root, { port });
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
