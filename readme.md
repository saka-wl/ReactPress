首先拉去到我们的项目

> [https://github.com/saka-wl/ReactPress](https://github.com/saka-wl/ReactPress)

注意，我们的node版本使用的是`18.14.2`

1. `npm i pnpm`下载`pnpm`管理包
2. `pnpm i`下载依赖
3. 使用`npm link --force`将`cac`脚本链接到全局

接下来，我们可以新建一个文件夹，在文件夹下

1. 先写配置文件`config.ts`，下面是配置是格式

```typescript
import { defineConfig } from "../dist"

export default defineConfig({
    'description': "",
    'themeConfig': {
        'nav': [
            {
                text: "主页",
                link: "/"
            },
            {
                text: "指南",
                link: "/guide/"
            },
            {
                text: "实现原理",
                link: "/theory"
            }
        ],
        'sidebar': {
            '/theory': [
                {
                    text: 'Rpress架构',
                    items: [
                        {
                            text: "搭建脚手架",
                            link: "/theory/theory_01_build"
                        }
                    ]
                },
                {
                    text: '获取路由数据',
                    items: [
                        {
                            text: "关于路由",
                            link: "/theory/theory_07_route"
                        },
                        {
                            text: "关于用户自定义配置",
                            link: "/theory/theory_08_config"
                        }
                    ]
                }
            ],
            '/guide': [...]
        },
    },
    'title': 'SAKA_WL',
    'vite': {}
})
```

2. 处理路由页面

配置完成以后，我们就需要创建相应的路由页面
首先是`home`页面（`index.mdx`），里面书写了一些主要元信息，我们的应用可以根据元信息来渲染页面

```markdown
---
pageType: home

hero:
  name: Rpress
  text: 基于 Vite + MDX 语法的静态站点生成器
  tagline: 简单、强大、高性能的现代化 SSG 方案
  image:
    src: /rpress.png
    alt: Rpress
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/getting-started
    - theme: alt
      text: GitHub 地址
      link: https://github.com/saka-wl/reactpress

features:
  - title: 'Vite: 极速的开发响应速度'
    details: 基于 Vite 构建，开发时的响应速度极快，即时的热更新，带给你极致的开发体验。
    icon: 🚀
  - title: 'MDX: Markdown & React 组件来写内容'
    details: MDX 是一种强大的方式来写内容。你可以在 Markdown 中使用 React 组件。
    icon: 📦
  - title: '孤岛架构: 更高的生产性能'
    details: 采用 Rpress 架构，意味着更少的 JavaScript 代码、局部 hydration， 从而带来更好的首屏性能。
    icon: ✨
  - title: '功能丰富: 一站式解决方案'
    details: 对全文搜索、国际化等常见功能可以做到开箱即用。
    icon: 🛠️
  - title: 'TypeScript: 优秀的类型支持'
    details: 使用 TypeScript 编写，提供了优秀的类型支持，让你的开发更加顺畅。
    icon: 🔑
  - title: '扩展性强: 提供多种自定义能力'
    details: 通过其扩展机制，你可以轻松的扩展 Rpress 的主题 UI 和构建能力。
    icon: 🎨
---
```

然后我们就需要对应配置的路由书写相应的路由页面（可以是`jsx`或者`mdx`类型）
![image.png](https://cdn.nlark.com/yuque/0/2024/png/34286503/1717486262391-f090980e-66d8-41de-8802-0c8f81bdc88b.png#averageHue=%2325282d&clientId=u209c4f0f-8b64-4&from=paste&height=381&id=u6d5c6126&originHeight=572&originWidth=383&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=41584&status=done&style=none&taskId=u3dd8e9e7-2b96-4ed9-9811-bf4e52d9ad4&title=&width=255.33333333333334)

3. 处理公共资源

我们将一些需要引用的图片放在`public`文件夹里面

## 预览模式

我们完成以上的配置以后就可以通过`rpress dev [root]`来进行预览（`root`为刚刚创建的文件夹名字）
在预览模式中，里面支持文件的热加载

## 打包模式

打包模式首先要运行`pnpm run build:deps`来将一些依赖打包（防止react多依赖打包问题）
然后就可以通过`rpress build [root]`命令来打包
打包完成以后，我们可以通过
