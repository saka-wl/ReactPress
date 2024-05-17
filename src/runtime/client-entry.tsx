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
  if (!containerEl) {
    throw new Error('root element not found');
  }
  const pageData = await initPageData(location.pathname);
  checkTheTheme();
  createRoot(containerEl).render(
    <DataContext.Provider value={pageData}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DataContext.Provider>
  );
  // if (import.meta.env.DEV) {
  //   const pageData = await initPageData(location.pathname);
  //   checkTheTheme();
  //   createRoot(containerEl).render(
  //     <DataContext.Provider value={pageData}>
  //       <BrowserRouter>
  //         <App />
  //       </BrowserRouter>
  //     </DataContext.Provider>
  //   );
  // }else{
  //   const rpresses = document.querySelectorAll('[__rpress]')
  //   if(rpresses.length === 0) {
  //     return
  //   }
  //   for(const rpress of rpresses) {
  //     // console.log(rpress)
  //     console.log(rpress.getAttribute('__rpress'))
  //     // Aside:0
  //     const [id, index] = rpress.getAttribute('__rpress').split(':')
  //     const Element = window.RPRESS as ComponentType<unknown>
  //     hydrateRoot(rpress, <Element {... window.RPRESS_PROPS[index]}></Element>)
  //   }
  // }
}

renderInBrowser();
