// import { Content } from '@runtime';
import 'uno.css';
import { usePageData } from '../../runtime';
import '../style/base.css';
import '../style/vars.css';
import '../style/doc.css';
import { Nav } from '../components/Nav';
import { HomeLayout } from './HomeLayout';
import { DocLayout } from './DocLayout';
import { Helmet } from 'react-helmet-async';
import { NotFoundLayout } from './NotFoundLayout';

export function Layout() {
  const pageData = usePageData();
  const { pageType, title } = pageData;

  // 根据 pageType 分发不同的页面内容
  const getContent = () => {
    if (pageType === 'home') {
      return <HomeLayout />;
    } else if (pageType === 'doc') {
      return <DocLayout />;
    } else {
      return <NotFoundLayout />;
    }
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Nav />
      <section
        style={{
          paddingTop: 'var(--rpress-nav-height)'
        }}
      >
        {getContent()}
      </section>
    </>
  );
}
