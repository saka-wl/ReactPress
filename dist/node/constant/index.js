"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_ENTRY_PATH = exports.CLIENT_ENTRY_PATH = exports.DEFAULT_TEMPLATE_PATH = exports.PACKET_ROOT = exports.PORT = void 0;
const path = require("path");
/**
 * 服务运行的端口号
 */
exports.PORT = 3001;
/**
 * 项目根目录
 */
exports.PACKET_ROOT = path.join(__dirname, "..", "..", "..");
/**
 * 项目html模板文件路径
 */
exports.DEFAULT_TEMPLATE_PATH = path.join(exports.PACKET_ROOT, "template.html");
/**
 * 客户端入口文件路径
 */
exports.CLIENT_ENTRY_PATH = path.join(exports.PACKET_ROOT, "src", "runtime", "client-entry.tsx");
/**
 * 服务器端入口文件
 */
exports.SERVER_ENTRY_PATH = path.join(exports.PACKET_ROOT, "src", "runtime", "ssr-entry.tsx");
