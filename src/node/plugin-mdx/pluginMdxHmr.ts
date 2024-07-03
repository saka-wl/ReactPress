import { Plugin } from 'vite';
// import assert from 'assert';
// import { SourceDescription } from 'rollup';
// import babel from "babel-plugin-transform-react-jsx"

export function pluginMdxHMR(): Plugin {
  let viteReactPlugin: Plugin;
  return {
    name: 'vite-plugin-mdx-hmr',
    apply: 'serve',
    // 存储最终解析的配置
    // from https://cn.vitejs.dev/guide/api-plugin#configresolved
    configResolved(config) {
      viteReactPlugin = config.plugins.find(
        (plugin) => plugin.name === 'vite:react-babel'
      ) as Plugin;
    },
    // 添加热更新配置
    // code 为源码
    // 不能单单加入import.meta.hot.accept();
    // 我们还需要在运行时代码中添加`react-refresh`运行时的热更新代码代码
    // 怎么做呢？去看看`@vitejs/plugin-react`源码就会发现一个babel/plugin，这个plugin就是统一处理jsx内容热更新的
    // 我们只需要调用`@vitejs/plugin-react`插件的transform钩子来处理我们的源码，将其转换为热更新的jsx即可
    async transform(code, id, opts) {
      // wrong！无法实现mdx里面的内容热更新，因为边界的解析错误
      //       if (/\.(mdx|md)?$/.test(id)) {
      //         const selfAcceptCode = `import.meta.hot.accept();`;
      //         if (!code?.includes(selfAcceptCode)) {
      //           code += selfAcceptCode
      //         }
      //         return {
      //           code
      //         } as SourceDescription
      //       }

      if (/\.(mdx|md)?$/.test(id)) {
        // Inject babel refresh template code by @vitejs/plugin-react
        // 断言
        const result = await (viteReactPlugin.transform as Function)?.call(
          this,
          code,
          id + '?.jsx',
          opts
        );

        const selfAcceptCode = 'import.meta.hot.accept();';
        if (
          typeof result === 'object' &&
          !result!.code?.includes(selfAcceptCode)
        ) {
          result!.code += selfAcceptCode;
        }
        return result;
      }
    },
    // 热更新配置
    // https://cn.vitejs.dev/guide/api-plugin.html#handlehotupdate
    handleHotUpdate(ctx) {
      if (/\.(mdx|md)?$/.test(ctx.file)) {
        ctx.server.ws.send({
          type: 'custom',
          event: 'mdx-change',
          data: {
            filePath: ctx.file
          }
        });
      }
      return [];
    }
  };
}
