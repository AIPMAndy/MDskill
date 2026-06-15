# MDskill 出海优化计划

## 审核评分: 35/100 → 目标 85/100

**当前状态**: 虽然 v1.8.0 完成了菜单和激活页国际化，但核心编辑体验仍然是中文为主，海外用户基本无法使用。

**优化目标**: 不增加新功能，只优化现有功能的国际化完整性。

---

## P0 - 立即修复 (1-2小时)

### 1. 编辑器 placeholder 国际化
**文件**: `renderer/index.html`, `renderer/renderer.js`, `i18n/locales.js`

**问题**: 硬编码中文
```html
placeholder="开始编写你的 Markdown 文档...

按 Cmd+F 搜索内容
按 Cmd+Shift+O 打开大纲"
```

**方案**:
1. `i18n/locales.js` 添加：
```javascript
editorPlaceholder: 'Start writing your Markdown document...\n\nPress Cmd+F to search\nPress Cmd+Shift+O for outline'
```

2. `index.html` 改为空或英文默认值
3. `renderer.js` init() 中动态设置

---

### 2. 工具栏 tooltip 国际化
**文件**: `renderer/index.html`, `renderer/toolbar-i18n.js`

**问题**: HTML 中硬编码 15+ 个 `title="中文"`

**方案**:
1. 移除所有 `title` 属性
2. 添加 `data-i18n-tooltip` 属性
3. `toolbar-i18n.js` 在初始化时设置 tooltip

---

### 3. 文档搜索面板国际化
**文件**: `renderer/document-search.js`, `i18n/locales.js`

**问题**: 所有文本硬编码中文

**方案**:
1. 提取所有文本到 `i18n/locales.js`
2. 使用 `window.i18nHelpers.t()` 替换
3. 监听语言切换事件

---

### 4. 品牌信息国际化
**文件**: `renderer/index.html`, `i18n/locales.js`

**当前**: "AI酋长Andy出品"

**方案**:
```javascript
// English: "Made by Andy"
// Chinese: "AI酋长Andy出品"
```

或直接移除，只保留 logo。

---

## P1 - 重要优化 (2-3小时)

### 5. 帮助页面完整国际化
**文件**: `renderer/help.html`, `i18n/locales.js`

**问题**: 整个页面 100% 中文

**方案**:
1. 加载 `i18n/locales.js`
2. 所有元素添加 `data-i18n` 属性
3. 根据语言动态渲染
4. 英文版移除中国特有平台

**关键改动**:
- Tab: Features / Shortcuts / FAQ / About
- 移除 "微信公众号"、"掘金知乎" 等中国平台
- 联系方式：Email first

---

### 6. 错误消息统一国际化
**文件**: `renderer/renderer.js`, `renderer/*.js`

**问题**: 部分使用降级逻辑
```javascript
const msg = window.i18nHelpers ? window.i18nHelpers.t('key') : 'fallback';
```

**方案**:
1. 确保所有页面都加载 i18n
2. 移除降级逻辑
3. 统一使用 `t()` 函数

---

## P2 - 体验优化 (1-2小时)

### 7. 首次启动语言选择
**新文件**: `renderer/language-selector.html`

**方案**:
- 检测到首次启动时显示语言选择对话框
- 用户选择后记录偏好
- 可选：检测系统语言自动选择

---

### 8. 工具栏语言切换按钮
**文件**: `renderer/index.html`, `main.js`

**方案**:
- 工具栏右侧添加 🌐 按钮
- 点击切换 en/zh
- 比菜单路径更直观

---

### 9. 快捷键跨平台说明
**文件**: `renderer/help.html`

**方案**:
```javascript
// 检测平台动态显示
const isMac = process.platform === 'darwin';
const modKey = isMac ? '⌘' : 'Ctrl';
```

---

## P3 - 细节优化

### 10. 主题选择器文本国际化
**文件**: `renderer/theme-preview.js`

**问题**: 主题描述可能有中文

---

### 11. Toast 提示国际化
**文件**: `renderer/toast.js`

**问题**: 部分提示消息硬编码

---

### 12. AI 配置页面国际化
**文件**: `renderer/ai-config.html`

**问题**: 未检查，可能有中文

---

## 验证清单

优化完成后，以海外用户身份测试：

- [ ] 首次启动，界面默认英文
- [ ] 鼠标悬停工具栏，tooltip 全英文
- [ ] 编辑器 placeholder 英文
- [ ] 按 Cmd+F 搜索，面板全英文
- [ ] 打开帮助页面，内容全英文
- [ ] 所有错误提示英文
- [ ] 切换语言到中文，所有内容立即切换
- [ ] 重启应用，语言偏好保留

---

## 技术债务

长期需要考虑：
1. 动态语言包加载（支持更多语言）
2. 社区翻译贡献机制
3. 自动化翻译覆盖率检测
4. 本地化测试自动化

---

## 估算工作量

- P0 任务：1-2 小时
- P1 任务：2-3 小时
- P2 任务：1-2 小时
- **总计：4-7 小时**

完成后评分：**35/100 → 85/100** ✅
