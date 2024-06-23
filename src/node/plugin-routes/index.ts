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
        // https://verytoolz.com/blog/62ad4a045c/#:~:text=SSR%EF%BC%9A%40loadable%2Fcomponent%20%E6%8F%90%E4%BE%9B%E4%BA%86%E4%BD%BF%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E6%B8%B2%E6%9F%93%E6%88%90%E4%B8%BA%E5%8F%AF%E8%83%BD%E7%9A%84%E5%AE%8C%E6%95%B4%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%EF%BC%8C%E8%80%8C%20React.lazy%20%E5%9C%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E6%B8%B2%E6%9F%93%E6%96%B9%E9%9D%A2%E4%B8%8D%E6%98%AF%E4%B8%80%E4%B8%AA%E9%80%89%E9%A1%B9%E3%80%82%20%E5%9B%A0%E4%B8%BA%20Suspense,%E5%9C%A8%20Server-Side%20%E4%B8%AD%E4%B8%8D%E5%8F%AF%E7%94%A8%EF%BC%8C%E8%80%8C%20React.lazy%20%E5%8F%AA%E8%83%BD%E4%B8%8E%20Suspense%20%E4%B8%80%E8%B5%B7%E4%BD%BF%E7%94%A8%E3%80%82
        /**
         * 得到：
            import React from 'react';
            const Route0 = React.lazy(() => import('D:/font/mydemo/ReactPress/docs/Counter.tsx'));
            const Route1 = React.lazy(() => import('D:/font/mydemo/ReactPress/docs/guide/a.jsx'));
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
