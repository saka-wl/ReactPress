import { join } from 'path';

/**
 * 服务运行的端口号
 */
export const PORT = 3001;

/**
 * 项目根目录
 */
export const PACKET_ROOT = join(__dirname, '..');

/**
 * 项目html模板文件路径
 */
export const DEFAULT_TEMPLATE_PATH = join(PACKET_ROOT, 'template.html');

/**
 * 客户端入口文件路径
 *   PACKET_ROOT,
  'src',
  'runtime',
  'client-entry.tsx'
 */
export const CLIENT_ENTRY_PATH = join(
  PACKET_ROOT,
  'src',
  'runtime',
  'client-entry.tsx'
);

/**
 * 服务器端入口文件
 */
export const SERVER_ENTRY_PATH = join(
  PACKET_ROOT,
  'src',
  'runtime',
  'ssr-entry.tsx'
);

/**
 * 路径分隔符
 */
export const MASK_SPLITTER = '!!RPRESS!!';

/**
 * 排除的依赖
 */
export const EXTERNALS = [
  'react',
  'react-dom',
  'react-dom/client',
  'react/jsx-runtime'
];
