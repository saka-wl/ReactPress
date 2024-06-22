import { usePageData } from '@runtime';
import { HomeFeature } from '../../components/HomeFeature';
import { HomeHero } from '../../components/HomeHero';
import { useState, useEffect } from 'react';

export function HomeLayout() {
  const { frontmatter } = usePageData();
  const [dyFrontmatter, setDyFrontmatter] = useState(frontmatter);

  useEffect(() => {
    if (import.meta.env.DEV && import.meta.hot) {
      import.meta.hot.on('mdx-change', ({ filePath }: { filePath: string }) => {
        const origin = window.location.origin;
        const path =
          origin +
          filePath.slice(filePath.indexOf('ReactPress') + 'ReactPress'.length);
        // .toString().substring(0, 10) + '000'
        import(/* @vite-ignore */ `${path}?import&t=${Date.now()}`).then(
          (module) => {
            setDyFrontmatter(module.frontmatter);
          }
        );
      });
    }
  });

  return (
    <div>
      <HomeHero hero={dyFrontmatter.hero} />
      <HomeFeature features={dyFrontmatter.features} />
    </div>
  );
}
