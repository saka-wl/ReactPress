import { VitePluginConfig } from 'unocss/vite';
import { presetAttributify, presetWind, presetIcons } from 'unocss';

const options: VitePluginConfig = {
  /**
   * 属性化功能支持，兼容，接入图标功能
   */
  presets: [presetAttributify(), presetWind({}), presetIcons()]
};

export default options;
