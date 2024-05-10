import { UserConfig as ViteConfiguration } from 'vite';

export type NavItemWithLink = {
  text: string;
  link: string;
};

export interface SiderItem {
  text: string;
  link: string;
}

export interface SiderBarGroup {
  text: string;
  items: SiderItem[];
}

export type SiderBar = {
  [path: string]: SiderBarGroup[];
};

export interface Footer {
  message: string;
}

export interface ThemeConfig {
  nav: NavItemWithLink[];
  sideBar?: SiderBar;
  foot?: Footer;
}

export interface UserConfig {
  title: string;
  description: string;
  themeConfig: ThemeConfig;
  vite: ViteConfiguration;
}

export interface SiteConfig {
  root: string;
  configPath: string;
  siteData: UserConfig;
}
