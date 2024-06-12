对于侧边栏的配置，我们也是在`config.ts`中进行配置 
```typescript
import { defineConfig } from "../dist"

export default defineConfig({
    'description': "",
    'themeConfig': {
        'nav': [
            {
                text: "实现原理",
                link: "/theory"
            }
        ],
        // 新增 sidebar 的内容
        'sidebar': {
            '/theory': [
                {
                    text: 'Rpress架构',
                    items: [
                        {
                            text: "搭建脚手架",
                            link: "/theory/theory_01_build"
                        },
                        {
                            text: "关于Rpress系统架构",
                            link: "/theory/theory_02_about"
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
                },
                {
                    text: '获取tocs数据',
                    items: [
                        {
                            text: "Mdx文件处理",
                            link: "/theory/theory_09_mdxHandle"
                        },
                        {
                            text: "获取Tocs",
                            link: "/theory/theory_10_getTocs"
                        }
                    ]
                }
            ]
        },
    },
    'title': 'SAKA_WL',
    'vite': {}
})
```
我们在下面的siderbar配置中，可以对应的配置一些侧边栏的路由
下面是效果图：
![image.png](https://cdn.nlark.com/yuque/0/2024/png/34286503/1717488658489-84539b29-4028-4791-94f1-9609d31d3f62.png#averageHue=%23f6f5f4&clientId=u8f5206ca-974b-4&from=paste&height=463&id=uaac0b9b6&originHeight=695&originWidth=385&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=38373&status=done&style=none&taskId=ufd6fe72b-caf3-4d2f-9dd5-05f72aa7885&title=&width=256.6666666666667)
