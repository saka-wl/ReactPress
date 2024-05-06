"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDevServer = void 0;
const vite_1 = require("vite");
const index_js_1 = require("../constant/index.js");
async function createDevServer(root = process.cwd()) {
    return (0, vite_1.createServer)({
        root,
        server: {
            port: index_js_1.PORT
        }
    });
}
exports.createDevServer = createDevServer;
