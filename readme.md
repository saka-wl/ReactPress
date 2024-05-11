## 2024-5-10
整理`1-12`知识点
程序的入口是`cli.ts`，有两种命令可以使用：`rpress dev [root]`与`rpress dev [root]`
先讲讲`rpress dev [root]`，这是用来预览程序的，下面是实现方式：

1. 先通过`cac`来识别`rpress dev [root]`命令，可以获取到`[root]`路径，然后通过`vite`的`createServer`方法来创建服务即可运行
2. 在`createServer`中，可以放入几个插件（`pluginIndexHtml`，`pluginReact`，`pluginConfig`）
    - `pluginIndexHtml`中，会获取`template.html`中的`index.html`模板，并且直接引入`client-entry`入口文件内容
    - `pluginReact`能够解析`react`内容，也就是为何引入的入口文件内容是`react`代码但会被解析出来的原因
    - `pluginConfig`能够读取用户写的配置文件和当配置修改时热更新重启服务
        - 配置是指用户自己配置的`defineConfig`，能够传给网页中；
        - 那么如何获取到用户配置文件呢？通过`vite` 的`loadConfigFromFile`方法来获取文件内容
        - 那么如何来解决配置文件更新时，重启服务呢？早在`cli.ts`入口文件中就加入了`restart`的方法，然后一直透传到配置文件模块，最后在`handleHotUpdate`钩子处来判断是否重启服
3. 我们也在程序中实现了约定式路由，使用方法是先通过路由标签来包裹`<App />`，然后在`runtime`文件夹下面做一个配置（有哪些路由），最后再在`docs`文件夹中书写详细的路由

然后讲讲`rpress dev [root]`的实现，用来打包程序的，下面是实现方式：

1. 先通过`cac`来识别`rpress build [root]`命令，可以获取到`[root]`路径
2. 然后通过`vite`的`build`方法来打包`client`和`server`端，其中`server`端的数据打包放在`.temp`文件夹中；`client`端打包放在`build`文件夹中
   - 在`client`端中使用了`react`的`render`函数来打包`html`数据，然后将打包完成的数据放在`<div id="root">`中
   - 在`client`端中使用了`vite`中的`build`方法来打包`js`数据，然后打包完成之后放在`assets`文件夹中，以及会在`indedx.html`中的`<script src="/..." type="module"`来引用















































