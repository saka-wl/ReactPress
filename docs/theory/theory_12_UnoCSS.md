## 配置UnoCSS
配置文档：[https://unocss.nodejs.cn/](https://unocss.nodejs.cn/)
css开发文档：[https://www.tailwindcss.cn/docs/installation](https://www.tailwindcss.cn/docs/installation)
icon文档（carbon）：[https://icon-sets.iconify.design/carbon/?keyword=carbon](https://icon-sets.iconify.design/carbon/?keyword=carbon)
UnoCSS是一个原子化的CSS，可以在类名中直接书写类似于CSS属性的类名，也可以自定义CSS类名规则
下面来讲一下如何使用
首先下载UnoCSS依赖与icon图标集
> pnpm i unocss

> pnpm i @iconify-json/carbon

然后，（如果你用的是vite来配置），直接在vite中导入插件即可，当然，也可以在里面配置新的类名规则
```javascript
// uno.config.ts
import { defineConfig, presetAttributify, presetWind, presetIcons } from 'unocss';

export default defineConfig({
  // 属性化功能支持，兼容，接入图标功能
  presets: [presetAttributify(), presetWind({}), presetIcons()],
  rules: [
    [
      "test_rule01",
      {
        height: '100px',
        width: '100px',
        margin: "10px",
        padding: '0px',
        border: '1px solid black'
      }
    ]
  ]
});
```
至此，我们就完成了基本配置，下面使用即可（这是在普通项目中的配置，至于到vite开发中，将上面的配置写入插件即可）
## 关于主题切换
首先，我们是如何实现主题切换的
我们在var.css中会声明两种颜色主题的颜色变量
```css
:root {
  --light_normal: rgb(255, 255, 255);
  --light_app: rgb(148, 148, 148);
  --light_word: rgb(0, 0, 0);

  --dark_normal: rgb(55, 49, 49);
  --dark_app: rgb(255, 255, 255);
  --dark_word: rgb(217, 255, 0);
}

:root {
  --bg_normal: var(--light_normal);
  --bg_app: var(--light_app);
  --bg_word: var(--light_word);
}

.dark {
  --bg_normal: var(--dark_normal);
  --bg_app: var(--dark_app);
  --bg_word: var(--dark_word);
}

```
在默认情况下，我们会使用:root下的颜色
但是，我们点击切换主题颜色之后，会给document.documentElement添加名为dark的class类名
这样，我们的颜色变量就会改为.dark下面的颜色变量
























