// 主题预览面板模块
// 依赖：marked, licenseManager, templates.js

(function() {
  'use strict';

  // 主题分类
  const themeCategories = [
    { id: 'all', name: window.i18nHelpers ? window.i18nHelpers.t('themeSelector.categoryAll') : 'All', icon: '🎨' },
    { id: 'tech', name: 'Tech', icon: '💻' },
    { id: 'minimal', name: 'Minimal', icon: '✨' },
    { id: 'creative', name: 'Creative', icon: '🎭' },
    { id: 'business', name: 'Business', icon: '💼' },
  ];

  // 示例 Markdown 内容（用于预览）
  const sampleMarkdown = `# 标题示例
## 二级标题
这是一段**正常文本**，包含*斜体*和\`代码\`。

> 这是一段引用文本`;

  let currentCategory = 'all';
  let currentThemeId = null;

/**
 * 初始化主题预览面板
 */
function initThemePreview() {
  // HTML 已经在 index.html 中，直接绑定事件
  bindThemePreviewEvents();
}

/**
 * 绑定事件监听器
 */
function bindThemePreviewEvents() {
  const modal = document.getElementById('theme-preview-modal');
  const closeBtn = document.getElementById('closeThemePreview');
  const overlay = modal.querySelector('.theme-modal-overlay');

  // 关闭按钮
  closeBtn.addEventListener('click', closeThemePreview);

  // 点击遮罩层关闭
  overlay.addEventListener('click', closeThemePreview);

  // ESC 键关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeThemePreview();
    }
  });
}

/**
 * 打开主题预览面板
 * @param {string} activeThemeId - 当前激活的主题 ID
 */
function openThemePreview(activeThemeId) {
  currentThemeId = activeThemeId;
  const modal = document.getElementById('theme-preview-modal');

  if (!modal) {
    console.error('Theme preview modal not found');
    return;
  }

  // 渲染分类标签
  renderCategoryTabs();

  // 渲染主题网格
  renderThemeGrid(currentCategory);

  // 显示模态框
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * 关闭主题预览面板
 */
function closeThemePreview() {
  const modal = document.getElementById('theme-preview-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * 渲染分类标签
 */
function renderCategoryTabs() {
  const tabsContainer = document.getElementById('categoryTabs');

  tabsContainer.innerHTML = themeCategories.map(category => `
    <button
      class="category-tab ${category.id === currentCategory ? 'active' : ''}"
      data-category="${category.id}"
    >
      <span>${category.icon}</span>
      <span>${category.name}</span>
    </button>
  `).join('');

  // 绑定点击事件
  tabsContainer.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;
      currentCategory = category;

      // 更新标签状态
      tabsContainer.querySelectorAll('.category-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.category === category);
      });

      // 重新渲染主题网格
      renderThemeGrid(category);
    });
  });
}

/**
 * 渲染主题网格
 * @param {string} category - 分类 ID
 */
function renderThemeGrid(category) {
  const gridContainer = document.getElementById('themeGrid');
  const licenseManager = window.licenseManager || require('../license-manager');
  const isPro = licenseManager.isPro();

  // 获取所有主题（使用全局函数）
  const allThemes = window.getAllTemplates ? window.getAllTemplates() : [];

  // 按分类过滤
  const filteredThemes = category === 'all'
    ? allThemes
    : allThemes.filter(theme => theme.category === category);

  // 生成主题卡片
  gridContainer.innerHTML = filteredThemes.map(theme => {
    const isLocked = theme.isPremium && !isPro;
    const isSelected = theme.id === currentThemeId;

    return `
      <div
        class="theme-card ${isSelected ? 'selected' : ''}"
        data-theme-id="${theme.id}"
      >
        <div class="theme-preview" id="preview-${theme.id}">
          <!-- 预览内容将由 JavaScript 渲染 -->
        </div>
        <div class="theme-info">
          <div class="theme-name">
            <span class="theme-icon">${theme.icon || '🎨'}</span>
            <span class="theme-name-text">${theme.name}</span>
            ${theme.isPremium ? '<span class="pro-badge">Pro</span>' : ''}
          </div>
          <p class="theme-description">${theme.description}</p>
        </div>
      </div>
    `;
  }).join('');

  // 渲染每个主题的预览
  filteredThemes.forEach(theme => {
    renderThemePreview(theme);
  });

  // 绑定点击事件
  gridContainer.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      const themeId = card.dataset.themeId;
      selectTheme(themeId);
    });
  });
}

/**
 * 渲染单个主题的预览
 * @param {Object} theme - 主题对象
 */
function renderThemePreview(theme) {
  const previewContainer = document.getElementById(`preview-${theme.id}`);
  if (!previewContainer) return;

  // 将 Markdown 转换为 HTML（使用全局 marked）
  const html = window.marked ? window.marked.parse(sampleMarkdown) : sampleMarkdown;
  previewContainer.innerHTML = html;

  // 应用主题样式
  applyThemeToPreview(previewContainer, theme.styles);
}

/**
 * 应用主题样式到预览容器
 * @param {HTMLElement} container - 预览容器
 * @param {Object} styles - 主题样式对象
 */
function applyThemeToPreview(container, styles) {
  container.style.background = styles.backgroundColor;
  container.style.color = styles.bodyColor;
  container.style.fontFamily = styles.bodyFont;

  // 应用标题样式
  const h1 = container.querySelector('h1');
  if (h1) {
    h1.style.color = styles.titleColor;
    h1.style.fontFamily = styles.titleFont;
    h1.style.fontSize = '16px';
    h1.style.fontWeight = styles.titleWeight;
    h1.style.borderBottom = `1px solid ${styles.h2BorderColor}`;
    h1.style.paddingBottom = '4px';
  }

  const h2 = container.querySelector('h2');
  if (h2) {
    h2.style.color = styles.h2Color;
    h2.style.fontFamily = styles.h2Font;
    h2.style.fontSize = '13px';
    h2.style.fontWeight = styles.h2Weight;
  }

  // 应用段落样式
  const p = container.querySelector('p');
  if (p) {
    p.style.fontSize = '11px';
    p.style.lineHeight = '1.4';
  }

  // 应用强调样式
  const strong = container.querySelector('strong');
  if (strong) {
    strong.style.color = styles.strongColor;
  }

  const em = container.querySelector('em');
  if (em) {
    em.style.color = styles.emColor;
  }

  // 应用代码样式
  const code = container.querySelector('code');
  if (code) {
    code.style.background = styles.codeBg;
    code.style.color = styles.codeColor;
    code.style.padding = '1px 3px';
    code.style.borderRadius = '2px';
    code.style.fontSize = '10px';
  }

  // 应用引用样式
  const blockquote = container.querySelector('blockquote');
  if (blockquote) {
    blockquote.style.borderLeft = `3px solid ${styles.blockquoteBorderColor}`;
    blockquote.style.background = styles.blockquoteBg;
    blockquote.style.color = styles.blockquoteColor;
    blockquote.style.padding = '6px 10px';
    blockquote.style.margin = '6px 0';
    blockquote.style.fontSize = '11px';
  }
}

/**
 * 选择主题
 * @param {string} themeId - 主题 ID
 */
async function selectTheme(themeId) {
  const theme = window.getTemplateById ? window.getTemplateById(themeId) : null;

  if (!theme) {
    console.error('Theme not found:', themeId);
    return;
  }

  // 检查专业版授权 - 只在应用主题时检查，预览不需要授权
  if (theme.isPremium) {
    const result = await window.electron.ipcRenderer.invoke('check-feature-access', 'premium_themes');

    if (!result.hasAccess) {
      // 显示试用提示，而不是直接拒绝
      const status = result.status;
      let message;

      if (status.status === 'trial') {
        message = window.i18nHelpers.t('toast.themeProOnlyTrial', {days: status.daysLeft}) ||
                  `🔒 This is a Pro theme\n\nYou have ${status.daysLeft} days left in your trial. Upgrade to continue using Pro themes after trial ends.`;
      } else if (status.status === 'expired') {
        message = window.i18nHelpers.t('toast.themeProOnlyExpired') ||
                  '🔒 This is a Pro theme\n\nYour trial has expired. Please upgrade to Pro to use this theme.';
      } else {
        message = window.i18nHelpers.t('toast.themeProOnly');
      }

      showToast(message, 'error');
      return;
    }
  }

  // 应用主题到编辑器（使用全局函数）
  if (window.applyTemplate && typeof window.applyTemplate === 'function') {
    window.applyTemplate(theme);
  }

  // 更新当前主题（使用全局变量）
  if (typeof window.currentTemplate !== 'undefined') {
    window.currentTemplate = theme;
  }

  // 保存偏好设置
  localStorage.setItem('mdskill_template', themeId);

  // 关闭模态框
  closeThemePreview();

  // 显示成功提示
  showToast(window.i18nHelpers.t('toast.themeSwitched', {name: theme.name}), 'success');
}

/**
 * 显示提示消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success, error, info)
 */
function showToast(message, type = 'info') {
  // 移除已存在的 toast
  const existingToast = document.querySelector('.theme-toast');
  if (existingToast) {
    existingToast.remove();
  }

  // 创建新 toast
  const toast = document.createElement('div');
  toast.className = `theme-toast theme-toast-${type}`;
  toast.textContent = message;

  // 添加样式
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 24px',
    background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: 10000,
    animation: 'slideUp 0.3s ease-out',
  });

  document.body.appendChild(toast);

  // 3 秒后自动移除
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
  }
`;
document.head.appendChild(style);

// 导出函数（浏览器环境）
if (typeof window !== 'undefined') {
  window.themePreview = {
    initThemePreview,
    openThemePreview,
    closeThemePreview,
    selectTheme,
  };
}

// Node.js 环境导出（用于测试）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initThemePreview,
    openThemePreview,
    closeThemePreview,
    selectTheme,
  };
}

})(); // 结束 IIFE
