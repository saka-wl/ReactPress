import { createServer as createViteDevServer } from "vite";
import { PORT } from "../constant/index.js"

/**
 * 创建一个vite开发服务器
 * @param root 
 * @returns 
 */
export async function createDevServer(root: string = process.cwd()) {
  return createViteDevServer({
    root,
    server: {
        port: PORT
    }
  });
}