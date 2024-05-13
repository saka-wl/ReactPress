/**
 * 声明siteData类型
 */
declare module 'rpress:site-data' {
  import type { UserConfig } from 'shared/types';
  const siteData: UserConfig;
  export default siteData;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}