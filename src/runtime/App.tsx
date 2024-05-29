import { matchRoutes } from 'react-router-dom';
import { Layout } from '../theme-default';
import { routes } from 'rpress:routes';
import { Route } from 'node/plugin-routes';
import { PageData, UserConfig } from 'shared/types';
import siteData from 'rpress:site-data';

export async function initPageData(routePath: string): Promise<PageData> {
  /** routes:
    export const routes = [
      { path: '/Counter', element: React.createElement(Route0), preload: () => import('D:/font/mydemo/ReactPress/docs/Counter.tsx') },
      { path: '/guide/a', element: React.createElement(Route1), preload: () => import('D:/font/mydemo/ReactPress/docs/guide/a.jsx') },
    ];
 */
  // 匹配相应的路由
  const matched = matchRoutes(routes, routePath);
  if (matched) {
    const route = matched[0].route as Route;
    // 获取路由组件编译后的模块内容
    /**
     *  default: ...
        frontmatter: ...
        toc: [...]
     */
    const moduleInfo = await route.preload();
    // console.log(moduleInfo)
    return {
      pageType: moduleInfo.frontmatter?.pageType ?? 'doc',
      siteData: siteData ?? ({} as UserConfig),
      frontmatter: moduleInfo.frontmatter ?? {},
      pagePath: routePath,
      toc: moduleInfo?.toc ?? [],
      title: moduleInfo.title || 'Rpress'
    };
  }
  return {
    pageType: '404',
    siteData,
    pagePath: routePath,
    frontmatter: {},
    title: '404'
  };
}

export function App() {
  return <Layout />;
}
