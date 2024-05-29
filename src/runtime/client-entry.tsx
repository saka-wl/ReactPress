import { createRoot, hydrateRoot } from 'react-dom/client';
import { App, initPageData } from './App';
import { BrowserRouter } from 'react-router-dom';
import { DataContext } from './hooks';
import { checkTheTheme } from '../theme-default/logic/toggleAppearance';
import { ComponentType } from 'react';
import { HelmetProvider } from 'react-helmet-async';

declare global {
  interface Window {
    RPRESS: Record<string, ComponentType<unknown>>;
    RPRESS_PROPS: unknown[];
  }
}

// 将应用程序挂载到一个 DOM 元素上
// 在浏览器运行
async function renderInBrowser() {
  // !import.meta.env.DEV
  if (!import.meta.env.DEV) {
    const rpresss = document.querySelectorAll('[__rpress]');
    checkTheTheme();
    if (rpresss.length === 0) {
      return;
    }
    for (const rpress of rpresss) {
      // Aside:0
      const [id, index] = rpress.getAttribute('__rpress').split(':');
      const Element = window.RPRESS[id] as ComponentType<unknown>;
      // 生产环境下的 可交互组件进行事件绑定
      // hydrate 会在渲染的过程中，不创建 html 标签，而是直接关联已有的。这样就避免了没必要的渲染
      hydrateRoot(rpress, <Element {...window.RPRESS_PROPS[index]} />);
    }
  } else {
    const containerEl = document.getElementById('root');
    const pageData = await initPageData(location.pathname);
    checkTheTheme();
    createRoot(containerEl).render(
      <HelmetProvider>
        <DataContext.Provider value={pageData}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DataContext.Provider>
      </HelmetProvider>
    );
  }

  // if (import.meta.env.DEV) {
  // const containerEl = document.getElementById('root');
  // const pageData = await initPageData(location.pathname);
  // checkTheTheme();
  // createRoot(containerEl).render(
  //   <HelmetProvider>
  //     <DataContext.Provider value={pageData}>
  //       <BrowserRouter>
  //         <App />
  //       </BrowserRouter>
  //     </DataContext.Provider>
  //   </HelmetProvider>
  // );
  // } else {
  // 生产环境下的 Partial Hydration
  // hydrate 会在渲染的过程中，不创建 html 标签，而是直接关联已有的。这样就避免了没必要的渲染
  /**
   * 1. 先找到需要Hydration渲染的组件
   */
  // const rpresss = document.querySelectorAll('[__rpress]');
  // checkTheTheme();
  // if (rpresss.length === 0) {
  //   return;
  // }
  // for (const rpress of rpresss) {
  //   // Aside:0
  //   const [id, index] = rpress.getAttribute('__rpress').split(':');
  //   const Element = window.RPRESS[id] as ComponentType<unknown>;
  //   hydrateRoot(rpress, <Element {...window.RPRESS_PROPS[index]} />);
  // }
  // }
}

renderInBrowser();
