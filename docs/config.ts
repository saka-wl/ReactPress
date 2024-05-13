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
                link: "/guide/a"
            }
        ]
    },
    'title': 'SAKA_WL',
    'vite': {}
})