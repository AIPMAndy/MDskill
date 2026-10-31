# 多平台发布功能说明

## 功能概述

AndyMD 现已支持一键发布 Markdown 内容到多个平台：
- 微信公众号
- 知乎专栏
- 小红书

## 架构设计

### 核心组件

1. **平台适配器** (`modules/platforms/`)
   - `base-platform.js` - 基础平台类
   - `wechat-platform.js` - 微信公众号适配器
   - `zhihu-platform.js` - 知乎适配器
   - `xiaohongshu-platform.js` - 小红书适配器

2. **内容注入器** (`modules/injectors/`)
   - `base-injector.js` - 基础注入器
   - `wechat-injector.js` - 微信编辑器注入逻辑
   - `zhihu-injector.js` - 知乎编辑器注入逻辑

3. **发布管理器** (`modules/publish-manager.js`)
   - 统一管理所有平台
   - Markdown 到 HTML 转换
   - 发布历史记录

4. **发布UI** (`renderer/publish/`)
   - `publish-manager.html` - 平台选择界面
   - `publish-manager.js` - 前端交互逻辑

## 使用方法

### 1. 编辑 Markdown 内容

在编辑器中撰写或打开 Markdown 文件。

### 2. 点击发布按钮

点击工具栏右侧的绿色"发布"按钮（带箭头图标）。

### 3. 选择目标平台

在弹出的发布窗口中：
- 选择一个或多个目标平台
- 点击"开始发布"

### 4. 自动发布流程

系统将：
1. 将 Markdown 转换为富文本 HTML
2. 打开目标平台的网页编辑器
3. 自动注入内容到编辑器
4. 等待用户手动点击平台的发布按钮

## 技术实现

### WebView 方案

使用 Electron 的 BrowserWindow 创建 WebView：
```javascript
const webview = new BrowserWindow({
  width: 1200,
  height: 800,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true
  }
});
```

### 内容注入

通过 `webview.webContents.executeJavaScript()` 注入内容：
```javascript
await webview.webContents.executeJavaScript(`
  const editor = document.querySelector('.editor-selector');
  editor.innerHTML = \`${html}\`;
`);
```

### 平台适配

每个平台有独立的适配器，处理：
- 编辑器检测
- 内容格式转换
- 特殊元素处理（如代码块、图片）

## 数据存储

使用 `electron-store` 保存：
- 发布历史记录
- 平台配置信息
- 登录状态

存储位置：`~/Library/Application Support/mdskill/publish-data.json`

## IPC 通信

主进程暴露的 IPC 接口：

```javascript
// 打开发布窗口
ipcRenderer.invoke('open-publish-window', { title, markdown })

// 获取平台列表
ipcRenderer.invoke('get-platforms')

// 获取待发布内容
ipcRenderer.invoke('get-publish-content')

// 执行发布
ipcRenderer.invoke('publish-content', { platformIds, content })
```

## 扩展新平台

### 1. 创建平台适配器

```javascript
// modules/platforms/newplatform-platform.js
const BasePlatform = require('./base-platform');

class NewPlatform extends BasePlatform {
  constructor(config) {
    super('newplatform', config);
  }

  getDisplayName() {
    return '新平台';
  }

  getEditorUrl() {
    return 'https://newplatform.com/editor';
  }

  async checkLogin() {
    // 检测登录状态逻辑
  }

  async publish(content, options) {
    // 发布逻辑
  }
}

module.exports = NewPlatform;
```

### 2. 创建内容注入器（可选）

```javascript
// modules/injectors/newplatform-injector.js
const BaseInjector = require('./base-injector');

class NewPlatformInjector extends BaseInjector {
  static getEditorSelector() {
    return '.newplatform-editor';
  }

  static async inject(html, title) {
    // 注入逻辑
  }
}

module.exports = NewPlatformInjector;
```

### 3. 注册到发布管理器

```javascript
// modules/publish-manager.js
const NewPlatform = require('./platforms/newplatform-platform');

registerPlatforms() {
  // ...
  this.platforms.set('newplatform', new NewPlatform(configs.newplatform || {}));
}
```

## 已知限制

1. **需要手动发布**
   - 内容注入后，需要用户手动点击平台的发布按钮
   - 这是为了让用户最后确认内容，避免误发布

2. **登录状态**
   - 需要在 WebView 中手动登录各平台
   - 登录状态会保存在 WebView session 中

3. **格式兼容性**
   - 不同平台对 HTML 的支持程度不同
   - 某些特殊格式可能需要调整

## 测试

1. 启动应用：`npm start`
2. 打开测试文件：`test-publish.md`
3. 点击"发布"按钮
4. 选择平台并测试发布流程

## 未来优化

- [ ] 添加图片自动上传功能
- [ ] 支持草稿保存
- [ ] 批量发布到多个账号
- [ ] 定时发布功能
- [ ] CSDN 平台支持（使用官方 API）
- [ ] 发布状态实时反馈
- [ ] 自动检测平台登录状态
