import { App, initPageData } from './App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { DataContext } from './hooks';
// import { clearRpressData, data } from './jsx-runtime';
import { HelmetProvider } from 'react-helmet-async';

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
export async function render(
  pagePath: string,
  helmetContext: object
): Promise<RenderResult> {
  const pageData = await initPageData(pagePath);
  const { clearRpressData, data } = await import('./jsx-runtime');
  clearRpressData();
  // renderToString 将 React 树渲染为一个 HTML 字符串
  // <StaticRouter> is used to render a React Router web app in node.
  // 通过给定的路由路径pagePath与页面数据pageData来渲染一个特定的页面
  const appHtml = renderToString(
    // 新增 HelmetProvider 参数
    <HelmetProvider context={helmetContext}>
      <DataContext.Provider value={pageData}>
        <StaticRouter location={pagePath}>
          <App />
        </StaticRouter>
      </DataContext.Provider>
    </HelmetProvider>
  );
  // 拿到 rpress 组件相关数据
  /**
   * 
  {
    rpressProps: [ {} ],
    rpressToPathMap: {
      SwitchAppearance: '../SwitchAppearance!!RPRESS!!D:/font/mydemo/ReactPress/src/theme-default/components/Nav/index.tsx'
    }
  }
   */
  const { rpressProps, rpressToPathMap } = data;
  return {
    appHtml,
    rpressProps,
    rpressToPathMap
  };
}

export { routes } from 'rpress:routes';
