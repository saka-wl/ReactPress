import { App, initPageData } from './App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { DataContext } from './hooks';
// import { clearRpressData, data } from './jsx-runtime';

export interface RenderResult {
  appHtml: string;
  rpressProps: unknown[];
  rpressToPathMap: Record<string, string>;
}

/**
 * 使用框架的SSR API渲染应用程序
 * 向外提供一个render函数来渲染数据
 * 提供一个路由路径 pagePath，然后获取到对应的路由绝对路径等信息（PageData）
 * @returns
 */
export async function render(pagePath: string): Promise<RenderResult> {
  const pageData = await initPageData(pagePath);
  const { clearRpressData, data } = await import('./jsx-runtime');
  // 拿到 rpress 组件相关数据
  const { rpressProps, rpressToPathMap } = data;
  // renderToString 将 React 树渲染为一个 HTML 字符串
  // <StaticRouter> is used to render a React Router web app in node.
  clearRpressData();
  return {
    appHtml: renderToString(
      <DataContext.Provider value={pageData}>
        <StaticRouter location={pagePath}>
          <App />
        </StaticRouter>
      </DataContext.Provider>
    ),
    rpressProps,
    rpressToPathMap
  };
}

export { routes } from 'rpress:routes';
