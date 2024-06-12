在存在`Aside`组件的页面中，
首先是对于Aside组件中，我们点击某一个标题，就会跳转到目标的hash标题处

然后是对于页面滚动，tocs激活的标题连带跳到目标标题。我们会有一个给页面添加一个滚动事件（还加了节流）
在滚动事件中，先找到名字为.header-anchor的类（所有文章内容中的h2-h5标题），然后遍历每一个标题，根据下面的图判断
![image.png](https://cdn.nlark.com/yuque/0/2024/png/34286503/1717933779119-19c828c9-9a1c-44ee-8322-862c79be3938.png#averageHue=%23fefefe&clientId=u2973d274-bf0c-4&from=paste&height=559&id=ucfbafd13&originHeight=1188&originWidth=1577&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=160570&status=done&style=none&taskId=u87a428ba-05f7-47a0-85a9-52013d4ad50&title=&width=742.3333740234375)
找到之后，根据下标找到Aside中的需要激活的元素位置，然后激活即可
