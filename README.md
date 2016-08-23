# 中益吉城app项目--智慧园区

## cordova部分插件
- cordova-plugin-devide
- cordova-plugin-crosswalk-webview
- cordova-plugin-dialogs
- cordova-plugin-whitelist
- cordova-plugin-app-version

## 大体目录结构
- res/ （app应用icon图标，闪屏等等）
- source/ 资源
    - images/ 图片
        - common/ 公共图片
    - less/ less文件
        - base.less 基础样式
        - sign/ (例如sing下的*.less)
    - node_modules/
        - model/ 数据model存放位置
        - Ajax.js 一些公共组件，例如Ajax.js
    - others/ 其他（字体等文件）
    - pages/ 页面
        - page1/ (同类型页面放在同一目录下xx1.js,xx2.js,xx3.js)   
        - page2/
    - config.json 请求访问配置（ajaxsrc、imgsrc）
    - index.html
    - index.js
    - index.less
    - work.js 
- config.xml cordova项目相应配置

## 命令

- npm install     安装所有依赖
- npm test    localhost: 8000 运行 （必须添加至少一个平台）

- gulp            编译所有文件
- gulp less       编译less文件
- gulp js         编译js文件
- gulp image      编译image文件
- gulp other      编译其他文件
- gulp watch      监听整个项目source下面文件

- cordova platform add    <平台名称>  添加一个平台
- cordova build   项目构建
- cordova run android 运行在android设备
- cordova plugin add <插件名称> 添加一个插件
- cordova plugin rm <插件名称>  移除一个插件


##消息列表的4个状态（status值）
1.园区公告
2.系统消息
3.通知
4.活动
