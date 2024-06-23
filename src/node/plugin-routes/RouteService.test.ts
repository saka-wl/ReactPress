import { RouteService } from './RouteService';
import { describe, expect, test } from 'vitest';
import path from 'path';

// describe('RouteService', async () => {
// const testDir = path.join(__dirname, 'fixtures');
// const routeService = new RouteService(testDir);
// await routeService.init();
// test('conventional route by file structure', async () => {
//   const routeMeta = routeService.getRouteMeta().map((item) => ({
//     ...item,
//     absolutePath: item.absolutePath.replace(testDir, 'TEST_DIR')
//   }));
//   expect(routeMeta).toMatchInlineSnapshot(`
//     [
//       {
//         "absolutePath": "D:/font/mydemo/ReactPress/src/node/plugin-routes/fixtures/a.mdx",
//         "routePath": "/a",
//       },
//       {
//         "absolutePath": "D:/font/mydemo/ReactPress/src/node/plugin-routes/fixtures/guide/index.mdx",
//         "routePath": "/guide/",
//       },
//     ]
//   `);
// });
// const res = routeService.generateRoutesCode();
// test('test imported route', async () => {
//   expect(res).toMatchInlineSnapshot(`
//     "
//           import React from 'react';
//           import loadable from '@loadable/component';
//           const Route0 = loadable(() => import('D:/font/mydemo/ReactPress/src/node/plugin-routes/fixtures/a.mdx'));
//     const Route1 = loadable(() => import('D:/font/mydemo/ReactPress/src/node/plugin-routes/fixtures/guide/index.mdx'));
//           export const routes = [
//           { path: '/a', element: React.createElement(Route0) },
//     { path: '/guide/', element: React.createElement(Route1) }
//           ];
//           "
//   `);
// });
// });
