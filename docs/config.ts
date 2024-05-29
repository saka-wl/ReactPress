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
        // 新增 sidebar 的内容
        'sidebar': {
            '/theory': [
                {
                    text: '实现细节',
                    items: [
                        {
                            text: "关于",
                            link: "/theory/a"
                        },
                        {
                            text: "关于2",
                            link: "/theory/b"
                        }
                    ]
                }
            ],
            '/guide': [
                {
                    text: '教程',
                    items: [
                        {
                            text: '快速上手',
                            link: '/guide/a'
                        },
                        {
                            text: '如何安装',
                            link: '/guide/b'
                        },
                        {
                            text: "注意事项",
                            link: "/guide/c"
                        }
                    ]
                }
            ]
        },
    },
    'title': 'SAKA_WL',
    'vite': {}
})