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
                link: "/guide"
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
                    text: 'Rpress架构',
                    items: [
                        {
                            text: "搭建脚手架",
                            link: "/theory/theory_01_build"
                        },
                        {
                            text: "关于Rpress系统架构",
                            link: "/theory/theory_02_about"
                        },
                        {
                            text: "简单复现 rpress dev",
                            link: "/theory/theory_03_dev"
                        },
                        {
                            text: "简单复现 rpress build",
                            link: "/theory/theory_04_build"
                        },
                        {
                            text: "hydrates组件的思想",
                            link: "/theory/theory_05_hy"
                        },
                        {
                            text: "hydrates组件如何实现",
                            link: "/theory/theory_06_hy_create"
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
                        },
                        {
                            text: '处理docs逻辑',
                            link: '/theory/theory_13_handleDocsScroll'
                        }
                    ]
                },
                {
                    text: "关于热更新",
                    items: [
                        {
                            text: "vite的HMR",
                            link: '/theory/theory_14_viteHMR'
                        },
                        {
                            text: "预览状态下的热更新",
                            link: '/theory/theory_16_devhmr'
                        }
                    ]
                },
                {
                    text: "编译babel",
                    items: [
                        {
                            text: "关于插件@babel_helper-plugin-utils",
                            link: "/theory/theory_19_babel"
                        }
                    ]
                },
                {
                    text: "其他配置",
                    items: [
                        {
                            text: "格式化与测试",
                            link: '/theory/theory_11_formatAndTest'
                        },
                        {
                            text: 'UnoCSS',
                            link: '/theory/theory_12_UnoCSS'
                        },
                        {
                            text: "关于helmet",
                            link: "/theory/theory_15_helmet"
                        },
                        {
                            text: "EsBuild打包",
                            link: "/theory/theory_17_esbuild"
                        },
                        {
                            text: "Rollup打包",
                            link: "/theory/theory_18_rollup_build"
                        }
                    ]
                }
            ],
            '/guide': [
                {
                    text: '教程',
                    items: [
                        {
                            text: '配置我们的Nav导航栏',
                            link: '/guide/guide_01_navbar'
                        },
                        {
                            text: '配置我们的侧边栏',
                            link: '/guide/guide_02_siderbar'
                        }
                    ]
                }
            ]
        },
    },
    'title': 'SAKA_WL',
    'github': 'https://github.com/saka-wl/reactpress',
    'vite': {},
    'algoliasearch_url': 'http://127.0.0.1:5008/searchFileFromLocal'
})