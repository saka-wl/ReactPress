## 用户配置修改导致热更新
也就是说，当用户的自定义配置config.ts修改时，我们就会让程序重新启动，从而实现配置更新
实现思路：
在cac启动服务时，添加一个重启的钩子，透传到插件配置里面
```javascript
const createServer = async () => {
  // 路径  重启服务函数
  const server = await createDevServer(root, async () => {
    await server.close();
    await createServer();
  });
  ...
};
await createServer();
```
然后我们透传到用户自定义配置插件中
```javascript
pluginConfig(config, restart)
```
文件修改时，以用户自定义配置的路径为判断，判断文件是否修改，如果修改那就重启服务
```javascript
export function pluginConfig(
  config: SiteConfig,
  restart?: () => Promise<void>
): Plugin {
  return {
    name: SITE_DATA_ID,
    ...
    /**
     * 配置文件热更新，配置文件修改时重新启动服务
     * @param ctx
     */
    async handleHotUpdate(ctx) {
      // 用户自定义配置的路径
      const customWatchedFiles = [config.configPath.replaceAll('\\', '/')];
      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));
      if (include(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed, restarting server...`
        );
        // 重点: 重启 Dev Server
        await restart();
      }
    }
  };
}

```
## Mdx文件修改时的热更新
看这个之前，可以先看看之前的文章，关于HMR机制
也就是，我们自定义的mdx文件更新时，会导致路由页面相继更新
实现方式：
先谈谈vite的组件更新机制

1. 监听文件变动
2. 构建侧确定热更新的边界模块
3. 浏览器侧执行更新逻辑

最关键的在于第二步和第三步，而Vite使用了import.meta.hot.accept API来实现了这两步
下面讲一下该API的用法

- 直接调用。
```javascript
import.meta.hot.accept()
```

- 传入一个回调函数。
```javascript
import.meta.hot.accept(mod => {
  // ...
})
```

- 传入一个路径数组 + 回调函数。
```javascript
import.meta.hot.accept(['./index.mdx'], (modInfo) => {
  // xxx
})
```
在发生热更新的时候，Vite 只会更新局部的模块，并不会重新编译所有的模块，那么边界模块就显得十分关键了，Vite 找到它之后，只会更新这个边界模块以及它所依赖的模块。
Vite 是如何通过这个 API 确定热更新边界的呢？
对此，大家只需要记住一句话: **谁接受模块的更新，谁就是热更新的边界**
前两种调用方式即**直接调用**或者**传入一个回调**，属于自接受的形式，模块接受自身的更新，当模块内容发生变动时，Vite 会将模块的代码重新执行一遍，如果传入了回调，会将模块的最新信息作为入参，执行回调。
第三中调用方式中，比如:
```javascript
import.meta.hot.accept(['./index.mdx'], (modInfo) => {
  // xxx
})
```
当前模块会接受index.mdx的更新，那么当index.mdx发生变动时，当前模块会成为热更新的边界模块
这是 Vite 底层热更新的机制，虽然能做到模块级别的热更新，但没有办法达到组件级别的粒度，我们还需要做到组件级别的状态保存和恢复，这一点在不同的前端框架会有不同的处理方式。以 React 为例，组件的热更新主要由`@vitejs/plugin-react` 这个插件来进行处理，而这个插件会依赖 `react-refresh`，通过在组件中插入 react-refresh 相关的运行时代码来实现 React 组件的热更新。
值得注意的是，这个插件也会在 React 组件所在的模块中插入`import.meta.hot.accept`的调用语句，当内容发生变动时，将组件的代码重新执行一遍，而由于有 react-refresh 相关的代码存在，组件的状态可以得到保存和恢复，也就实现了组件级别的热更新效果。
那么问题来了：为什么之前的 `index.mdx` 热更新失败了呢？
表面原因是 Vite 将其热更新的边界判断成了父组件的模块，而更深层的原因在于 `@vitejs/plugin-react` 没有在 `index.mdx` 的编译过程中注入 `react-refresh` 运行时代码以及 `import.meta.hot.accept` 调用语句。
`@vitejs/plugin-react` 内部只会为 **React 组件**注入这些代码，而它是如何判断一个模块是否是一个 React 组件的呢？
> 模块所有的导出必须是大写字母开头。

以这个标准来看，`index.mdx` 的模块结果并不符合要求，因为我们之前注入了诸如`frontmatter`、`toc`字段的导出，这些字段并不是以大写字母开头，因此整个模块会跳过 react 插件的处理，不会注入热更新相关的代码。
那么我们如何来解决这个问题呢？
有两个思路:

1. 将所有导出换成大写字母开头，来兼容 react 插件。
2. 编写自定义插件，手动注入热更新相关的代码。

在处理mdx的插件中，添加一个mdx热更新处理的插件pluginMdxHMR()
在下面的插件中，我们在代码babel编译的时候进行处理，如果代码是以.mdx为结尾的，那么我们就在最后加上import.meta.hot.accept()来添加局部热更新
```javascript
export function pluginMdxHMR(): Plugin {
  let viteReactPlugin: Plugin;
  return {
    name: 'vite-plugin-mdx-hmr',
    apply: 'serve',
    configResolved(config) {
      viteReactPlugin = config.plugins.find(
        (plugin) => plugin.name === 'vite:react-babel'
      ) as Plugin;
    },
    // 添加热更新配置
    async transform(code, id, opts) {
      if (/\.mdx?$/.test(id)) {
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
    handleHotUpdate(ctx) {
      if (/\.mdx?/.test(ctx.file)) {
        ctx.server.ws.send({
          type: 'custom',
          event: 'mdx-change',
          data: {
            filePath: ctx.file
          }
        });
      }
    }
  };
}
```
然后在热更新配置中，我们定义了一个热更新的事件，他会派发到react组件中，下面是对更新事件监听的自定义Hook
```js
export function useHeaders(initHeaders: Header[]) {
  const [headers, setHeaders] = useState(initHeaders);
  useEffect(() => {
    if (import.meta.env.DEV) {
      import.meta.hot.on('mdx-change', ({ filePath }: { filePath: string }) => {
        const origin = window.location.origin;
        const path =
          origin +
          filePath.slice(filePath.indexOf('ReactPress') + 'ReactPress'.length);

        import(/* @vite-ignore */ `${path}?import&t=${Date.now()}`).then(
          (module) => {
            setHeaders(module.toc);
          }
        );
      });
    }
  });
  return headers;
}
```
我们的更新过程是采用import(...+时间戳)的方式来更新
























