import { createServer as createViteDevServer } from "vite";
import { PORT } from "../constant/index.js"

export async function createDevServer(root: string = process.cwd()) {
  return createViteDevServer({
    root,
    server: {
        port: PORT
    }
  });
}