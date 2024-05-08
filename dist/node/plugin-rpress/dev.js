"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDevServer = void 0;
const vite_1 = require("vite");
const index_js_1 = require("../constant/index.js");
const indexHtml_js_1 = require("./indexHtml.js");
/**
 * pluginReact 为局部热更新
 */
const plugin_react_1 = require("@vitejs/plugin-react");
/**
 * 创建一个vite开发服务器
 * @param root
 * @returns
 */
async function createDevServer(root = process.cwd()) {
    return (0, vite_1.createServer)({
        root,
        plugins: [(0, indexHtml_js_1.pluginIndexHtml)(), (0, plugin_react_1.default)()],
        server: {
            port: index_js_1.PORT
        }
    });
}
exports.createDevServer = createDevServer;
