import FastGlob from 'fast-glob';
import path from 'path';
import { normalizePath } from 'vite';

interface RouteMeta {
  routePath: string;
  absolutePath: string;
}

/**
 * 获取路由的路由路径与绝对路径
 *  {
        "absolutePath": "D:/font/mydemo/ReactPress/src/node/plugin-routes/fixtures/a.mdx",
        "routePath": "/a",
    }
 */
export class RouteService {
  #scanDir: string;
  #routeData: RouteMeta[] = [];
  constructor(scanDir: string) {
    this.#scanDir = scanDir;
  }
  async init() {
    const files = FastGlob.sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
      cwd: this.#scanDir,
      absolute: true,
      ignore: ['**/node_modules/**', '**/build/**', 'config.ts']
    }).sort();
    // console.log(files);
    files.forEach((file) => {
      const fileRelativePath = normalizePath(
        path.relative(this.#scanDir, file)
      );
      // 1. 路由路径
      const routePath = this.normalizeRoutePath(fileRelativePath);
      // 2. 文件绝对路径
      this.#routeData.push({
        routePath,
        absolutePath: file
      });
    });
  }

  // 获取路由数据，方便测试
  getRouteMeta(): RouteMeta[] {
    return this.#routeData;
  }

  normalizeRoutePath(rawPath: string) {
    const routePath = rawPath.replace(/\.(.*)?$/, '').replace(/index$/, '');
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
  }

  /**
   * 生成esm导出类型的路由
   * @returns
   */
  generateRoutesCode(ssr: boolean) {
    return `
      import React from 'react';
      ${ssr ? '' : 'import loadable from "@loadable/component";'}
      ${this.#routeData
        .map((route, index) => {
          return ssr
            ? `import Route${index} from "${route.absolutePath}";`
            : `const Route${index} = loadable(() => import('${route.absolutePath}'));`;
        })
        .join('\n')}
      export const routes = [
      ${this.#routeData
        .map((route, index) => {
          return `{ path: '${route.routePath}', element: React.createElement(Route${index}), preload: () => import('${route.absolutePath}') }`;
        })
        .join(',\n')}
      ];
      `;
  }
}
