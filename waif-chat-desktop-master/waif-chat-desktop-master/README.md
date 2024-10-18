# 歪fchat桌面端

## 项目介绍

![vue3](https://img.shields.io/badge/vue3-green.svg?style=plastic) ![vite](https://img.shields.io/badge/vite-yellow.svg?style=plastic) ![electron](https://img.shields.io/badge/electron-blue.svg?style=plastic) ![socket.io](https://img.shields.io/badge/socket.io-orange.svg?style=plastic) ![webrtc](https://img.shields.io/badge/webrtc-red.svg?style=plastic) ![typescripe](https://img.shields.io/badge/typescripe-blueviolet.svg?style=plastic) ![element plus](https://img.shields.io/badge/element_plus-success.svg?style=plastic)

前端采用 `vue3` + `ts` +  `vite` + `electron` + `element-plus` + `socket.io` + `webrtc`, 后端使用 `express` + `socket.io` + `mongodb`

## 实现功能

1. 用户登陆、注册、退出登陆；
2. uniapp实现微信小程序二维码扫码登陆，自定义扫码界面，完成二维码内容的识别；
3. 群聊、私聊（群聊在h5基础上新增消息未读数）功能；
4. 消息类型新增：视频通话、上传视频、支持不同类型文件(如.zip, .exe, .docx…)的上传，发送markdown类型的消息并做了消息类型界面的优化；
5. 视频预览效果；
6. webview内置浏览器；
7. 对文件上传做了切片处理；
8. 对消息记录进行分页加载；
9. 主要新增功能：wbertc实现音视频通话、屏幕共享功能；
10. 添加好友、创建群聊、对群成员的管理；
11. 搜索好友、群；
12. 用户个人资料的编辑；
13. 发布空调动态（对比h5端新增点赞，评论回复功能）；
14. 发布空间动态（对比h5端新增点赞，评论回复功能）；
15. 便签功能（所有人均可见）；
16. 主题色（深浅变换）；
17. AI：使用讯飞火星大模型实现（ai接口appId需要在后端自己配置，火星大模型V3.0也是可以免费使用的），可以完成与ai的对话，新建对话，设置模型的参数，自定义提示词，使用的流式数据传输。

## 启动项目

### 一、安装node

```bash
# 检查node版本 开发版本 v18.12.1
node -v
```

### 添加一步：请先`cd`到项目目录再执行`npm install`

```bash
# 具体根据自己的项目根目录名称进行选择，git下来的可能会带-master
cd waif-chat-desktop
```

### 二、安装依赖

```bash
npm install
```

### 三、运行项目

```bash
npm run dev
```

> **扫码登陆项目：**[扫码登陆项目 README.md](./scan-qrcode-app/source/README.md)

### 四、温馨提示: 项目运行前需要运行后端代码  

>  代码地址: https://gitee.com/wifi-skew-f/weif-chat-desktop-backend

### 五、由于`vue3-video-play`第三方组件作者把他自己的包名引错了的原因, 需要启动项目, 还需要在`npm i`后, 在`node_modules`中找到`vue3-video-play`目录, 将目录下的`package.json`文件中的内容进行修改, 修改结果如下

```json
"main": "./dist/index.umd.js",
"module": "./dist/index.mjs"
```

### 六、打包: 

#### 1、安装`electron-builder`

```bash
npm i electron-builder -g
```

mac可能需要在全局安装的时候加上sudo

```bash
sudo npm i electron-builder -g
```

#### 2、执行`npm run build`将vue项目先进行打包，打包后的项目在dist目录下

```bash
npm run build
```

#### 3、`npm run electron:build`打包成应用程序

```bash
# 默认打包成当前操作系统的程序
npm run electron:build

# 打包成windows程序
npm run electron:build:win

# 打包成macos程序
npm run electron:build:mac
```

> 没有制作windows的图标, 所以windows系统会默认用electron的图标，如果需要自定义图标请在`icons`目录下添加`icon.ico`文件

若执行`npm run electron:build`失败, 如下情况是因为网速过慢导致, 需要更改镜像源

```bash
 • packaging       platform=darwin arch=x64 electron=25.9.4 appOutDir=dist/mac
  ⨯ Get "https://github.com/electron/electron/releases/download/v25.9.4/electron-v25.9.4-darwin-x64.zip": EOF
github.com/develar/app-builder/pkg/download.(*Downloader).follow.func1
```

更改镜像源

```bash
# 将 Electron 镜像源设置为淘宝镜像源
npm config set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
# 将 Electron-builder 镜像源设置为淘宝镜像源
npm config set ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
```

也可以在项目中新建 `.npmrc` 文件

```bash
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
```

> 优先级: 项目下 .npmrc > 全局 .npmrc > 环境变量

执行`npm run electron:build`成功后, 可以在app_dist目录下找到打包后的文件, 可以直接运行或安装。

更多配置可以查看：

> [制作icon图标](./doc/制作icon图标.md)
>
> [electron打包配置](./doc/electron打包配置.md)
>
> [打包大小优化](./doc/打包大小优化.md)