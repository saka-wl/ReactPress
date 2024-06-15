[https://juejin.cn/post/7117105818654703653](https://juejin.cn/post/7117105818654703653)
我们在项目中，因为打包react多依赖的问题，我们需要单独将react相关的依赖打包
故，我们使用了esbuild来打包
这里就讲一下里面对一些插件的处理应该如何书写，其他的可以API可以通过Ts来查看文档
写看一下源码
```typescript
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
        plugins: ...
    })
}

preBundle([
    'react',
    'react-dom',
    'react-dom/client',
    'react/jsx-runtime'
])
```
大致上就是将一些依赖重新打包到目标文件夹中
下面来讲一下插件里面干了什么？
下面是插件的源码
```typescript
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
```
在上面的插件书写过程中，我们需要符合esbuild的书写规范
[https://esbuild.github.io/plugins/#using-plugins](https://esbuild.github.io/plugins/#using-plugins)
先来讲讲这几个插件干了什么？
在react的依赖包中，导出的格式为node模式下的导出，这几个插件将node的导出模式改为esm的格式（默认导出 + 具名导出）

然后讲一讲里面的几个钩子函数

- onResolve，这个钩子函数是来处理路径解析的，也就是说，当解析路径的时候会触发该钩子，比如esbuild解析到import ... from ... 时，就会去解析路径；在路径解析的第一个参数中有一个filter属性，顾名思义，就是用来删选符合的路径

那么这个插件中干了什么呢？
在这个插件中，我们找到了依赖包最顶层的入口文件，然后给这个入口文件标记，在下面的onLoad钩子中处理
那么我们应该如何操作呢？
我们先获取该模块的父模块路径，如果该模块没有父模块路径，那么就代表这是顶层模块了，是顶层模块就加入 namespace 命名空间，然后在下面的 onLoad 导出的时候导出自定义的内容；我们在返回数据时，第一个需要放是否要加入namespace，第二个要加上该文件的绝对路径
完成了标记以后，就可以在下面的onLoad中导出esm格式的数据了

- 在onLoad钩子中，他能够返回自定义的内容

在该钩子中，我们先require导入数据，然后再使用esm格式具名导出和默认导出






















