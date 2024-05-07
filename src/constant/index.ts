import * as path from "path"

/**
 * 服务运行的端口号
 */
export const PORT: number = 3001

/**
 * 项目根目录
 */
export const PACKET_ROOT = path.join(__dirname, "..", "..")

/**
 * 项目html模板文件路径
 */
export const DEFAULT_TEMPLATE_PATH = path.join(PACKET_ROOT, "template.html")

/**
 * 客户端App.jsx入口文件路径
 */
export const CLIENT_ENTRY_PATH = path.join(
    PACKET_ROOT,
    "src",
    "runtime",
    "client-entry.tsx"
)