import { hydrateRoot } from 'react-dom/client';
import { checkTheTheme } from '../theme-default/logic/toggleAppearance';
import { ComponentType } from 'react';

declare global {
  interface Window {
    RPRESS: Record<string, ComponentType<unknown>>;
    RPRESS_PROPS: unknown[];
  }
}

// 将应用程序挂载到一个 DOM 元素上
// 在浏览器运行
async function renderInBrowser() {
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
}

renderInBrowser();
