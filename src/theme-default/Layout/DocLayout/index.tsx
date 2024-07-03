import { usePageData, Content } from '@runtime';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/SIderbar/index';
import styles from './index.module.scss';
import { DocFooter } from '../../components/DocFooter/index';
import { Aside } from '../../components/Aside/index';

export function DocLayout() {
  const { siteData, toc: rawToc } = usePageData();
  const sidebarData = siteData.themeConfig?.sidebar || {};
  const { pathname } = useLocation();

  // const [toc, setToc] = useState(rawToc)

  // useEffect(() => {
  //   if (import.meta.env.DEV && import.meta.hot) {
  //     import.meta.hot.on('mdx-change', ({ filePath }: { filePath: string }) => {
  //       const origin = window.location.origin;
  //       const path =
  //         origin +
  //         filePath.slice(filePath.indexOf('ReactPress') + 'ReactPress'.length);

  //       import(/* @vite-ignore */ `${path}?import&t=${Date.now()}`).then(
  //         (module) => {
  //           if (JSON.stringify(toc) !== JSON.stringify(module.toc)) {
  //             setToc(module.toc)
  //           }
  //         }
  //       );
  //     });
  //   }
  // });

  const matchedSidebarKey = Object.keys(sidebarData).find((key) => {
    if (pathname.startsWith(key)) {
      return true;
    }
  });

  const matchedSideBar = sidebarData[matchedSidebarKey] || [];

  return (
    <div>
      <Sidebar sidebarData={matchedSideBar} pathname={pathname} />
      <div className={styles.content} flex="~">
        <div className={styles.docContent}>
          <div className="rpress-doc">
            <Content />
          </div>
          <DocFooter />
        </div>
        <div className={styles.asideContainer}>
          <Aside headers={rawToc} __rpress />
        </div>
      </div>
    </div>
  );
}
