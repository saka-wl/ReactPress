import { App, initPageData } from './App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { DataContext } from './hooks';
import { clearRpressData } from './jsx-runtime';

/**
 * 服务器端渲染逻辑
 * @returns
 */
export async function render(pagePath: string) {
  const pageData = await initPageData(pagePath);
  // const { clearRpressData } = await import('./jsx-runtime')
  // console.log(pagePath, pageData)
  // renderToString 将 React 树渲染为一个 HTML 字符串
  // <StaticRouter> is used to render a React Router web app in node.
  clearRpressData();
  return renderToString(
    <DataContext.Provider value={pageData}>
      <StaticRouter location={pagePath}>
        <App />
      </StaticRouter>
    </DataContext.Provider>
  );
}

export { routes } from 'rpress:routes';
