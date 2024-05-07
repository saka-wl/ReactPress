"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDevServer = void 0;
const vite_1 = require("vite");
const index_js_1 = require("../constant/index.js");
/**
 * 创建一个vite开发服务器
 * @param root
 * @returns
 */
async function createDevServer(root = process.cwd()) {
    return (0, vite_1.createServer)({
        root,
        server: {
            port: index_js_1.PORT
        }
    });
}
exports.createDevServer = createDevServer;
