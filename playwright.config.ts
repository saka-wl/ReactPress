import type { PlaywrightTestConfig } from '@playwright/test';
// import { PORT } from './src/node/constant';

// 1. 创建测试项目
// 2. 启动测试项目
// 3. 开启无头浏览器进行访问

const config: PlaywrightTestConfig = {
  testDir: './e2e', // 测试文件存放目录
  timeout: 50000, // 超时时间
  webServer: {
    url: 'http://localhost:' + '5173',
    command: 'pnpm prepare:e2e'
  },
  use: {
    headless: true
  }
};

export default config;
