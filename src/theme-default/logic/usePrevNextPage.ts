import { usePageData } from '@runtime';
import { useLocation } from 'react-router-dom';
import { SidebarItem } from 'shared/types';

export function usePrevNextPage() {
  const { pathname } = useLocation();
  const { siteData } = usePageData();
  const sidebar = siteData.themeConfig?.sidebar || {};
  const flattenTitles: SidebarItem[] = [];

  const isAllowed = (key: string, pathname: string): boolean => {
    console.log(key, pathname);
    let keyVal = '',
      pathnameVal = '';
    let fromIndex = -1;
    let toLen = -1;
    for (let i = 0; i < key.length; i++) {
      if (fromIndex === -1 && key[i] === '/') {
        fromIndex = i + 1;
      } else if (toLen === -1 && key[i] === '/') {
        toLen = i;
        break;
      }
    }
    if (toLen === -1) {
      toLen = key.length;
    }
    keyVal = key.substring(fromIndex, toLen);
    fromIndex = -1;
    toLen = -1;
    for (let i = 0; i < pathname.length; i++) {
      if (fromIndex === -1 && pathname[i] === '/') {
        fromIndex = i + 1;
      } else if (toLen === -1 && pathname[i] === '/') {
        toLen = i;
        break;
      }
    }
    if (toLen === -1) {
      toLen = pathname.length;
    }
    pathnameVal = pathname.substring(fromIndex, toLen);
    return keyVal !== '' && pathnameVal !== '' && keyVal === pathnameVal;
  };

  // 遍历 Sidebar 数据，收集所有的文章信息，并平铺到一个数组里面
  Object.keys(sidebar).forEach((key) => {
    if (isAllowed(key, pathname)) {
      const groups = sidebar[key] || [];
      groups.forEach((group) => {
        group.items.forEach((item) => {
          flattenTitles.push(item);
        });
      });
    }
  });

  const pageIndex = flattenTitles.findIndex((item) => item.link === pathname);

  const prevPage = flattenTitles[pageIndex - 1] || null;
  const nextPage = flattenTitles[pageIndex + 1] || null;

  return {
    prevPage,
    nextPage
  };
}
