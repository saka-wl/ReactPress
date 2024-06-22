import { Plugin } from 'vite';
import assert from 'assert';

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
    async transform(code, id, opts) {
      // /\.mdx?$/.test(id)
      if (/\.(mdx|md)?$/.test(id)) {
        // Inject babel refresh template code by @vitejs/plugin-react
        // 断言
        assert(typeof viteReactPlugin.transform === 'function');
        const result = await viteReactPlugin.transform?.call(
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
      return null;
    }
  };
}
