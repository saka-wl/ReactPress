import fs from "fs-extra";
import path from "path";
import { build } from "esbuild"
import resolve from 'resolve';
import { normalizePath } from "vite";

const PRE_BUNDLE_DIR = 'vendors';

async function preBundle(deps: string[]) {
    const flattenDepMap = {} as Record<string, string>
    deps.map((item) => {
        const flattedName = item.replace(/\//g, '_');
        flattenDepMap[flattedName] = item;
    });
    const outputAbsolutePath = path.join(process.cwd(), PRE_BUNDLE_DIR);
    if (await fs.pathExists(outputAbsolutePath)) {
        await fs.remove(outputAbsolutePath)
    }
    await build({
        entryPoints: flattenDepMap,
        outdir: outputAbsolutePath,
        // 开启打包模式
        bundle: true,
        // 开启压缩
        minify: true,
        // 开启分包
        splitting: true,
        // 模块格式，包括`esm`、`commonjs`和`iife`
        format: 'esm',
        platform: "browser",
        plugins: [
            {
                name: 'pre-bundle',
                /**
                 * 将node的导出模式改为esm的格式（默认导出 + 具名导出）
                 * 如何在依赖包的顶层入口添加esm格式的默认导出和具名导出呢？
                 * 先获取该模块的父模块路径，如果该模块没有父模块路径，那么就代表这是顶层模块了
                 * 是顶层模块就加入 namespace 命名空间，然后在下面的 onLoad 导出的时候导出自定义的内容
                 * @param build 
                 */
                setup(build) {
                    build.onResolve({ filter: /[\w@][^:]/ }, async (args) => {
                        if (!deps.includes(args.path)) {
                            return;
                        }
                        console.log(args.path, args.importer)
                        // 父模块路径，即依赖的入口路径
                        const isEntry = !args.importer;
                        // 获取绝对路径
                        const resolved = resolve.sync(args.path, {
                            basedir: args.importer || process.cwd()
                        });
                        // namepace 命名空间是让其他钩子通过这个命名空间将模块过滤出来
                        return isEntry
                            ? { path: resolved, namespace: 'dep' }
                            : { path: resolved };
                    })

                    build.onLoad({ filter: /.*/, namespace: 'dep' }, async (args) => {
                        const entryPath = normalizePath(args.path);
                        const res = require(entryPath);
                        // 拿出所有的具名导出
                        const specifiers = Object.keys(res);
                        // 导出 ESM 格式的入口代码
                        return {
                            contents: `export { ${specifiers.join(
                                ','
                            )} } from "${entryPath}"; export default require("${entryPath}")`,
                            loader: 'js',
                            // 解析导入路径到文件系统上的实际路径
                            resolveDir: process.cwd()
                        };
                    });

                },
            }
        ]
    })
}

preBundle([
    'react',
    'react-dom',
    'react-dom/client',
    'react/jsx-runtime'
])