"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginIndexHtml = void 0;
const promises_1 = require("fs/promises");
const constant_1 = require("../constant");
function pluginIndexHtml() {
    return {
        name: "rpress:index-html",
        /**
         * 在template.html中加入script标签，可以修改html内容
         * 介绍：https://juejin.cn/post/7210278786592292920#heading-3
         * @param html
         * @returns
         */
        transformIndexHtml(html) {
            return {
                html,
                tags: [
                    {
                        tag: "script",
                        attrs: {
                            type: "module",
                            src: `/@fs/${constant_1.CLIENT_ENTRY_PATH}`
                        },
                        injectTo: "body"
                    }
                ]
            };
        },
        /**
         * 配置服务器
         * @param server
         * @returns
         */
        configureServer(server) {
            return () => {
                server.middlewares.use(async (req, res, next) => {
                    // 1. 读取template.html内容
                    let content = await (0, promises_1.readFile)(constant_1.DEFAULT_TEMPLATE_PATH, "utf-8");
                    // 热更新配置
                    content = await server.transformIndexHtml(req.url, content, req.originalUrl);
                    // 2. 通过整理的res对象响应给浏览器
                    res.setHeader("Content-Type", "text/html");
                    res.end(content);
                });
            };
        }
    };
}
exports.pluginIndexHtml = pluginIndexHtml;
