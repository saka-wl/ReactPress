import { createRoot } from 'react-dom';
import { App } from './App';
import siteData from 'rpress:site-data';

function renderInBrowser() {
  console.log(siteData);
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('root element not found');
  }
  createRoot(containerEl).render(<App />);
}

renderInBrowser();
