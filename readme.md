## 2024-5-10
`Rpress`大纲
程序的入口是`cli.ts`，有两种命令可以使用：`rpress dev [root]`与`rpress dev [root]`

- 先讲讲`rpress dev [root]`，这是用来预览程序的，下面是实现方式：

1. 先通过`cac`来识别`rpress dev [root]`命令，可以获取到`[root]`路径，然后通过`vite`的`createServer`方法来创建服务即可运行

2. 在`createServer`中，可以放入几个插件（`pluginIndexHtml`，`pluginReact`，`pluginConfig`，`pluginRoutes`）
    - `pluginIndexHtml`中，会获取`template.html`中的`index.html`模板，并且直接引入`client-entry`入口文件内容
    
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
    
3. 我们也在程序中实现了约定式路由，使用方法是先通过路由标签来包裹`<App />`，然后在`runtime`文件夹下面做一个配置（有哪些路由），最后再在`docs`文件夹中书写详细的路由

- 然后讲讲`rpress dev [root]`的实现，用来打包程序的，下面是实现方式：

1. 先通过`cac`来识别`rpress build [root]`命令，可以获取到`[root]`路径
2. 然后通过`vite`的`build`方法来打包`client`和`server`端，其中`server`端的数据打包放在`.temp`文件夹中；`client`端打包放在`build`文件夹中
   - 在`client`端中使用了`react`的`render`函数来打包`html`数据，然后将打包完成的数据放在`<div id="root">`中
   - 在`client`端中使用了`vite`中的`build`方法来打包`js`数据，然后打包完成之后放在`assets`文件夹中，以及会在`indedx.html`中的`<script src="/..." type="module"`来引用















































