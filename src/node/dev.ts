import { createServer as createViteDevServer } from "vite";

export async function createDevServer(root: string = process.cwd()) {
  return createViteDevServer({
    root,
  });
}