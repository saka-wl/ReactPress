import { Plugin } from 'vite';
import { RouteService } from './RouteService';
import { ReactElement } from 'react';
import { PageModule } from 'shared/types';

interface PluginOption {
  root: string;
  isSSR: boolean;
}

export interface Route {
  path: string;
  element: ReactElement;
  filePath: string;
  preload: () => Promise<PageModule>;
}

export const CONVENTIONAL_ROUTE_ID = 'rpress:routes';

/**
 * 将目标文件夹里面的文件递归生成 字符串形式的路由导出文件
 * @param options
 * @returns
 */
export function pluginRoutes(options: PluginOption): Plugin {
  const routerService = new RouteService(options.root);
  return {
    name: CONVENTIONAL_ROUTE_ID,
    async configResolved() {
      await routerService.init();
    },
    resolveId(id) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return '\0' + id;
      }
    },
    load(id) {
      if (id === '\0' + CONVENTIONAL_ROUTE_ID) {
        /**
         * 得到：
         *  import React from 'react';
            import loadable from "@loadable/component";
            const Route0 = loadable(() => import('D:/font/mydemo/ReactPress/docs/Counter.tsx'));
            const Route1 = loadable(() => import('D:/font/mydemo/ReactPress/docs/guide/a.jsx'));
            export const routes = [
              { path: '/Counter', element: React.createElement(Route0), preload: () => import('D:/font/mydemo/ReactPress/docs/Counter.tsx') },
              { path: '/guide/a', element: React.createElement(Route1), preload: () => import('D:/font/mydemo/ReactPress/docs/guide/a.jsx') },
            ];
         */
        return routerService.generateRoutesCode(options.isSSR || false);
      }
    }
  };
}
