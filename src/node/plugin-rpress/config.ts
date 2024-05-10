import { Plugin } from 'vite';
import { SiteConfig } from 'shared/types';
import { join, relative } from 'path';
import { PACKET_ROOT } from 'node/constant';

const SITE_DATA_ID = 'rpress:site-data';

/**
 * 注册模块
 * @param config
 * @returns
 */
export function pluginConfig(
  config: SiteConfig,
  restart?: () => Promise<void>
): Plugin {
  return {
    name: SITE_DATA_ID,
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        console.log('\0');
        return '\0' + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    config() {
      return {
        root: PACKET_ROOT,
        resolve: {
          alias: {
            '@runtime': join(PACKET_ROOT, 'src', 'runtime', 'index.ts')
          }
        }
      };
    },
    /**
     * 配置文件热更新，配置文件修改时重新启动服务
     * @param ctx
     */
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [config.configPath.replaceAll('\\', '/')];
      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));
      // console.log(ctx.file, config.configPath, include(ctx.file))
      if (include(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed, restarting server...`
        );
        // 重点: 重启 Dev Server
        await restart();
      }
    }
  };
}
