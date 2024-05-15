import { describe, expect, test } from 'vitest';
import babelPluginRpress from '../../../node/babel-plugin-rpress';
import { TransformOptions, transformAsync } from '@babel/core';
import os from 'os';
import { MASK_SPLITTER } from '../../../node/constant/index';

const isWindows = os.platform() === 'win32';

describe('babel-plugin-rpress', () => {
  // import Aside from "../Comp/index"
  const RPRESS_PATH = '../Comp/index';
  const prefix = isWindows ? 'C:' : '';
  const IMPORTED_PATH = prefix + '/User/project/test.tsx';
  const babelOptions: TransformOptions = {
    filename: IMPORTED_PATH,
    presets: ['@babel/preset-react'],
    plugins: [babelPluginRpress]
  };
  test('Should compile jsx identifier', async () => {
    const code = `import Aside from '${RPRESS_PATH}'; export default function App() { return <Aside __rpress />; }`;

    const result = await transformAsync(code, babelOptions);

    // .toContain(
    //   `__island: "${RPRESS_PATH}${MASK_SPLITTER}${IMPORTED_PATH}"`
    // )
    expect(result?.code).toMatchInlineSnapshot(`
          "import Aside from '../Comp/index';
          export default function App() {
            return /*#__PURE__*/React.createElement(Aside, {
              __rpress: \\"../Comp/index!!RPRESS!!C:/User/project/test.tsx\\"
            });
          }"
        `);
  });

  test('Should compile jsx member expression', async () => {
    const code = `import A from '${RPRESS_PATH}'; export default function App() { return <A.B __rpress />; }`;

    const result = await transformAsync(code, babelOptions);

    /**
         * .toContain(
          `__island: "${RPRESS_PATH}${MASK_SPLITTER}${IMPORTED_PATH}"`
        );
         */
    expect(result?.code).toMatchInlineSnapshot(`
          "import A from '../Comp/index';
          export default function App() {
            return /*#__PURE__*/React.createElement(A.B, {
              __rpress: \\"../Comp/index!!RPRESS!!C:/User/project/test.tsx\\"
            });
          }"
        `);
  });
});
