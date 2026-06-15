# 主题切换功能诊断报告

## 代码结构检查 ✅

### 1. 脚本加载顺序（index.html）
```
462: templates.js       ← 定义主题数据
463: renderer.js        ← 使用主题，绑定按钮事件
464: wechat-renderer.js
471: theme-preview.js   ← 主题预览面板
```
**状态：** ✅ 正确（templates.js 在 renderer.js 之前）

### 2. templates.js 导出
```javascript
// 导出函数到全局作用域
function getAllTemplates() {
  return Object.values(templates);
}

function getTemplateById(id) {
  return templates[id] || null;
}

// 暴露到 window 对象
if (typeof window !== 'undefined') {
  window.templates = templates;
  window.getAllTemplates = getAllTemplates;
  window.getTemplateById = getTemplateById;
}
```
**状态：** ✅ 已导出到 window

### 3. theme-preview.js 导出
```javascript
if (typeof window !== 'undefined') {
  window.themePreview = {
    initThemePreview,
    openThemePreview,
    closeThemePreview,
    selectTheme,
  };
}
```
**状态：** ✅ 已导出到 window

### 4. renderer.js 按钮绑定
```javascript
document.getElementById('themeBtn').addEventListener('click', () => {
  if (window.themePreview && window.themePreview.openThemePreview) {
    window.themePreview.openThemePreview(currentTemplate.id);
  } else {
    console.error('主题预览模块未加载');
  }
});
```
**状态：** ✅ 逻辑正确

### 5. openThemePreview 函数
```javascript
function openThemePreview(activeThemeId) {
  currentThemeId = activeThemeId;
  const modal = document.getElementById('theme-preview-modal');

  if (!modal) {
    console.error('Theme preview modal not found');
    return;
  }

  renderCategoryTabs();
  renderThemeGrid(currentCategory);
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
```
**状态：** ✅ 逻辑正确

### 6. CSS 样式
```css
.theme-modal {
  position: fixed;
  z-index: 9999;
  display: none;  /* 默认隐藏 */
}

.theme-modal.active {
  display: flex;  /* 激活时显示 */
}
```
**状态：** ✅ CSS 正确

## 可能的问题点

### 问题 1：themeBtn 元素不存在
**检查：** HTML 中是否有 `<button id="themeBtn">`

### 问题 2：事件绑定时机过早
**可能：** DOM 未完全加载就绑定事件

### 问题 3：theme-preview-modal 元素不存在
**检查：** HTML 中是否有 `<div id="theme-preview-modal">`

### 问题 4：JavaScript 执行错误
**检查：** 浏览器控制台是否有报错

### 问题 5：initThemePreview 未调用
**检查：** renderer.js 中是否调用了 `window.themePreview.initThemePreview()`

## 手动测试步骤

### 步骤 1：打开开发者工具
按 `⌘ + Option + I` 打开控制台

### 步骤 2：检查全局对象
在控制台执行：
```javascript
console.log('window.templates:', typeof window.templates);
console.log('window.getAllTemplates:', typeof window.getAllTemplates);
console.log('window.getTemplateById:', typeof window.getTemplateById);
console.log('window.themePreview:', typeof window.themePreview);
console.log('themeBtn 元素:', document.getElementById('themeBtn'));
console.log('modal 元素:', document.getElementById('theme-preview-modal'));
```

### 步骤 3：手动调用 openThemePreview
在控制台执行：
```javascript
window.themePreview.openThemePreview('github-dark');
```

**预期：** 主题选择器应该弹出

### 步骤 4：检查 CSS
在控制台执行：
```javascript
const modal = document.getElementById('theme-preview-modal');
console.log('modal display:', window.getComputedStyle(modal).display);
console.log('modal classList:', modal.classList);
```

## 快速修复建议

### 如果控制台显示 "主题预览模块未加载"
**原因：** theme-preview.js 未正确加载或 IIFE 内函数未导出
**解决：** 检查 theme-preview.js 末尾的导出代码

### 如果控制台显示 "Theme preview modal not found"
**原因：** HTML 中缺少 theme-preview-modal 元素
**解决：** 在 index.html 中添加 modal 结构

### 如果点击后完全没反应
**原因 1：** 事件监听器未绑定
**解决：** 在控制台手动绑定测试：
```javascript
document.getElementById('themeBtn').onclick = () => {
  alert('按钮被点击了');
  window.themePreview.openThemePreview('github-dark');
};
```

**原因 2：** themeBtn 元素被其他元素遮挡
**解决：** 检查 z-index 和元素层级

### 如果 modal 弹出但看不见
**原因：** CSS z-index 或背景色问题
**解决：** 临时修改 CSS 测试：
```javascript
const modal = document.getElementById('theme-preview-modal');
modal.style.backgroundColor = 'red';
modal.style.zIndex = '99999';
```

## 最简单的调试方法

在 renderer.js 的 themeBtn 事件监听器中添加 console.log：

```javascript
document.getElementById('themeBtn').addEventListener('click', () => {
  console.log('=== 主题按钮点击 ===');
  console.log('1. 按钮被点击');
  console.log('2. window.themePreview:', window.themePreview);
  console.log('3. currentTemplate:', currentTemplate);
  
  if (window.themePreview && window.themePreview.openThemePreview) {
    console.log('4. 调用 openThemePreview');
    window.themePreview.openThemePreview(currentTemplate.id);
    console.log('5. 调用完成');
  } else {
    console.error('主题预览模块未加载');
  }
});
```

重新启动应用，点击主题按钮，查看控制台输出到哪一步。
