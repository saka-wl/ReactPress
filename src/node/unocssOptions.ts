import { VitePluginConfig } from 'unocss/vite';
import { presetAttributify, presetWind, presetIcons } from 'unocss';

const options: VitePluginConfig = {
  /**
   * 属性化功能支持，兼容，接入图标功能
   */
  presets: [presetAttributify(), presetWind({}), presetIcons()],
  rules: [
    [
      /^divider-(\w+)$/,
      ([, w]) => ({
        [`border-${w}`]: '1px solid var(--rpress-c-divider-light)'
      })
    ],
    [
      'menu-item-before',
      {
        'margin-right': '12px',
        'margin-left': '12px',
        width: '1px',
        height: '24px',
        'background-color': 'var(--rpress-c-divider-light)',
        content: '" "'
      }
    ]
  ],
  shortcuts: {
    'flex-center': 'flex justify-center items-center'
  },
  theme: {
    fontSize: {
      normal: '20px'
    },
    colors: {
      brandLight: 'var(--rpress-c-brand-light)',
      brandDark: 'var(--rpress-c-brand-dark)',
      brand: 'var(--rpress-c-brand)',
      text: {
        1: 'var(--rpress-c-text-1)',
        2: 'var(--rpress-c-text-2)',
        3: 'var(--rpress-c-text-3)',
        4: 'var(--rpress-c-text-4)'
      },
      divider: {
        default: 'var(--rpress-c-divider)',
        light: 'var(--rpress-c-divider-light)',
        dark: 'var(--rpress-c-divider-dark)'
      },
      gray: {
        light: {
          1: 'var(--rpress-c-gray-light-1)',
          2: 'var(--rpress-c-gray-light-2)',
          3: 'var(--rpress-c-gray-light-3)',
          4: 'var(--rpress-c-gray-light-4)'
        }
      },
      bg: {
        default: 'var(--rpress-c-bg)',
        soft: 'var(--rpress-c-bg-soft)',
        mute: 'var(--rpress-c-bg-mute)'
      }
    }
  }
};

export default options;
