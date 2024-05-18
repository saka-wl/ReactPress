## ReactPress

`node`是`18.14.2`

`Rpress`大纲
程序的入口是`cli.ts`，有两种命令可以使用：`rpress dev [root]`与`rpress dev [root]`

- 先讲讲`rpress dev [root]`，这是用来预览程序的，下面是实现方式：

1. 先通过`cac`来识别`rpress dev [root]`命令，可以获取到`[root]`路径，然后通过`vite`的`createServer`方法来创建服务即可运行

2. 在`createServer`中，可以放入几个插件（`pluginIndexHtml`，`pluginReact`，`pluginConfig`，`pluginRoutes`）
    - `pluginIndexHtml`中，会获取`template.html`中的`index.html`模板，并且直接引入`client-entry`入口文件内容，`client-entry`里面是一个被`Router`与`Redux`包裹的`App.jsx`
    
        - 先获取所有路由页面类型（`home`，`doc`）与用户在`.mdx`文件中书写的变量数据（通过`createMdxPlugins`插件可以获取数据），通过`Redux`传给所有的子组件，然后根据页面类型来用不同的组件渲染页面
    
    - `pluginReact`能够解析`react`内容，也就是为何引入的入口文件内容是`react`代码但会被解析出来的原因
    
    - `pluginConfig`能够读取用户写的配置文件和当配置修改时热更新重启服务
    
        - 配置是指用户自己配置的`defineConfig`，能够传给网页中；
        - 那么如何获取到用户配置文件呢？通过`vite` 的`loadConfigFromFile`方法来获取文件内容
        - 那么如何来解决配置文件更新时，重启服务呢？早在`cli.ts`入口文件中就加入了`restart`的方法，然后一直透传到配置文件模块，最后在`handleHotUpdate`钩子处来判断是否重启服
    
    - `pluginRoutes`能在开发环境配置路由，通过`RouteService`类来获取用户配置的路由路径和绝对路径，然后再返回路由的`esm`导出信息，最后在`client-entry`入口文件内导入`esm`导出的信息来获取路由配置
    
        - 如何准确确定哪些文件需要路由处理呢？先获取路由的根文件夹，然后使用`FastGlob`库来查找一些目标文件，比如：`['**/*.{js,jsx,ts,tsx,md,mdx}']`的文件
    
    - `createMdxPlugins`，该插件是来将`.md`等文件转换为`html`的代码，插件主要由`@mdx-js/rollup`的`pluginMdx`函数来集成，
    
        分为`remarkPlugins`和`rehypePlugins`插件配置
    
        - `remarkPlugins`中，使用了`remarkPluginGFM`来生成`github`风格的`GFM(Markdown)`；使用了`remarkFrontmatter`来解析`mdx`文档信息；使用了`remarkMdxFrontmatter`来收集元信息；使用了`remarkPluginToc`来处理标题部分
        - `rehypePlugins`中，使用了`rehypePluginSlug`来添加元素的`id`属性；使用了`rehypePluginAutolinkHeadings`来生成锚点信息和跳转链接；使用了`rehypePluginPreWrapper`来添加语言类型标签；使用了`rehypePluginShiki`来添加代码块高亮
    
    - `pluginMdxHMR`中，利用`react-refresh`配置了`.mdx`文件的热更新
    
3. 我们也在程序中实现了约定式路由，使用方法是先通过路由标签来包裹`<App />`，然后在`runtime`文件夹下面做一个配置（有哪些路由），最后再在`docs`文件夹中书写详细的路由

- 然后讲讲`rpress dev [root]`的实现，用来打包程序的，下面是实现方式：

1. 先通过`cac`来识别`rpress build [root]`命令，可以获取到`[root]`路径

2. 然后加入运行上述的插件

3. 接下来就要进行打包操作，分为浏览器端`client-entry`和服务器端`ssr-entry`，服务器端打包的文件只会在服务器进行运行，进行一些浏览器端路由生成等操作，不会上传到浏览器端，等浏览器端文件打包完成，我们完全可以删除服务器端文件

   - 浏览器端打包：我们先从`client-entry`入口进入，然后进行打包，会得到一个`RollupOutput`类型的文件里面包含了浏览器端文件的`js`逻辑代码，我们将这些`js`文件打包在了`assets`文件夹中

     <img src="C:\Users\aywzc\AppData\Roaming\Typora\typora-user-images\image-20240513110154829.png" alt="image-20240513110154829" style="zoom: 80%;" />

   - 服务器端打包：我们先从`ssr-entry`入口进入，然后进行打包，会得到`render`与`routes`（用户自己创建的路由），用来渲染路由文件与确认有哪些路由

   - 接下来会将所有的路由文件依次添加到`html`模板中，包括`html`代码和`js`逻辑，然后生成文件

   ![image-20240513110229087](C:\Users\aywzc\AppData\Roaming\Typora\typora-user-images\image-20240513110229087.png)

   













































