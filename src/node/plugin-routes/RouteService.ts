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
    /**
     * 快速扫描获取需要转换为路由的文件
     * files = [
        'D:/font/mydemo/ReactPress/docs/Counter.tsx',
        'D:/font/mydemo/ReactPress/docs/guide/a.jsx',
        'D:/font/mydemo/ReactPress/docs/guide/b.jsx',
        'D:/font/mydemo/ReactPress/docs/guide/index.jsx',
        'D:/font/mydemo/ReactPress/docs/index.mdx'
      ]
     */
    const files = FastGlob.sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
      cwd: this.#scanDir,
      absolute: true,
      ignore: ['**/node_modules/**', '**/build/**', 'config.ts']
    }).sort();
    files.forEach((file) => {
      /**
       * docs + index.mdx ===> D:/font/mydemo/ReactPress/docs/index.mdx
       */
      const fileRelativePath = normalizePath(
        path.relative(this.#scanDir, file)
      );
      // 1. 获取路由路径
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
   * 使用 @loadable/component 包中的代码拆分，按需加载代码，避免了下载不需要的代码，减少了初始加载期间所需的代码量
   * 为何不使用React.lazy() ? lazy只适用于client端，服务器渲染不适用
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
