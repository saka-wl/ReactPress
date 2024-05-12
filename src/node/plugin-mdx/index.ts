// import { pluginMdxHMR } from './pluginMdxHmr';
// import { createMdxTransformPlugin } from './pluginMdxHmr';
import { pluginMdxRollup } from './pluginMdxRollup';
import { Plugin } from 'vite';
import { pluginMdxHMR } from './pluginMdxHmr';

/**
 * vite 热更新机制
 * 对于一个模块来说，谁接受他的更新谁就是热更新的边界
 * 1. 监听文件变动，在vite文件内部完成
 * 2. 定位到热更新边界模块
 * 3. 执行更新逻辑
 * import.meta.hot.accept()  -> 2,3
 *
 * 热更新逻辑，Vue与React
 * react-refresh
 * 哪些组件会被react-refresh所捕获呢？
 * 大写字母开头的组件
 * 我们可以手动编写插件来让mdx文件加入热更新
 *
 * @returns
 */
export async function createMdxPlugins(): Promise<Plugin[]> {
  return [await pluginMdxRollup(), pluginMdxHMR()];
}
