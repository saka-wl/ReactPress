import type { Header } from 'shared/types';
import { useState, useEffect } from 'react';

export function useHeaders(initHeaders: Header[]) {
  const [headers, setHeaders] = useState(initHeaders);
  useEffect(() => {
    if (import.meta.env.DEV) {
      import.meta.hot.on('mdx-change', ({ filePath }: { filePath: string }) => {
        const origin = window.location.origin;
        // const path = `${origin}/${filePath.slice(20)}`
        // http://localhost:3001  D:/font/mydemo/ReactPress/docs/guide/index.mdx
        const path =
          origin +
          filePath.slice(filePath.indexOf('ReactPress') + 'ReactPress'.length);

        import(/* @vite-ignore */ `${path}?import&t=${Date.now()}`).then(
          (module) => {
            console.log(module);
            setHeaders(module.toc);
          }
        );
      });
    }
  });
  return headers;
}
