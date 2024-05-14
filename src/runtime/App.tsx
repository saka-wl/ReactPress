import { matchRoutes } from 'react-router-dom';
import { Layout } from '../theme-default';
import { routes } from 'rpress:routes';
import { Route } from 'node/plugin-routes';
import { PageData } from 'shared/types';
import siteData from 'rpress:site-data';

export async function initPageData(routePath: string): Promise<PageData> {
  const matched = matchRoutes(routes, routePath);
  if (matched) {
    const route = matched[0].route as Route;
    // 获取路由组件编译后的模块内容
    const moduleInfo = await route.preload();
    return {
      pageType: moduleInfo.frontmatter?.pageType ?? 'doc',
      siteData,
      frontmatter: moduleInfo.frontmatter,
      pagePath: routePath
    };
  }
  return {
    pageType: '404',
    siteData,
    pagePath: routePath,
    frontmatter: {}
  };
}

export function App() {
  return <Layout />;
}
