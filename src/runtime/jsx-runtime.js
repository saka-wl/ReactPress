import * as jsxRuntime from 'react/jsx-runtime';

export const data = {
  // 用来记录 Islands 组件的props数据
  rpressProps: [],
  // 用来记录 Island 组件的路径信息
  rpressToPathMap: {}
};

// 拿到 React 原始的 jsxRuntime 方法，包括 jsx 和 jsxs
// 注: 对于一些静态节点，React 会使用 jsxs 来进行创建，优化渲染性能
const originJsx = jsxRuntime.jsx;
const originJsxs = jsxRuntime.jsxs;

const internalJsx = (jsx, type, props, ...args) => {
  // 如果发现有 __rpress 这个 prop，则视为一个 rpress 组件，记录下来
  if (props && props.__rpress) {
    data.rpressProps.push(props);
    const id = type.name;
    data['rpressToPathMap'][id] = props.__rpress;
    // console.log(props.__rpress)

    delete props.__rpress;
    return jsx('div', {
      __rpress: `${id}:${data.rpressProps.length - 1}`,
      children: jsx(type, props, ...args)
    });
  }
  // 否则走原始的 jsx/jsxs 方法
  return jsx(type, props, ...args);
};

// 下面是我们自定义的 jsx 和 jsxs
export const jsx = (...args) => internalJsx(originJsx, ...args);

export const jsxs = (...args) => internalJsx(originJsxs, ...args);

export const Fragment = jsxRuntime.Fragment;

export const clearRpressData = () => {
  data.rpressProps = [];
  data.rpressToPathMap = {};
};
