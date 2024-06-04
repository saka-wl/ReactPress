import { resolve } from 'path';
import fs from 'fs-extra';
import { loadConfigFromFile } from 'vite';
import { SiteConfig, ThemeConfig, UserConfig } from 'shared/types';

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

/**
 * 找出root目录下有哪些配置文件
 * @param root
 * @returns
 */
function getUserConfigPath(root: string) {
  try {
    const supportConfigFiles = ['config.ts', 'config.js'];
    const configPath = supportConfigFiles
      .map((file) => resolve(root, file))
      .find(fs.pathExistsSync);
    return configPath;
  } catch (err) {
    console.log('Failed To Find UserConfig Path' + err);
  }
}

/**
 * 获取用户自己书写的配置文件以及地址
 * @param root
 * @param command
 * @param mode
 * @returns
 */
export async function resolveUserConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
): Promise<[string, UserConfig]> {
  // 1. 获取配置文件路径，支持 js，ts 格式
  const configPath = getUserConfigPath(root);
  // 2. 解析配置文件，获取用户自定义解析内容
  const result = await loadConfigFromFile(
    {
      command,
      mode
    },
    configPath,
    root
  );
  if (result) {
    // 这里的 rawConfig 就是用户的配置
    const { config: rawConfig = {} as RawConfig } = result;
    // console.log('rawConfig： ', rawConfig)
    // 三种情况:
    // 1. object
    // 2. promise
    // 3. function
    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig);
    return [configPath, userConfig as UserConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
}

export function resolveSiteData(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || 'Rpress.js',
    description: userConfig.description || 'SSG Framework',
    themeConfig: userConfig.themeConfig || ({} as ThemeConfig),
    vite: userConfig.vite || {}
  };
}

/**
 * 获取用户配置的信息
 * @param root
 * @param command
 * @param mode
 * @returns
 */
export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'production' | 'development'
): Promise<SiteConfig> {
  // 获取用户自定义配置
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);
  const siteConfig: SiteConfig = {
    root,
    configPath,
    siteData: resolveSiteData(userConfig as UserConfig)
  };
  return siteConfig;
}

export function defineConfig(config: UserConfig): UserConfig {
  return config;
}
