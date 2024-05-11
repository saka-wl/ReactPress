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
      // console.log(id)
      if (id === SITE_DATA_ID) {
        return '\0' + SITE_DATA_ID;
      }
    },
    /**
     * load钩子可拦截文件读取，模块引入读取操作，例如我想拦截某个组件读取，这样写后，对应的组件里面的内容加载时就会被替换成返回的内容
     * 这里就是向网页导出用户配置的信息
     * @param id
     * @returns
     */
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    /**
     * 配置地址别名
     * @returns
     */
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
