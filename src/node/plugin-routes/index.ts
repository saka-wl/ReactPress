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
        return routerService.generateRoutesCode(options.isSSR || false);
      }
    }
  };
}
