import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/node/cli.ts', './src/node/index.ts', './src/node/dev.ts'],
  bundle: true,
  splitting: true,
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  shims: true,
  // banner: {
  //   js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);'
  // },
  // banner: {
  //   js: 'import { createRequire as createRequire0 } from "module"; const require = createRequire0(import.meta.url);'
  // },
  clean: true
});
