import { App } from './App';
import { renderToString } from 'react-dom/server';

/**
 * 服务器端渲染逻辑
 * @returns
 */
export function render() {
  return renderToString(<App />);
}
