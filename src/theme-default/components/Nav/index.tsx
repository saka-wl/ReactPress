import { usePageData } from '@runtime';
import { NavItemWithLink } from 'shared/types';
import style from './index.module.scss';
import { SwitchAppearance } from '../SwitchAppearance';

function MenuItem(item: NavItemWithLink) {
  return (
    <div className="text-sm font-medium mx-3">
      <a href={item.link}>{item.text}</a>
    </div>
  );
}

export function Nav() {
  const { siteData } = usePageData();
  const nav = siteData.themeConfig.nav || [];

  return (
    <header w="full">
      <div
        flex="~"
        items="center"
        justify="between"
        className="px-8 h-14 divider-bottom"
      >
        <div>
          <a
            href="/"
            hover="opacity-60"
            className="w-full h-full text-1rem font-semibold flex items-center"
          >
            Rpress.js
          </a>
        </div>
        <div flex="~">
          <div flex="~">
            {nav.map((item) => (
              <MenuItem {...item} key={item.text}></MenuItem>
            ))}
          </div>
          <div before="menu-item-before" flex="~">
            <SwitchAppearance />
          </div>
          {/* 相关链接 */}
          <div
            className={style.socialLinkIcon}
            ml="2"
            before="menu-item-before"
          >
            <a href="/">
              <div className="i-carbon-logo-github w-5 h-5 fill-current"></div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
