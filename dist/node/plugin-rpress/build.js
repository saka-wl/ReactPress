"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundle = exports.build = exports.renderPage = void 0;
const vite_1 = require("vite");
const constant_1 = require("../constant");
const path = require("path");
const fs = require("fs-extra");
/**
 *
 * @param render
 * @param root
 * @param clientBundle
 */
async function renderPage(render, root, clientBundle) {
    const appHtml = render();
    const clientChunk = clientBundle.output.find(chunk => chunk.type === "chunk" && chunk.isEntry);
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
    await fs.writeFile(path.join(root, 'build', 'index.html'), html);
    await fs.remove(path.join(root, ".temp"));
}
exports.renderPage = renderPage;
/**
 * SSG 的核心逻辑
 * @param root
 */
async function build(root) {
    // 1. bundle client端 + server端
    const [clientBundle, serverBundle] = await bundle(root);
    // 2. 引入server-entry模块
    const serverEntryPath = path.join(root, ".temp", "ssr-entry.js");
    // 3. 服务端渲染，产出html内容
    const { render } = require(serverEntryPath);
    await renderPage(render, root, clientBundle);
}
exports.build = build;
/**
 * 完成客户端和服务器端的打包
 * @param root
 */
async function bundle(root) {
    try {
        console.log("client building + server building ...");
        const resolveViteConfig = (isServer) => {
            return {
                mode: "production",
                root,
                build: {
                    ssr: isServer,
                    // 输出产物目录
                    outDir: isServer ? ".temp" : 'build',
                    rollupOptions: {
                        input: isServer ? constant_1.SERVER_ENTRY_PATH : constant_1.CLIENT_ENTRY_PATH,
                        output: {
                            format: isServer ? "cjs" : "esm"
                        }
                    }
                }
            };
        };
        const clientBuild = async () => {
            return (0, vite_1.build)(resolveViteConfig(false));
        };
        const serverBuild = async () => {
            return (0, vite_1.build)(resolveViteConfig(true));
        };
        const [clientBundle, serverBundle] = await Promise.all([clientBuild(), serverBuild()]);
        return [clientBundle, serverBundle];
    }
    catch (err) {
        console.log(err);
    }
}
exports.bundle = bundle;
