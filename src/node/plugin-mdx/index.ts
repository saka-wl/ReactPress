import { pluginMdxRollup } from './pluginMdxRollup';
import { Plugin } from 'vite';

export async function createMdxPlugins(): Promise<Plugin[]> {
  return [await pluginMdxRollup()];
}
