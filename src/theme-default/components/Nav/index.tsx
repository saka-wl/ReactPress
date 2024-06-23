import { usePageData } from '@runtime';
import { NavItemWithLink } from 'shared/types';
import styles from './index.module.scss';
import { SwitchAppearance } from '../SwitchAppearance';
import { Search } from '../Search';

function MenuItem({ item }: { item: NavItemWithLink; key: string }) {
  return (
    <div className="text-sm font-medium mx-3">
      <a href={item.link}>{item.text}</a>
    </div>
  );
}

export function Nav() {
  const { siteData } = usePageData();
  const nav = siteData?.themeConfig?.nav || [];
  const githubLink = siteData.github || 'https://github.com';

  return (
    <header fixed="~" pos="t-0 l-0" w="full" z="10">
      <div
        flex="~"
        items="center"
        justify="between"
        className={`h-14 divider-bottom ${styles.nav}`}
      >
        <div>
          <a
            href="/"
            hover="opacity-60"
            className="w-full h-full text-1rem font-semibold flex items-center px-7"
          >
            Rpress.js
          </a>
        </div>
        <div>
          <Search __rpress />
        </div>
        <div flex="~">
          <div flex="~">
            {nav.map((item) => (
              <MenuItem item={item} key={item.text}></MenuItem>
            ))}
          </div>
          <div before="menu-item-before" flex="~">
            <SwitchAppearance __rpress />
          </div>
          {/* 相关链接 */}
          <div
            className={styles.socialLinkIcon}
            ml="1"
            before="menu-item-before"
          >
            <a href={githubLink}>
              <div className="i-carbon-logo-github w-5 h-5 fill-current"></div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
