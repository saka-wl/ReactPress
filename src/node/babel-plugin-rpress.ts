import { declare } from '@babel/helper-plugin-utils';
import type { Visitor } from '@babel/traverse';
import type { PluginPass, JSXElement, JSXAttribute } from '@babel/core';
import { types as T } from '@babel/core';
import { MASK_SPLITTER } from './constant';
import { normalizePath } from 'vite';

const dynamicImport = new Function('m', 'return import(m)');

export default declare(async (api) => {
  const { default: babel } = await dynamicImport('@babel/core');
  const T = babel.types;
  // console.log(T)
  api.assertVersion(7);

  const visitor: Visitor<PluginPass> = {
    // 核心逻辑实现 <Aside __rpress />
    // <A.B __rpress />
    // JSXOpeningElement 是用于处理 JSX 元素的开始标签的节点类型
    JSXOpeningElement(path, state) {
      // 组件名字 Aside
      const name = path.node.name;
      let bindingName = '';
      if (name.type === 'JSXIdentifier') {
        bindingName = name.name;
      } else if (name.type === 'JSXMemberExpression') {
        let object = name.object;
        // A.B.C
        while (T.isJSXMemberExpression(object)) {
          object = object.object;
        }
        // 取出 A
        bindingName = object.name;
      } else {
        // 其它 type 忽略
        return;
      }
      const binding = path.scope.getBinding(bindingName);
      if (binding?.path?.parent?.type === 'ImportDeclaration') {
        // 定位到 import 语句之后，我们拿到 Island 组件对应的引入路径
        const source = binding.path.parent.source;
        // 然后将 __rpress prop 进行修改
        const attributes = (path.container as JSXElement).openingElement
          .attributes;
        for (let i = 0; i < attributes.length; i++) {
          const name = (attributes[i] as JSXAttribute).name;
          if (name?.name === '__rpress') {
            (attributes[i] as JSXAttribute).value = T.stringLiteral(
              `${source.value}${MASK_SPLITTER}${normalizePath(
                state.filename || ''
              )}`
            );
          }
        }
      }
    }
  };

  return {
    name: 'transform-jsx-rpress',
    visitor
  };
});
