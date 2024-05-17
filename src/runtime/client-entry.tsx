import { createRoot, hydrateRoot } from 'react-dom/client';
import { App, initPageData } from './App';
import { BrowserRouter } from 'react-router-dom';
import { DataContext } from './hooks';
import { checkTheTheme } from '../theme-default/logic/toggleAppearance';
import { ComponentType } from 'react';

declare global {
  interface Window {
    RPRESS: Record<string, ComponentType<unknown>>;
    RPRESS_PROPS: unknown[];
  }
}

// 将应用程序挂载到一个 DOM 元素上
async function renderInBrowser() {
  const containerEl = document.getElementById('root');
  const pageData = await initPageData(location.pathname);
  checkTheTheme();
  createRoot(containerEl).render(
    <DataContext.Provider value={pageData}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DataContext.Provider>
  );
  if (!import.meta.env.DEV) {
    // 生产环境下的 Partial Hydration
    const rpresss = document.querySelectorAll('[__rpress]');
    if (rpresss.length === 0) {
      return;
    }
    for (const rpress of rpresss) {
      // Aside:0
      const [id, index] = rpress.getAttribute('__rpress').split(':');
      const Element = window.RPRESS[id] as ComponentType<unknown>;
      hydrateRoot(rpress, <Element {...window.RPRESS_PROPS[index]} />);
    }
  }
}

renderInBrowser();
