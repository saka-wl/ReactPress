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
        format: 'esm',
        platform: "browser",
        plugins: [
            {
                name: 'pre-bundle',
                setup(build) {
                    build.onResolve({ filter: /[\w@][^:]/ }, async (args) => {
                        if (!deps.includes(args.path)) {
                            return;
                        }
                        const isEntry = !args.importer;
                        const resolved = resolve.sync(args.path, {
                            basedir: args.importer || process.cwd()
                        });
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