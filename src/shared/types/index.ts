import { UserConfig as ViteConfiguration } from 'vite';
import { ComponentType } from 'react';

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

export type PageType = 'home' | 'doc' | 'custom' | '404';

export interface Feature {
  icon: string;
  title: string;
  details: string;
}

export interface Hero {
  name: string;
  text: string;
  tagline: string;
  image?: {
    src: string;
    alt: string;
  };
  actions: {
    text: string;
    link: string;
    theme: 'brand' | 'alt';
  }[];
}
export interface FrontMatter {
  title?: string;
  description?: string;
  pageType?: PageType;
  siderbar?: boolean;
  outline?: boolean;
  features?: Feature[];
  hero?: Hero;
}

export interface Header {
  id: string;
  text: string;
  depth: number;
}

export interface PageData {
  siteData: UserConfig;
  pagePath: string;
  frontmatter: FrontMatter;
  pageType: PageType;
  toc?: Header[];
}

export interface PageModule {
  default: ComponentType;
  frontmatter?: FrontMatter;
  [key: string]: unknown;
}
