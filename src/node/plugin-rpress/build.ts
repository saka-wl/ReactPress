
import { InlineConfig, build as viteBuild } from "vite"
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from "../constant"
import path = require("path")
import type { RollupOutput } from "rollup"
import * as fs from "fs-extra"

/**
 * 
 * @param render 
 * @param root 
 * @param clientBundle 
 */
export async function renderPage(
    render: () => string,
    root: string,
    clientBundle: RollupOutput
) {
    const appHtml = render()
    const clientChunk = clientBundle.output.find(chunk => chunk.type === "chunk" && chunk.isEntry)
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
    await fs.writeFile(path.join(root, 'build', 'index.html'), html)
    await fs.remove(path.join(root, ".temp"))
}

/**
 * SSG 的核心逻辑
 * @param root 
 */
export async function build(root: string) {
    // 1. bundle client端 + server端
    const [clientBundle, serverBundle] = await bundle(root)
    // 2. 引入server-entry模块
    const serverEntryPath = path.join(root, ".temp", "ssr-entry.js")
    // 3. 服务端渲染，产出html内容
    const { render } = require(serverEntryPath)
    await renderPage(render, root, clientBundle as RollupOutput)
}

/**
 * 完成客户端和服务器端的打包
 * @param root 
 */
export async function bundle(root: string) {
    try {
        console.log("client building + server building ...")
        const resolveViteConfig = (isServer: boolean): InlineConfig => {
            return {
                mode: "production",
                root,
                build: {
                    ssr: isServer,
                    // 输出产物目录
                    outDir: isServer ? ".temp" : 'build',
                    rollupOptions: {
                        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
                        output: {
                            format: isServer ? "cjs" : "esm"
                        }
                    }
                }
            }
        }
        const clientBuild = async () => {
            return viteBuild(resolveViteConfig(false))
        }
        const serverBuild = async () => {
            return viteBuild(resolveViteConfig(true))
        }
        const [clientBundle, serverBundle] = await Promise.all([clientBuild(), serverBuild()])
        return [clientBundle, serverBundle]
    } catch (err) {
        console.log(err)
    }
}