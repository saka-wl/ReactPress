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
 * 路由插件
 * @param options
 * @returns
 */
export function pluginRoutes(options: PluginOption): Plugin {
  const routerService = new RouteService(options.root);
  return {
    name: CONVENTIONAL_ROUTE_ID,
    // 解析vite配置后调用，不可修改，读取配置进行操作
    async configResolved() {
      await routerService.init();
    },
    // 用于命中第三方依赖，执行load加载方法
    resolveId(id) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return '\0' + id;
      }
    },
    // 加载函数，可返回自定义的内容
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
