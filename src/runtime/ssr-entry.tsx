import { App } from './App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

/**
 * 服务器端渲染逻辑
 * @returns
 */
export function render(pagePath: string) {
  // renderToString 将 React 树渲染为一个 HTML 字符串
  return renderToString(
    // <StaticRouter> is used to render a React Router web app in node.
    <StaticRouter location={pagePath}>
      <App />
    </StaticRouter>
  );
}

export { routes } from 'rpress:routes';
