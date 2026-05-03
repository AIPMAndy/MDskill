# MDSKILL 公众号排版和博客复制功能设计文档

**日期：** 2026-05-04  
**版本：** 1.0  
**作者：** Claude (Kiro)

---

## 1. 概述

### 1.1 目标

为 MDSKILL 添加专业的内容复制功能，支持将 Markdown 渲染结果一键复制到微信公众号、博客平台等，同时集成 PageSkill 的 13 种精美主题，提升专业版吸引力。

### 1.2 核心功能

1. **三种复制格式**
   - 微信公众号格式：完全内联样式，遵循微信 CSS 白名单
   - 博客平台格式：保留 class 名称，部分内联样式
   - HTML 源码格式：完整 HTML + `<style>` 标签

2. **主题扩展**
   - 保留现有 8 个主题
   - 添加 PageSkill 的 13 个主题
   - 总计 21 个主题，按分类组织

3. **交互优化**
   - 菜单栏 + 工具栏按钮 + 快捷键
   - 主题下拉选择器 + 主题预览面板
   - Toast 提示反馈

4. **专业版策略**
   - 所有复制功能：专业版独占
   - 新增的 13 个主题：专业版独占
   - 原有 1 个免费主题保持不变

---

## 2. 系统架构

### 2.1 文件结构

```
MDSKILL/
├── main.js                          # 主进程（添加菜单项）
├── license-manager.js               # 授权管理
├── renderer/
│   ├── index.html                   # 主界面（添加工具栏按钮）
│   ├── renderer.js                  # 渲染逻辑（添加复制事件）
│   ├── templates.js                 # 主题定义（8 → 21 个）
│   ├── copy-utils.js                # 🆕 复制功能核心模块
│   ├── theme-preview.html           # 🆕 主题预览面板
│   └── theme-preview.js             # 🆕 主题预览逻辑
└── package.json
```

### 2.2 模块职责

#### copy-utils.js（新增，~400 行）

**核心函数：**

```javascript
// 将计算样式内联到元素
function inlineComputedStyles(element)

// 微信公众号格式复制
async function copyForWeChat(html, css)

// 博客平台格式复制
async function copyForBlog(html, css)

// HTML 源码复制
async function copyHTMLSource(html, css)

// Toast 提示
function showToast(message, duration = 3000)

// 微信 CSS 白名单过滤
function filterWeChatStyles(element)
```

**技术实现：**
- 使用 `window.getComputedStyle()` 获取计算后的样式
- 遍历 DOM 树，将样式内联到每个元素的 `style` 属性
- 微信格式：过滤非白名单 CSS 属性
- 博客格式：保留 class，关键样式内联
- 使用 `navigator.clipboard.write()` API 写入剪贴板（支持 HTML + 纯文本）

#### templates.js（扩展，~1200 行）

**现有主题（8 个）：**
1. GitHub Dark（免费）
2. GitHub Light（专业版）
3. 极简现代（专业版）
4. 文艺清新（专业版）
5. 科技蓝（专业版）
6. 商务经典（专业版）
7. 暖色温馨（专业版）
8. 紫色梦幻（专业版）

**新增主题（13 个，全部专业版）：**

**商务类（4 个）：**
9. 深度报道（Latepoint）- 红色主题
10. 金融时报（Financial）- 经典报纸风格
11. 杂志风格（Magazine）- 图文混排
12. 纽约时报（NYT）- 经典新闻风格

**创意类（3 个）：**
13. 优雅简约（Elegant）- 宋体排版
14. 故事叙述（Story）- 情感化设计
15. Apple 极简（Apple）- Apple 设计语言

**技术类（2 个）：**
16. AI 现代（Anthropic）- 渐变主题
17. 科技极客（Tech）- 深色模式

**极简类（3 个）：**
18. 简约现代（Minimal）- 极简设计
19. 深度阅读（Deepread）- 专注内容

**故事类（1 个）：**
20. 故事风格（Story）- 叙事性强

**主题数据结构：**

```javascript
{
  id: 'theme-id',
  name: '主题名称',
  description: '主题描述',
  category: 'business' | 'creative' | 'tech' | 'minimal' | 'story',
  icon: '🎨',
  isPremium: true/false,
  styles: {
    backgroundColor: '#ffffff',
    titleFont: '"Noto Sans SC", sans-serif',
    titleSize: '32px',
    titleColor: '#1a1a1a',
    // ... 更多样式属性
  }
}
```

#### renderer.js（修改，~100 行新增）

**新增功能：**
1. 工具栏复制按钮（3 个）
2. 复制事件处理函数
3. 专业版授权检查
4. 主题预览面板入口

**UI 布局：**

```
┌─────────────────────────────────────────────┐
│  [主题选择 ▼] [浏览主题] [📋微信] [📋博客] [📋HTML] │
├─────────────────────────────────────────────┤
│  编辑器区域  │  预览区域                      │
└─────────────────────────────────────────────┘
```

#### main.js（修改，~30 行新增）

**菜单结构：**

```
File
  ├─ New Window (Cmd+N)
  ├─ Open (Cmd+O)
  ├─ Save (Cmd+S)
  ├─ Save As (Cmd+Shift+S)
  ├─ ───────────────
  ├─ Export as PDF (Cmd+E) [专业版]
  ├─ ───────────────
  ├─ Export 🆕
  │   ├─ Copy for WeChat (Cmd+Shift+W) [专业版]
  │   ├─ Copy for Blog (Cmd+Shift+B) [专业版]
  │   └─ Copy HTML Source (Cmd+Shift+H) [专业版]
  ├─ ───────────────
  ├─ Close
  └─ Quit
```

---

## 3. 数据流设计

### 3.1 复制流程

```
用户点击复制按钮
    ↓
检查专业版授权
    ↓ (未授权)
显示 "此功能需要专业版授权" Toast
    ↓ (已授权)
获取编辑器内容（Markdown）
    ↓
使用 marked.js 渲染为 HTML
    ↓
获取当前主题的 CSS
    ↓
创建隐藏的 sandbox DOM
    ↓
应用 CSS 样式到 sandbox
    ↓
渲染 HTML 到 sandbox
    ↓
根据复制类型处理：
  ┌─────────────────────────────────┐
  │ copyForWeChat():                │
  │  - 调用 inlineComputedStyles()  │
  │  - 调用 filterWeChatStyles()    │
  │  - 移除非白名单 CSS 属性         │
  │  - 生成完全内联的 HTML           │
  └─────────────────────────────────┘
  ┌─────────────────────────────────┐
  │ copyForBlog():                  │
  │  - 保留 class 名称               │
  │  - 关键样式内联（颜色、字体）     │
  │  - 生成混合格式 HTML             │
  └─────────────────────────────────┘
  ┌─────────────────────────────────┐
  │ copyHTMLSource():               │
  │  - 生成完整 HTML 文档            │
  │  - 包含 <style> 标签             │
  │  - 包含 <meta> 信息              │
  └─────────────────────────────────┘
    ↓
写入剪贴板（HTML + 纯文本两种格式）
    ↓
移除 sandbox DOM
    ↓
显示成功 Toast
```

### 3.2 主题切换流程

```
用户选择主题
    ↓
检查是否为专业版主题
    ↓ (是专业版主题 && 未授权)
显示 "此主题需要专业版授权" Toast
恢复到上一个主题
    ↓ (免费主题 || 已授权)
获取主题配置
    ↓
调用 generateTemplateCSS(styles)
    ↓
更新 <style id="dynamicStyles">
    ↓
判断亮色/暗色主题
    ↓
更新编辑器背景色和文字颜色
    ↓
更新预览区域背景色
    ↓
保存主题选择到 localStorage
```

---

## 4. 技术实现细节

### 4.1 内联样式算法

**核心逻辑（参考 PageSkill）：**

```javascript
function inlineComputedStyles(root) {
  // 获取所有元素（包括根元素）
  const elements = [root, ...Array.from(root.querySelectorAll('*'))];
  
  elements.forEach((element) => {
    const computedStyles = window.getComputedStyle(element);
    
    // 遍历需要内联的 CSS 属性
    INLINE_STYLE_PROPERTIES.forEach((property) => {
      const value = computedStyles.getPropertyValue(property);
      
      if (value) {
        element.style.setProperty(property, value);
      }
    });
  });
}
```

**需要内联的 CSS 属性列表：**

```javascript
const INLINE_STYLE_PROPERTIES = [
  'background-color', 'color', 'font-family', 'font-size',
  'font-style', 'font-weight', 'line-height', 'letter-spacing',
  'text-align', 'text-decoration', 'margin-top', 'margin-bottom',
  'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
  'border-top-width', 'border-left-width', 'border-color',
  'border-radius', 'box-shadow', 'list-style-type',
  // ... 更多属性
];
```

### 4.2 微信 CSS 白名单

**微信公众号支持的 CSS 属性：**

```javascript
const WECHAT_CSS_WHITELIST = [
  'color', 'font-size', 'font-family', 'font-weight', 'font-style',
  'text-align', 'text-decoration', 'line-height', 'letter-spacing',
  'background-color', 'background', 'padding', 'padding-top',
  'padding-bottom', 'padding-left', 'padding-right', 'margin',
  'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
  'border', 'border-top', 'border-bottom', 'border-left', 'border-right',
  'border-color', 'border-width', 'border-style', 'border-radius',
  'width', 'max-width', 'height', 'max-height', 'display',
  'float', 'clear', 'overflow', 'vertical-align',
];

function filterWeChatStyles(element) {
  const style = element.getAttribute('style');
  if (!style) return;
  
  const styles = style.split(';').filter(s => s.trim());
  const filtered = styles.filter(s => {
    const property = s.split(':')[0].trim();
    return WECHAT_CSS_WHITELIST.includes(property);
  });
  
  element.setAttribute('style', filtered.join('; '));
}
```

### 4.3 剪贴板 API

**写入 HTML 和纯文本两种格式：**

```javascript
async function writeHTMLToClipboard(html, plainText) {
  if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
        }),
      ]);
      return true;
    } catch (error) {
      console.error('Clipboard write failed:', error);
      return false;
    }
  }
  
  // Fallback: 使用 execCommand
  return fallbackCopy(html, plainText);
}
```

### 4.4 Toast 提示组件

**简单的 Toast 实现：**

```javascript
function showToast(message, duration = 3000) {
  // 移除已存在的 toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  // 创建 toast 元素
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // 动画显示
  setTimeout(() => toast.classList.add('show'), 10);
  
  // 自动隐藏
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
```

**CSS 样式：**

```css
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s ease;
  z-index: 10000;
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 5. UI/UX 设计

### 5.1 工具栏布局

**位置：** 预览区域顶部

**按钮设计：**

```
┌────────────────────────────────────────────────────┐
│ [主题: GitHub Dark ▼] [🎨 浏览主题]                 │
│                                                    │
│ [📋 复制到微信公众号] [📋 复制到博客] [📋 复制HTML]  │
└────────────────────────────────────────────────────┘
```

**按钮状态：**
- 默认：蓝色边框，白色背景
- 悬停：蓝色背景，白色文字
- 点击：绿色背景，显示 "✓ 已复制"，2 秒后恢复
- 禁用（未授权）：灰色，显示锁图标 🔒

### 5.2 主题预览面板

**触发方式：** 点击 "🎨 浏览主题" 按钮

**布局：** 模态对话框，居中显示

```
┌─────────────────────────────────────────────┐
│  选择主题                            [✕]     │
├─────────────────────────────────────────────┤
│  [全部] [商务] [创意] [技术] [极简] [故事]   │
├─────────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ 主题1│ │ 主题2│ │ 主题3│ │ 主题4│       │
│  │ 🔒PRO│ │      │ │ 🔒PRO│ │ 🔒PRO│       │
│  └──────┘ └──────┘ └──────┘ └──────┘       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ 主题5│ │ 主题6│ │ 主题7│ │ 主题8│       │
│  │ 🔒PRO│ │ 🔒PRO│ │ 🔒PRO│ │ 🔒PRO│       │
│  └──────┘ └──────┘ └──────┘ └──────┘       │
└─────────────────────────────────────────────┘
```

**交互：**
- 鼠标悬停：显示主题预览（实时渲染当前 Markdown）
- 点击：应用主题并关闭面板
- 点击专业版主题（未授权）：显示授权提示

### 5.3 Toast 提示文案

**成功提示：**
- 微信公众号：`✓ 已复制到剪贴板，可直接粘贴到微信公众号编辑器`
- 博客平台：`✓ 已复制到剪贴板，可粘贴到知乎、简书等博客平台`
- HTML 源码：`✓ HTML 源码已复制到剪贴板`

**错误提示：**
- 未授权：`🔒 此功能需要专业版授权，请联系开发者（微信: AIPMAndy）`
- 复制失败：`❌ 复制失败，请重试或检查浏览器权限`
- 内容为空：`⚠️ 编辑器内容为空，无法复制`

---

## 6. 专业版授权策略

### 6.1 功能权限矩阵

| 功能 | 免费版 | 专业版 |
|------|--------|--------|
| Markdown 编辑 | ✅ | ✅ |
| 实时预览 | ✅ | ✅ |
| 代码高亮 | ✅ | ✅ |
| 数学公式 | ✅ | ✅ |
| 多窗口编辑 | ✅ | ✅ |
| **主题** | 1 个（GitHub Dark） | 21 个精美主题 |
| **PDF 导出** | ❌ | ✅ |
| **复制到微信公众号** | ❌ | ✅ |
| **复制到博客** | ❌ | ✅ |
| **复制 HTML 源码** | ❌ | ✅ |

### 6.2 授权检查逻辑

```javascript
// 在每个复制函数开头检查
async function copyForWeChat(html, css) {
  const isPro = licenseManager.isPro();
  
  if (!isPro) {
    showToast('🔒 此功能需要专业版授权，请联系开发者（微信: AIPMAndy）', 5000);
    return;
  }
  
  // 执行复制逻辑...
}
```

### 6.3 UI 状态管理

```javascript
function updateCopyButtonsState(isPro) {
  const buttons = [
    document.getElementById('copyWeChatBtn'),
    document.getElementById('copyBlogBtn'),
    document.getElementById('copyHTMLBtn'),
  ];
  
  buttons.forEach(btn => {
    if (isPro) {
      btn.disabled = false;
      btn.classList.remove('disabled');
    } else {
      btn.disabled = true;
      btn.classList.add('disabled');
      btn.innerHTML = '🔒 ' + btn.dataset.originalText;
    }
  });
}
```

---

## 7. 测试计划

### 7.1 功能测试

**复制功能测试：**
1. 微信公众号复制
   - 复制后粘贴到微信公众号编辑器
   - 验证样式完整性（标题、正文、代码块、引用、列表、表格）
   - 验证图片显示（需要重新上传）
   - 验证链接可点击

2. 博客平台复制
   - 粘贴到知乎、简书、掘金
   - 验证样式保留程度
   - 验证代码高亮

3. HTML 源码复制
   - 粘贴到文本编辑器
   - 验证 HTML 结构完整
   - 验证 CSS 样式包含

**主题测试：**
1. 21 个主题逐一测试
2. 验证亮色/暗色主题编辑器适配
3. 验证主题切换流畅性
4. 验证主题保存到 localStorage

**授权测试：**
1. 未授权状态：复制按钮禁用，显示锁图标
2. 未授权点击：显示授权提示 Toast
3. 已授权状态：所有功能正常使用
4. 主题授权：专业版主题需要授权

### 7.2 兼容性测试

**平台测试：**
- macOS 12+
- Electron 28+

**浏览器内核测试：**
- Chromium 版本兼容性

**剪贴板 API 测试：**
- `navigator.clipboard.write()` 支持
- Fallback 到 `execCommand('copy')` 的兼容性

### 7.3 性能测试

**大文档测试：**
- 10,000 字 Markdown 文档
- 100+ 代码块
- 50+ 图片

**复制性能：**
- 内联样式计算时间 < 500ms
- 剪贴板写入时间 < 200ms
- 总体复制时间 < 1s

---

## 8. 实现计划

### 8.1 开发阶段

**Phase 1: 核心复制功能（1 天）**
- [ ] 创建 `copy-utils.js`
- [ ] 实现 `inlineComputedStyles()`
- [ ] 实现 `copyForWeChat()`
- [ ] 实现 `copyForBlog()`
- [ ] 实现 `copyHTMLSource()`
- [ ] 实现 Toast 组件

**Phase 2: 主题扩展（1 天）**
- [ ] 从 PageSkill 提取 13 个主题定义
- [ ] 转换为 MDSKILL 格式
- [ ] 添加到 `templates.js`
- [ ] 标记专业版主题
- [ ] 测试所有主题渲染

**Phase 3: UI 集成（0.5 天）**
- [ ] 添加工具栏复制按钮
- [ ] 绑定复制事件
- [ ] 添加菜单项
- [ ] 绑定快捷键
- [ ] 实现授权检查

**Phase 4: 主题预览面板（0.5 天）**
- [ ] 创建 `theme-preview.html`
- [ ] 实现主题网格布局
- [ ] 实现分类筛选
- [ ] 实现实时预览
- [ ] 实现主题应用

**Phase 5: 测试和优化（1 天）**
- [ ] 功能测试
- [ ] 兼容性测试
- [ ] 性能优化
- [ ] Bug 修复
- [ ] 文档更新

**总计：4 天**

### 8.2 发布计划

**版本号：** v1.3.0

**更新内容：**
- ✨ 新增：复制到微信公众号功能（专业版）
- ✨ 新增：复制到博客平台功能（专业版）
- ✨ 新增：复制 HTML 源码功能（专业版）
- 🎨 新增：13 个 PageSkill 精美主题（专业版）
- 🎨 优化：主题预览面板
- 📝 更新：README 和使用文档

---

## 9. 风险和缓解措施

### 9.1 技术风险

**风险 1：剪贴板 API 兼容性**
- **影响：** 部分系统可能不支持 `navigator.clipboard.write()`
- **缓解：** 实现 `execCommand('copy')` fallback

**风险 2：微信公众号样式兼容性**
- **影响：** 微信可能更新 CSS 白名单
- **缓解：** 保守使用 CSS 属性，定期测试

**风险 3：大文档性能问题**
- **影响：** 超大文档复制可能卡顿
- **缓解：** 添加文档大小警告，优化 DOM 操作

### 9.2 用户体验风险

**风险 1：用户不理解复制格式差异**
- **影响：** 选错格式导致样式丢失
- **缓解：** 在按钮上添加清晰的说明文字

**风险 2：图片无法复制**
- **影响：** 用户期望图片也能复制
- **缓解：** Toast 提示中说明"图片需要重新上传"

**风险 3：专业版功能过多导致免费版吸引力不足**
- **影响：** 用户不愿意试用
- **缓解：** 保持核心编辑功能免费，复制功能作为增值服务

---

## 10. 未来扩展

### 10.1 短期扩展（v1.4）

- 支持自定义主题
- 支持主题导入/导出
- 支持更多博客平台（Medium、Dev.to）

### 10.2 长期扩展（v2.0）

- 在线主题市场
- 社区主题分享
- AI 辅助排版建议
- 多语言支持

---

## 11. 参考资料

- [PageSkill 源码](https://github.com/AIPMAndy/PageSkill)
- [微信公众号 CSS 白名单](https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Batch_Sends_and_Originality_Checks.html)
- [Clipboard API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [marked.js 文档](https://marked.js.org/)

---

**文档结束**
