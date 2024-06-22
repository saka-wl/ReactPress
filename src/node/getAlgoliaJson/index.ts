import { SiteConfig } from 'shared/types';
import md5 from 'md5';
import fs from 'fs-extra';
import { join } from 'path';
// import { readFileSync } from "fs-extra";

interface JsonItem {
  fileName: string;
  fileRoute: string;
  zip_code: string | Promise<string>;
  objectID: string;
}

export async function handleAlgoliaJson(root: string, userConfig: SiteConfig) {
  const { nav: navs, sidebar: siders } = userConfig.siteData.themeConfig;
  const json: Array<JsonItem> = [];
  for (const { text: navText, link: navLink } of navs) {
    if (navLink === '/') continue;
    for (const { text: siderText, items: siderItems } of siders[navLink]) {
      for (const { text: itemText, link: itemLink } of siderItems) {
        const tmp: JsonItem = {
          fileName: '',
          fileRoute: '',
          zip_code: '',
          objectID: ''
        };
        let filePath = '';
        if (fs.existsSync(join(root, '.' + itemLink) + '.mdx'))
          filePath = join(root, '.' + itemLink) + '.mdx';
        if (fs.existsSync(join(root, '.' + itemLink) + '.md'))
          filePath = join(root, '.' + itemLink) + '.md';
        if (filePath === '') continue;
        tmp.fileName = navText + '-' + siderText + '-' + itemText;
        tmp.fileRoute = itemLink;
        tmp.zip_code = (await fs.readFile(filePath, 'utf-8'))
          .replaceAll('\n', '')
          .replaceAll(' ', '')
          .replace(/!\[(.*?)\]\((.*?)\)/gm, '')
          .replace(/\[(.*?)\]\((.*?)\)/gm, '')
          .replace(/\r/gm, '')
          .replace(/```(.*?)```/gm, '');
        const tmpMd5 = await md5(tmp.zip_code);
        tmp.objectID = Date.now().toString().substring(6, 12) + '-' + tmpMd5;
        json.push(tmp);
      }
    }
  }
  (await fs.exists(root + '/algoliajson.json')) &&
    (await fs.remove(root + '/algoliajson.json'));
  fs.writeFile(root + '/algoliajson.json', JSON.stringify(json), (err) => {
    console.log(err);
  });
}
