# 复制功能样式修复说明

## 问题描述

复制到微信公众号和博客平台时出现样式问题：
1. 文字颜色错误（浅色文字在白色背景上不可读）
2. 背景色错误（深色背景）
3. 样式重叠和布局混乱

## 根本原因

原实现从 `preview.innerHTML` 获取 HTML 字符串，然后创建临时隐藏容器，试图从隐藏容器获取计算样式。但隐藏容器没有应用主题样式，导致获取的样式不正确。

## 修复方案

### 1. 修改数据源（renderer.js）

**修改前：**
```javascript
const html = preview.innerHTML;
const success = await window.copyUtils.copyForWeChat(html, currentTemplate);
```

**修改后：**
```javascript
// 直接传递预览元素，而不是 innerHTML
const success = await window.copyUtils.copyForWeChat(preview, currentTemplate);
```

### 2. 重构复制函数（copy-utils.js）

#### copyForWeChat() 函数

**核心改进：**
1. 接受 HTMLElement 或 string 参数
2. 直接从源 `#preview` 元素获取计算样式（有正确的主题样式）
3. 添加 `fixWeChatStyles()` 函数修复微信特定样式问题

**关键代码：**
```javascript
// 从源元素内联计算样式（源元素有正确的样式）
const styledElement = inlineComputedStyles(sourceElement);

// 应用微信 CSS 白名单过滤
filterWeChatStyles(styledElement);

// 修复微信公众号特定样式问题
fixWeChatStyles(styledElement);
```

#### copyForBlog() 函数

**核心改进：**
1. 同样接受 HTMLElement 或 string 参数
2. 使用临时标记（data-blog-id）关联源元素和克隆元素
3. 从源元素获取样式，应用到克隆元素

### 3. 新增 fixWeChatStyles() 函数

专门处理微信公众号的样式兼容性问题：

#### 文字颜色修复
```javascript
// 浅色文字改为深色
if (color === 'rgb(255, 255, 255)' || color === '#ffffff') {
  el.style.setProperty('color', '#333333', 'important');
}
```

#### 背景色修复
```javascript
// 深色背景改为浅色
if (bgColor.includes('0, 0, 0')) {
  if (tagName === 'pre' || tagName === 'code') {
    el.style.setProperty('background-color', '#f6f8fa', 'important');
  } else {
    el.style.setProperty('background-color', '#ffffff', 'important');
  }
}
```

#### 特殊元素样式
- **标题**：深色文字 `#24292e`，加粗
- **代码块**：浅灰背景 `#f6f8fa`，边框，圆角
- **行内代码**：浅灰背景，深色文字，内边距
- **链接**：蓝色 `#0366d6`
- **引用块**：灰色文字，左边框
- **表格**：白色背景，边框，表头浅灰背景

#### 移除冲突样式
```javascript
el.style.removeProperty('position');
el.style.removeProperty('transform');
el.style.removeProperty('z-index');
el.style.removeProperty('filter');
```

## 修复效果

### 微信公众号
✅ 深色文字（#333333, #24292e）在白色背景上清晰可读
✅ 代码块使用 GitHub 风格（#f6f8fa 背景）
✅ 样式完全内联，符合微信 CSS 白名单
✅ 无样式冲突

### 博客平台
✅ 保留语义化 HTML 结构和 class
✅ 关键样式内联确保兼容性
✅ 适配知乎、简书、掘金等平台

## 技术要点

1. **从正确的源获取样式**：直接从 `#preview` 元素（有主题样式）获取计算样式
2. **使用临时标记关联元素**：通过 `data-inline-id` 或 `data-blog-id` 关联源元素和克隆元素
3. **样式优先级**：使用 `!important` 确保样式不被覆盖
4. **白名单过滤**：移除微信不支持的 CSS 属性
5. **特殊处理**：针对不同元素类型应用最佳样式

## 测试建议

1. 测试不同主题（深色、浅色）的复制效果
2. 测试各种 Markdown 元素：标题、代码块、表格、引用、列表
3. 在微信公众号编辑器中粘贴验证
4. 在知乎、简书等平台粘贴验证

## 文件变更

- `renderer/copy-utils.js`：重构 `copyForWeChat()` 和 `copyForBlog()`，新增 `fixWeChatStyles()`
- `renderer/renderer.js`：修改复制按钮事件处理，传递元素而非 innerHTML
