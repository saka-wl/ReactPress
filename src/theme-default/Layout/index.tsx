import { Content } from '@runtime';
import 'uno.css';
import { usePageData } from '../../runtime';

export function Layout() {
  const pageData = usePageData();
  const { pageType } = pageData;

  // 根据 pageType 分发不同的页面内容
  const getContent = () => {
    if (pageType === 'home') {
      return <div>Home 页面</div>;
    } else if (pageType === 'doc') {
      return <div>正文页面</div>;
    } else {
      return <div>404 页面</div>;
    }
  };

  return (
    <>
      <p>Nav</p>
      <div>{getContent()}</div>
    </>
  );
}
