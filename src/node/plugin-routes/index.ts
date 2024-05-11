import { Plugin } from 'vite';
import { RouteService } from './RouteService';
import { PACKET_ROOT } from 'node/constant';
import { join } from 'path';

interface PluginOption {
  root: string;
}

export const CONVENTIONAL_ROUTE_ID = 'rpress:routes';

export function pluginRoutes(options: PluginOption): Plugin {
  const routerService = new RouteService(options.root);
  return {
    name: 'rpress:routes',
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
        return routerService.generateRoutesCode();
      }
    }
    // config() {
    //     return {
    //       root: PACKET_ROOT,
    //       resolve: {
    //         alias: {
    //           'rpress:routes': join(PACKET_ROOT, 'src', 'node', 'index.ts')
    //         }
    //       }
    //     };
    //   },
  };
}
