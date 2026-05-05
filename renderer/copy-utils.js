/**
 * MDSKILL Copy Utilities
 *
 * 核心复制工具模块，支持：
 * 1. 微信公众号格式复制（完全内联样式 + CSS 白名单过滤）
 * 2. 博客平台格式复制（保留 class + 关键样式内联）
 * 3. HTML 源码导出（完整 HTML 文档）
 * 4. Toast 提示组件
 *
 * @module copy-utils
 */

// ============================================================================
// 常量定义
// ============================================================================

/**
 * 需要内联的 CSS 属性列表
 * 参考 PageSkill 的实现，覆盖微信公众号和博客平台的常用样式
 */
const INLINE_STYLE_PROPERTIES = [
  // 文字样式
  'color',
  'font-family',
  'font-size',
  'font-style',
  'font-weight',
  'line-height',
  'letter-spacing',
  'text-align',
  'text-decoration',
  'text-indent',
  'word-spacing',
  'white-space',

  // 背景样式
  'background-color',
  'background',
  'background-image',
  'background-position',
  'background-size',
  'background-repeat',

  // 边距和填充
  'margin',
  'margin-top',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'padding',
  'padding-top',
  'padding-bottom',
  'padding-left',
  'padding-right',

  // 边框
  'border',
  'border-top',
  'border-bottom',
  'border-left',
  'border-right',
  'border-color',
  'border-width',
  'border-style',
  'border-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-left-radius',
  'border-bottom-right-radius',

  // 尺寸
  'width',
  'max-width',
  'min-width',
  'height',
  'max-height',
  'min-height',

  // 布局
  'display',
  'float',
  'clear',
  'overflow',
  'overflow-x',
  'overflow-y',
  'vertical-align',
  'position',
  'top',
  'bottom',
  'left',
  'right',

  // 阴影和效果
  'box-shadow',
  'text-shadow',
  'opacity',

  // 列表样式
  'list-style',
  'list-style-type',
  'list-style-position',
  'list-style-image',
];

/**
 * 微信公众号支持的 CSS 属性白名单
 * 参考微信公众号编辑器的 CSS 限制
 */
const WECHAT_CSS_WHITELIST = [
  'color',
  'font-size',
  'font-family',
  'font-weight',
  'font-style',
  'text-align',
  'text-decoration',
  'line-height',
  'letter-spacing',
  'background-color',
  'background',
  'padding',
  'padding-top',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'margin',
  'margin-top',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'border',
  'border-top',
  'border-bottom',
  'border-left',
  'border-right',
  'border-color',
  'border-width',
  'border-style',
  'border-radius',
  'width',
  'max-width',
  'height',
  'max-height',
  'display',
  'float',
  'clear',
  'overflow',
  'vertical-align',
  'text-indent',
  'list-style-type',
];

/**
 * 需要移除的 HTML 标签（安全性考虑）
 */
const UNSAFE_TAGS = ['script', 'style', 'iframe', 'object', 'embed'];

/**
 * 需要移除的 HTML 属性（安全性考虑）
 */
const UNSAFE_ATTRIBUTES = [
  'onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout',
  'onfocus', 'onblur', 'onchange', 'onsubmit', 'onkeydown', 'onkeyup',
];

// ============================================================================
// 核心函数：样式内联
// ============================================================================

/**
 * 将计算样式内联到元素
 *
 * 深度克隆 DOM 元素，递归遍历所有节点，使用 window.getComputedStyle()
 * 获取计算样式，将样式写入 style 属性，移除 class 和 id 属性。
 *
 * @param {HTMLElement} element - 要处理的 DOM 元素
 * @returns {HTMLElement} 处理后的克隆元素
 */
function inlineComputedStyles(element) {
  // 先给原始元素树中的所有元素添加临时标记
  const originalElements = [element, ...Array.from(element.querySelectorAll('*'))];
  originalElements.forEach((el, index) => {
    if (el.nodeType === Node.ELEMENT_NODE) {
      el.setAttribute('data-inline-id', `temp-${index}`);
    }
  });

  // 深度克隆元素
  const cloned = element.cloneNode(true);

  // 获取克隆树中的所有元素
  const clonedElements = [cloned, ...Array.from(cloned.querySelectorAll('*'))];

  clonedElements.forEach((clonedEl) => {
    // 跳过非元素节点
    if (clonedEl.nodeType !== Node.ELEMENT_NODE) return;

    // 通过临时 ID 找到对应的原始元素
    const tempId = clonedEl.getAttribute('data-inline-id');
    if (!tempId) return;

    const originalEl = element.querySelector(`[data-inline-id="${tempId}"]`);
    if (!originalEl) return;

    // 从原始元素获取计算样式
    const computedStyles = window.getComputedStyle(originalEl);

    // 内联样式到克隆元素
    INLINE_STYLE_PROPERTIES.forEach((property) => {
      const value = computedStyles.getPropertyValue(property);

      // 只设置有效值
      if (value && value !== 'none' && value !== 'normal' && value !== 'auto') {
        clonedEl.style.setProperty(property, value, 'important');
      }
    });

    // 特殊处理：pre 和 code 标签
    if (clonedEl.tagName === 'PRE' || clonedEl.tagName === 'CODE') {
      clonedEl.style.setProperty('white-space', 'pre-wrap', 'important');
      clonedEl.style.setProperty('word-break', 'break-all', 'important');
      clonedEl.style.setProperty('overflow-x', 'auto', 'important');
    }

    // 特殊处理：table 标签
    if (clonedEl.tagName === 'TABLE') {
      clonedEl.style.setProperty('border-collapse', 'collapse', 'important');
      clonedEl.style.setProperty('width', '100%', 'important');
    }

    // 移除 class 和 id 属性
    clonedEl.removeAttribute('class');
    clonedEl.removeAttribute('id');
    clonedEl.removeAttribute('data-inline-id');
  });

  // 清理原始元素的临时标记
  originalElements.forEach((el) => {
    if (el.nodeType === Node.ELEMENT_NODE) {
      el.removeAttribute('data-inline-id');
    }
  });

  return cloned;
}

/**
 * 过滤微信 CSS 白名单
 *
 * 移除不在微信 CSS 白名单中的样式属性
 *
 * @param {HTMLElement} element - 要处理的 DOM 元素
 */
function filterWeChatStyles(element) {
  const elements = [element, ...Array.from(element.querySelectorAll('*'))];

  elements.forEach((el) => {
    if (el.nodeType !== Node.ELEMENT_NODE) return;

    const style = el.getAttribute('style');
    if (!style) return;

    // 解析样式字符串
    const styles = style.split(';').filter(s => s.trim());

    // 过滤白名单属性
    const filtered = styles.filter(s => {
      const property = s.split(':')[0].trim();
      return WECHAT_CSS_WHITELIST.includes(property);
    });

    // 更新样式
    if (filtered.length > 0) {
      el.setAttribute('style', filtered.join('; ') + ';');
    } else {
      el.removeAttribute('style');
    }
  });
}

/**
 * 修复微信公众号特定样式问题
 *
 * 确保文字颜色在浅色背景下可读，修复常见样式冲突
 *
 * @param {HTMLElement} element - 要处理的 DOM 元素
 */
function fixWeChatStyles(element) {
  const elements = [element, ...Array.from(element.querySelectorAll('*'))];

  elements.forEach((el) => {
    if (el.nodeType !== Node.ELEMENT_NODE) return;

    const tagName = el.tagName.toLowerCase();
    const computedStyle = el.style;

    // 修复文字颜色：确保深色文字
    const color = computedStyle.color;
    if (!color || color === 'rgb(255, 255, 255)' || color === '#ffffff' || color === '#fff' ||
        color === 'rgb(212, 212, 212)' || color === 'rgba(255, 255, 255, 1)') {
      // 浅色文字改为深色
      el.style.setProperty('color', '#333333', 'important');
    }

    // 修复背景色：确保白色或浅色背景
    const bgColor = computedStyle.backgroundColor;
    if (bgColor && (bgColor.includes('37, 37, 37') || bgColor.includes('30, 30, 30') ||
        bgColor.includes('0, 0, 0') || bgColor === 'rgb(0, 0, 0)' || bgColor === '#000000')) {
      // 深色背景改为浅色
      if (tagName === 'pre' || tagName === 'code') {
        el.style.setProperty('background-color', '#f6f8fa', 'important');
      } else {
        el.style.setProperty('background-color', '#ffffff', 'important');
      }
    }

    // 特殊处理：标题
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
      el.style.setProperty('color', '#24292e', 'important');
      el.style.setProperty('font-weight', 'bold', 'important');
    }

    // 特殊处理：代码块
    if (tagName === 'pre') {
      el.style.setProperty('background-color', '#f6f8fa', 'important');
      el.style.setProperty('border', '1px solid #e1e4e8', 'important');
      el.style.setProperty('border-radius', '6px', 'important');
      el.style.setProperty('padding', '16px', 'important');
      el.style.setProperty('overflow-x', 'auto', 'important');

      // 代码块内的文字
      const codeEl = el.querySelector('code');
      if (codeEl) {
        codeEl.style.setProperty('color', '#24292e', 'important');
        codeEl.style.setProperty('background-color', 'transparent', 'important');
      }
    }

    // 特殊处理：行内代码
    if (tagName === 'code' && el.parentElement?.tagName !== 'PRE') {
      el.style.setProperty('background-color', '#f6f8fa', 'important');
      el.style.setProperty('color', '#24292e', 'important');
      el.style.setProperty('padding', '2px 6px', 'important');
      el.style.setProperty('border-radius', '3px', 'important');
    }

    // 特殊处理：链接
    if (tagName === 'a') {
      el.style.setProperty('color', '#0366d6', 'important');
      el.style.setProperty('text-decoration', 'none', 'important');
    }

    // 特殊处理：引用块
    if (tagName === 'blockquote') {
      el.style.setProperty('color', '#6a737d', 'important');
      el.style.setProperty('border-left', '4px solid #dfe2e5', 'important');
      el.style.setProperty('padding-left', '16px', 'important');
      el.style.setProperty('background-color', '#ffffff', 'important');
    }

    // 特殊处理：表格
    if (tagName === 'table') {
      el.style.setProperty('border-collapse', 'collapse', 'important');
      el.style.setProperty('width', '100%', 'important');
      el.style.setProperty('background-color', '#ffffff', 'important');
    }

    if (tagName === 'th' || tagName === 'td') {
      el.style.setProperty('border', '1px solid #dfe2e5', 'important');
      el.style.setProperty('padding', '8px 12px', 'important');
      el.style.setProperty('color', '#24292e', 'important');

      if (tagName === 'th') {
        el.style.setProperty('background-color', '#f6f8fa', 'important');
        el.style.setProperty('font-weight', 'bold', 'important');
      } else {
        el.style.setProperty('background-color', '#ffffff', 'important');
      }
    }

    // 移除可能导致冲突的样式
    el.style.removeProperty('position');
    el.style.removeProperty('transform');
    el.style.removeProperty('z-index');
    el.style.removeProperty('filter');
  });
}

/**
 * 移除不安全的标签和属性
 *
 * @param {HTMLElement} element - 要处理的 DOM 元素
 */
function sanitizeHTML(element) {
  // 移除不安全的标签
  UNSAFE_TAGS.forEach(tag => {
    const elements = element.querySelectorAll(tag);
    elements.forEach(el => el.remove());
  });

  // 移除不安全的属性
  const allElements = [element, ...Array.from(element.querySelectorAll('*'))];
  allElements.forEach(el => {
    if (el.nodeType !== Node.ELEMENT_NODE) return;

    UNSAFE_ATTRIBUTES.forEach(attr => {
      if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    });
  });
}

// ============================================================================
// 核心函数：复制功能
// ============================================================================

/**
 * 复制到微信公众号
 *
 * 从 #preview 容器获取已渲染的 HTML，内联计算样式，应用微信 CSS 白名单过滤，
 * 移除 script, style, 事件处理器，复制到剪贴板。
 *
 * @param {HTMLElement|string} source - 源元素或 HTML 字符串
 * @param {string} themeName - 主题名称（用于日志）
 * @returns {Promise<{success: boolean, message: string}>} 复制结果
 */
async function copyForWeChat(source, themeName = 'default') {
  try {
    // 获取源元素
    let sourceElement;
    if (typeof source === 'string') {
      // 如果传入的是字符串，尝试从 #preview 获取
      sourceElement = document.getElementById('preview');
      if (!sourceElement) {
        return {
          success: false,
          message: '⚠️ 未找到预览容器'
        };
      }
    } else {
      sourceElement = source;
    }

    // 验证内容
    if (!sourceElement || !sourceElement.innerHTML || sourceElement.innerHTML.trim() === '') {
      return {
        success: false,
        message: '⚠️ 编辑器内容为空，无法复制'
      };
    }

    // 从源元素内联计算样式（源元素有正确的样式）
    const styledElement = inlineComputedStyles(sourceElement);

    // 应用微信 CSS 白名单过滤
    filterWeChatStyles(styledElement);

    // 移除不安全的标签和属性
    sanitizeHTML(styledElement);

    // 修复微信公众号特定样式问题
    fixWeChatStyles(styledElement);

    // 获取处理后的 HTML
    const processedHTML = styledElement.innerHTML;

    // 生成纯文本（用于降级）
    const plainText = styledElement.textContent || '';

    // 写入剪贴板
    const copied = await writeHTMLToClipboard(processedHTML, plainText);

    if (copied) {
      console.log(`[Copy] WeChat format copied successfully (theme: ${themeName})`);
      return {
        success: true,
        message: '✓ 已复制到剪贴板，可直接粘贴到微信公众号编辑器'
      };
    } else {
      return {
        success: false,
        message: '❌ 复制失败，请重试或检查浏览器权限'
      };
    }
  } catch (error) {
    console.error('[Copy] WeChat copy failed:', error);
    return {
      success: false,
      message: '❌ 复制失败：' + error.message
    };
  }
}

/**
 * 复制到博客平台
 *
 * 类似微信但限制更少，保留语义化 HTML 结构，仅内联关键样式，保留 class。
 *
 * @param {HTMLElement|string} source - 源元素或 HTML 字符串
 * @param {string} themeName - 主题名称（用于日志）
 * @returns {Promise<{success: boolean, message: string}>} 复制结果
 */
async function copyForBlog(source, themeName = 'default') {
  try {
    // 获取源元素
    let sourceElement;
    if (typeof source === 'string') {
      // 如果传入的是字符串，尝试从 #preview 获取
      sourceElement = document.getElementById('preview');
      if (!sourceElement) {
        return {
          success: false,
          message: '⚠️ 未找到预览容器'
        };
      }
    } else {
      sourceElement = source;
    }

    // 验证内容
    if (!sourceElement || !sourceElement.innerHTML || sourceElement.innerHTML.trim() === '') {
      return {
        success: false,
        message: '⚠️ 编辑器内容为空，无法复制'
      };
    }

    // 克隆源元素
    const cloned = sourceElement.cloneNode(true);

    // 部分内联样式（保留 class）
    const elements = [cloned, ...Array.from(cloned.querySelectorAll('*'))];

    // 关键样式列表（博客平台通常支持这些）
    const criticalStyles = [
      'color',
      'font-size',
      'font-family',
      'font-weight',
      'background-color',
      'text-align',
      'line-height',
      'padding',
      'margin',
      'border',
      'border-radius',
    ];

    // 为克隆元素添加临时标记
    elements.forEach((el, index) => {
      if (el.nodeType === Node.ELEMENT_NODE) {
        el.setAttribute('data-blog-id', `blog-${index}`);
      }
    });

    // 从源元素获取样式并应用到克隆元素
    elements.forEach((clonedEl) => {
      if (clonedEl.nodeType !== Node.ELEMENT_NODE) return;

      const blogId = clonedEl.getAttribute('data-blog-id');
      if (!blogId) return;

      // 在源元素树中找到对应元素
      const originalEl = sourceElement.querySelector(`[data-blog-id="${blogId}"]`);
      if (!originalEl) return;

      const computedStyles = window.getComputedStyle(originalEl);

      // 只内联关键样式
      criticalStyles.forEach((property) => {
        const value = computedStyles.getPropertyValue(property);

        if (value && value !== 'none' && value !== 'normal' && value !== 'auto') {
          clonedEl.style.setProperty(property, value);
        }
      });

      // 清理临时标记
      clonedEl.removeAttribute('data-blog-id');
    });

    // 清理源元素的临时标记
    const sourceElements = [sourceElement, ...Array.from(sourceElement.querySelectorAll('*'))];
    sourceElements.forEach((el) => {
      if (el.nodeType === Node.ELEMENT_NODE) {
        el.removeAttribute('data-blog-id');
      }
    });

    // 移除不安全的标签和属性
    sanitizeHTML(cloned);

    // 获取处理后的 HTML
    const processedHTML = cloned.innerHTML;

    // 生成纯文本
    const plainText = cloned.textContent || '';

    // 写入剪贴板
    const copied = await writeHTMLToClipboard(processedHTML, plainText);

    if (copied) {
      console.log(`[Copy] Blog format copied successfully (theme: ${themeName})`);
      return {
        success: true,
        message: '✓ 已复制到剪贴板，可粘贴到知乎、简书等博客平台'
      };
    } else {
      return {
        success: false,
        message: '❌ 复制失败，请重试或检查浏览器权限'
      };
    }
  } catch (error) {
    console.error('[Copy] Blog copy failed:', error);
    return {
      success: false,
      message: '❌ 复制失败：' + error.message
    };
  }
}

/**
 * 复制 HTML 源码
 *
 * 生成完整 HTML 文档，嵌入 style 块和主题 CSS，包含 meta 标签和 charset。
 *
 * @param {string} htmlContent - HTML 内容
 * @param {string} themeName - 主题名称
 * @param {string} themeCSS - 主题 CSS（可选）
 * @returns {Promise<{success: boolean, message: string}>} 复制结果
 */
async function copyHTMLSource(htmlContent, themeName = 'default', themeCSS = '') {
  try {
    // 验证内容
    if (!htmlContent || htmlContent.trim() === '') {
      return {
        success: false,
        message: '⚠️ 编辑器内容为空，无法复制'
      };
    }

    // 生成完整 HTML 文档
    const fullHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="generator" content="MDSKILL - Markdown Editor">
  <title>MDSKILL Export - ${themeName}</title>
  <style>
/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fff;
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

/* Theme Styles */
${themeCSS}
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;

    // 写入剪贴板（纯文本格式）
    const copied = await writeTextToClipboard(fullHTML);

    if (copied) {
      console.log(`[Copy] HTML source copied successfully (theme: ${themeName})`);
      return {
        success: true,
        message: '✓ HTML 源码已复制到剪贴板'
      };
    } else {
      return {
        success: false,
        message: '❌ 复制失败，请重试或检查浏览器权限'
      };
    }
  } catch (error) {
    console.error('[Copy] HTML source copy failed:', error);
    return {
      success: false,
      message: '❌ 复制失败：' + error.message
    };
  }
}

// ============================================================================
// 剪贴板 API
// ============================================================================

/**
 * 写入 HTML 和纯文本到剪贴板
 *
 * 使用 navigator.clipboard.write() API，降级到 document.execCommand()
 *
 * @param {string} html - HTML 内容
 * @param {string} plainText - 纯文本内容
 * @returns {Promise<boolean>} 是否成功
 */
async function writeHTMLToClipboard(html, plainText) {
  // 尝试使用现代 Clipboard API
  if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
        }),
      ]);
      return true;
    } catch (error) {
      console.warn('[Clipboard] Modern API failed, trying fallback:', error);
      // 继续尝试降级方案
    }
  }

  // 降级方案：使用 execCommand
  return fallbackCopyHTML(html, plainText);
}

/**
 * 写入纯文本到剪贴板
 *
 * @param {string} text - 文本内容
 * @returns {Promise<boolean>} 是否成功
 */
async function writeTextToClipboard(text) {
  // 尝试使用现代 Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn('[Clipboard] Modern API failed, trying fallback:', error);
      // 继续尝试降级方案
    }
  }

  // 降级方案：使用 execCommand
  return fallbackCopyText(text);
}

/**
 * 降级方案：使用 execCommand 复制 HTML
 *
 * @param {string} html - HTML 内容
 * @param {string} plainText - 纯文本内容
 * @returns {boolean} 是否成功
 */
function fallbackCopyHTML(html, plainText) {
  try {
    // 创建临时容器
    const container = document.createElement('div');
    container.style.cssText = 'position: absolute; left: -9999px; top: -9999px;';
    container.innerHTML = html;
    document.body.appendChild(container);

    // 选择内容
    const range = document.createRange();
    range.selectNodeContents(container);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // 执行复制
    const success = document.execCommand('copy');

    // 清理
    selection.removeAllRanges();
    document.body.removeChild(container);

    return success;
  } catch (error) {
    console.error('[Clipboard] Fallback copy failed:', error);
    return false;
  }
}

/**
 * 降级方案：使用 execCommand 复制文本
 *
 * @param {string} text - 文本内容
 * @returns {boolean} 是否成功
 */
function fallbackCopyText(text) {
  try {
    // 创建临时 textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position: absolute; left: -9999px; top: -9999px;';
    document.body.appendChild(textarea);

    // 选择并复制
    textarea.select();
    const success = document.execCommand('copy');

    // 清理
    document.body.removeChild(textarea);

    return success;
  } catch (error) {
    console.error('[Clipboard] Fallback text copy failed:', error);
    return false;
  }
}

// ============================================================================
// Toast 提示组件
// ============================================================================

/**
 * 显示 Toast 提示
 *
 * 动态创建 toast 元素，位置：底部居中，fixed，3 秒后自动消失，
 * 支持类型：success, error, info，平滑淡入淡出动画。
 *
 * @param {string} message - 提示消息
 * @param {string} type - 提示类型：'success' | 'error' | 'info'
 * @param {number} duration - 显示时长（毫秒），默认 3000
 */
function showToast(message, type = 'info', duration = 3000) {
  // 移除已存在的 toast
  const existing = document.querySelector('.mdskill-toast');
  if (existing) {
    existing.remove();
  }

  // 创建 toast 元素
  const toast = document.createElement('div');
  toast.className = `mdskill-toast mdskill-toast-${type}`;
  toast.textContent = message;

  // 添加样式
  toast.style.cssText = `
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: ${getToastBackground(type)};
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10000;
    max-width: 80%;
    text-align: center;
    pointer-events: none;
  `;

  document.body.appendChild(toast);

  // 触发动画（需要延迟以触发 transition）
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  // 自动隐藏
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';

    // 移除元素
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

/**
 * 获取 Toast 背景色
 *
 * @param {string} type - Toast 类型
 * @returns {string} 背景色
 */
function getToastBackground(type) {
  switch (type) {
    case 'success':
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    case 'error':
      return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    case 'info':
    default:
      return 'rgba(0, 0, 0, 0.85)';
  }
}

// ============================================================================
// 导出（浏览器环境）
// ============================================================================

// 在浏览器环境中，将函数暴露到全局 window 对象
if (typeof window !== 'undefined') {
  window.copyUtils = {
    inlineComputedStyles,
    copyForWeChat,
    copyForBlog,
    copyHTMLSource,
    showToast,
  };
}

// Node.js 环境导出（用于测试）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    inlineComputedStyles,
    copyForWeChat,
    copyForBlog,
    copyHTMLSource,
    showToast,
  };
}
