import { Content } from '@runtime';
import 'uno.css';
import { usePageData } from '../../runtime';
import '../style/base.css';
import '../style/vars.css';
import { Nav } from '../components/Nav';
import { HomeLayout } from './HomeLayout';

export function Layout() {
  const pageData = usePageData();
  const { pageType } = pageData;

  // 根据 pageType 分发不同的页面内容
  const getContent = () => {
    if (pageType === 'home') {
      return <HomeLayout />;
    } else if (pageType === 'doc') {
      return <div>正文页面</div>;
    } else {
      return <div>404 页面</div>;
    }
  };

  return (
    <>
      <Nav />
      <div>{getContent()}</div>
    </>
  );
}
