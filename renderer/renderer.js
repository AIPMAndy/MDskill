const { ipcRenderer } = require('electron');
const { marked } = require('marked');
const hljs = require('highlight.js');
const katex = require('katex');
const licenseManager = require('../license-manager');

// 工具函数将在脚本加载后从全局对象获取

// 配置 marked
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {}
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

// 扩展 marked 支持 KaTeX
const renderer = new marked.Renderer();
const originalText = renderer.text.bind(renderer);
renderer.text = function(text) {
  // 行内公式 $...$
  text = text.replace(/\$([^\$]+)\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula, { throwOnError: false });
    } catch (e) {
      return match;
    }
  });
  return originalText(text);
};

const originalCode = renderer.code.bind(renderer);
renderer.code = function(code, language) {
  // 块级公式 ```math
  if (language === 'math') {
    try {
      return '<div class="math-block">' +
        katex.renderToString(code, { displayMode: true, throwOnError: false }) +
        '</div>';
    } catch (e) {
      return '<pre><code>' + code + '</code></pre>';
    }
  }
  return originalCode(code, language);
};

marked.use({ renderer });

// DOM 元素 - 将在 init() 中初始化
let editor;
let preview;
let editorContainer;
let fileStatus;

// 状态
let currentFilePath = null;
let isModified = false;
let previewVisible = true;
let currentTemplate = null;
let updateTimer = null; // 防抖定时器

// 初始化
async function init() {
  try {
    console.log('=== 开始初始化 ===');

    // 初始化 DOM 元素引用
    editor = document.getElementById('editor');
    preview = document.getElementById('preview');
    editorContainer = document.querySelector('.editor-container');
    fileStatus = document.getElementById('fileStatus');

    // 检查关键 DOM 元素
    if (!editor || !preview || !editorContainer) {
      console.error('关键 DOM 元素缺失:', { editor: !!editor, preview: !!preview, editorContainer: !!editorContainer });
      alert('应用初始化失败：关键界面元素缺失');
      return;
    }

    console.log('DOM 元素检查通过');

    // 调试：检查模块是否加载
    console.log('=== 模块加载检查 ===');
    console.log('window.copyUtils:', window.copyUtils);
    console.log('window.themePreview:', window.themePreview);
    console.log('window.getAllTemplates:', typeof window.getAllTemplates);
    console.log('window.getTemplateById:', typeof window.getTemplateById);

    // 检查订阅状态（非阻塞）
    try {
      await checkSubscriptionStatus();
    } catch (error) {
      console.error('订阅状态检查失败:', error);
    }

    // 检查授权状态（兼容旧的买断制）
    let isPro = false;
    try {
      isPro = licenseManager.isPro();
    } catch (error) {
      console.error('授权检查失败:', error);
    }

    // 加载保存的模板
    const savedTemplateId = localStorage.getItem('mdskill_template') || 'github-dark';

    try {
      currentTemplate = getTemplateById(savedTemplateId);

      // 如果保存的模板是专业版但用户不是专业版，回退到免费主题
      if (currentTemplate.isPremium && !isPro) {
        currentTemplate = getTemplateById('github-dark');
        localStorage.setItem('mdskill_template', 'github-dark');
      }

      // 暴露为全局变量
      window.currentTemplate = currentTemplate;

      applyTemplate(currentTemplate);
    } catch (error) {
      console.error('模板加载失败:', error);
      // 使用默认样式继续
    }

    // 初始化主题预览面板（确保 window.themePreview 已加载）
    try {
      if (window.themePreview && window.themePreview.initThemePreview) {
        window.themePreview.initThemePreview();
      }
    } catch (error) {
      console.error('主题预览初始化失败:', error);
    }

      // 初始化侧边栏 - 已完全移除
    // try {
    //   if (typeof Sidebar !== 'undefined') {
    //     window.sidebar = new Sidebar();
    //     console.log('侧边栏初始化成功');
    //   }
    // } catch (error) {
    //   console.error('侧边栏初始化失败:', error);
    // }

    // 验证 editor 元素是否仍然有效
    console.log('[Init] editor element:', editor);
    console.log('[Init] editor is null?', editor === null);
    if (!editor) {
      console.error('[CRITICAL] editor element lost!');
      editor = document.getElementById('editor');
      console.log('[CRITICAL] Re-fetched editor:', editor);
      if (!editor) {
        alert('编辑器元素丢失，应用无法正常工作');
        return;
      }
    }

    // 初始化搜索模块 - 已移除
    // try {
    //   if (typeof SearchModal !== 'undefined') {
    //     window.searchModal = new SearchModal();
    //     console.log('搜索模块初始化成功');
    //   }
    // } catch (error) {
    //   console.error('搜索模块初始化失败:', error);
    // }

    // 更新主题选择器，标记专业版主题
    try {
      updateThemeSelector(isPro);
    } catch (error) {
      console.error('主题选择器更新失败:', error);
    }

    // 更新 PDF 按钮状态
    try {
      updatePdfButtonState(isPro);
    } catch (error) {
      console.error('PDF 按钮状态更新失败:', error);
    }

    // 不自动加载上次打开的文件，让用户主动选择
    // 如果是通过双击文件打开，会通过 'file-opened' 事件加载

    // 初始预览
    try {
      updatePreview();
    } catch (error) {
      console.error('预览更新失败:', error);
    }

    // 注册 DOM 事件监听器
    try {
      registerDOMListeners();
      console.log('DOM 事件监听器注册成功');
    } catch (error) {
      console.error('DOM 事件监听器注册失败:', error);
    }

    // 注册 IPC 事件监听器
    try {
      registerIPCListeners();
      console.log('IPC 事件监听器注册成功');
    } catch (error) {
      console.error('IPC 事件监听器注册失败:', error);
    }

    console.log('=== 初始化完成 ===');
  } catch (error) {
    console.error('初始化过程中发生严重错误:', error);
    alert(`应用初始化失败: ${error.message}`);
  }
}

// 注册所有 DOM 事件监听器
function registerDOMListeners() {
  // 编辑器输入事件
  editor.addEventListener('input', () => {
    isModified = true;
    updateFileStatus();
    debouncedUpdatePreview();
  });

  // 工具栏按钮
  // 侧边栏切换按钮 - 已移除
  // const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
  // if (toggleSidebarBtn) {
  //   toggleSidebarBtn.addEventListener('click', () => {
  //     console.log('Toggle sidebar button clicked');
  //     if (window.sidebar) {
  //       console.log('Calling sidebar.toggle()');
  //       window.sidebar.toggle();
  //     } else {
  //       console.error('window.sidebar is not defined');
  //     }
  //   });
  // } else {
  //   console.error('toggleSidebarBtn not found');
  // }

  document.getElementById('newBtn').addEventListener('click', () => {
    ipcRenderer.send('new-window');
  });

  document.getElementById('openBtn').addEventListener('click', async () => {
    ipcRenderer.send('file-open');
  });

  document.getElementById('saveBtn').addEventListener('click', async () => {
    if (currentFilePath) {
      const result = await ipcRenderer.invoke('save-file', {
        filePath: currentFilePath,
        content: editor.value
      });
      if (result.success) {
        isModified = false;
        updateFileStatus();
      }
    } else {
      const result = await ipcRenderer.invoke('save-file-as', editor.value);
      if (result.success) {
        currentFilePath = result.filePath;
        isModified = false;
        updateFileStatus();
      }
    }
  });

  document.getElementById('togglePreviewBtn').addEventListener('click', () => {
    previewVisible = !previewVisible;
    if (previewVisible) {
      editorContainer.classList.remove('editor-only');
    } else {
      editorContainer.classList.add('editor-only');
    }
  });

  // AI 格式化按钮
  document.getElementById('aiFormatBtn').addEventListener('click', async () => {
    const config = await ipcRenderer.invoke('get-ai-config');
    if (!config || !config.apiKey) {
      ipcRenderer.send('open-ai-config');
    } else {
      await formatWithAI(config);
    }
  });

  // AI 取消按钮
  const aiCancelBtn = document.getElementById('aiCancelBtn');
  if (aiCancelBtn) {
    aiCancelBtn.addEventListener('click', () => {
      if (aiFormatAbortController) {
        aiFormatAbortController.abort();
      }
    });
  }

  // 模板选择器
  const templateSelect = document.getElementById('templateSelect');
  if (templateSelect) {
    templateSelect.addEventListener('change', (e) => {
      const templateId = e.target.value;
      const template = getTemplateById(templateId);
      const isPro = licenseManager.isPro();

      if (template.isPremium && !isPro) {
        showActivationPrompt('主题');
        e.target.value = currentTemplate.id;
        return;
      }

      currentTemplate = template;
      window.currentTemplate = currentTemplate;
      applyTemplate(currentTemplate);
      localStorage.setItem('mdskill_template', templateId);
      updatePreview();
    });
  }

  // 主题选择器（下拉列表）
  const themeSelector = document.getElementById('themeSelector');
  if (themeSelector) {
    const templates = getAllTemplates();
    templates.forEach(template => {
      const option = document.createElement('option');
      option.value = template.id;
      option.textContent = template.name + (template.isPremium ? ' 🔒' : '');
      if (template.id === currentTemplate.id) {
        option.selected = true;
      }
      themeSelector.appendChild(option);
    });

    themeSelector.addEventListener('change', async (e) => {
      const templateId = e.target.value;
      if (!templateId) return;

      const template = getTemplateById(templateId);

      if (template.isPremium) {
        const hasAccess = await checkFeatureAccess('premium_themes');
        if (!hasAccess) {
          showFeatureLockedPrompt('精美主题');
          e.target.value = currentTemplate.id;
          return;
        }
      }

      currentTemplate = template;
      window.currentTemplate = currentTemplate;
      applyTemplate(currentTemplate);
      localStorage.setItem('mdskill_template', templateId);
      updatePreview();
    });
  }

  // 主题切换按钮
  document.getElementById('themeBtn').addEventListener('click', () => {
    const currentId = currentTemplate.id;
    let newId;

    if (currentId === 'github-dark' || currentId === 'default') {
      newId = 'github-light';
    } else if (currentId === 'github-light') {
      newId = 'github-dark';
    } else {
      newId = 'github-dark';
    }

    currentTemplate = getTemplateById(newId);
    window.currentTemplate = currentTemplate;
    applyTemplate(currentTemplate);
    localStorage.setItem('mdskill_template', newId);
    updatePreview();
  });

  // Markdown 格式化按钮
  document.getElementById('boldBtn').addEventListener('click', () => {
    insertMarkdown('**', '**', 'bold text');
  });

  document.getElementById('italicBtn').addEventListener('click', () => {
    insertMarkdown('*', '*', 'italic text');
  });

  document.getElementById('codeBtn').addEventListener('click', () => {
    insertMarkdown('`', '`', 'code');
  });

  document.getElementById('linkBtn').addEventListener('click', () => {
    insertMarkdown('[', '](url)', 'link text');
  });

  // 导出 PDF 按钮
  document.getElementById('exportPdfBtn').addEventListener('click', async () => {
    const hasAccess = await checkFeatureAccess('pdf_export');
    if (!hasAccess) {
      showFeatureLockedPrompt('PDF 导出');
      return;
    }
    await exportToPDF();
  });

  // 复制到微信公众号按钮
  document.getElementById('copyWeChatBtn')?.addEventListener('click', async () => {
    const hasAccess = await checkFeatureAccess('wechat_copy');
    if (!hasAccess) {
      showFeatureLockedPrompt('复制到微信公众号');
      return;
    }

    if (!window.wechatRenderer) {
      alert('微信渲染器未加载，请刷新页面重试');
      return;
    }

    try {
      const markdown = editor.value;
      if (!markdown || markdown.trim() === '') {
        window.copyUtils.showToast('编辑器内容为空', 'error');
        return;
      }

      const wechatHTML = window.wechatRenderer.renderMarkdownForWeChat(markdown, currentTemplate);
      const success = await window.copyUtils.writeHTMLToClipboard(wechatHTML, markdown);

      if (success) {
        window.copyUtils.showToast('已复制到剪贴板，可直接粘贴到微信公众号编辑器', 'success');
      } else {
        window.copyUtils.showToast('复制失败，请重试', 'error');
      }
    } catch (error) {
      console.error('WeChat copy error:', error);
      window.copyUtils.showToast('复制失败: ' + error.message, 'error');
    }
  });

  // 复制到博客按钮
  document.getElementById('copyBlogBtn')?.addEventListener('click', async () => {
    const hasAccess = await checkFeatureAccess('blog_copy');
    if (!hasAccess) {
      showFeatureLockedPrompt('复制到博客');
      return;
    }

    if (!window.copyUtils) {
      alert('复制功能模块未加载，请刷新页面重试');
      return;
    }

    try {
      const success = await window.copyUtils.copyForBlog(preview, currentTemplate);
      if (success) {
        window.copyUtils.showToast('已复制到剪贴板，可粘贴到知乎、简书等博客平台', 'success');
      } else {
        window.copyUtils.showToast('复制失败，请重试', 'error');
      }
    } catch (error) {
      console.error('Blog copy error:', error);
      window.copyUtils.showToast('复制失败: ' + error.message, 'error');
    }
  });

  // 复制 HTML 源码按钮
  document.getElementById('copyHTMLBtn')?.addEventListener('click', async () => {
    const hasAccess = await checkFeatureAccess('html_export');
    if (!hasAccess) {
      showFeatureLockedPrompt('复制 HTML 源码');
      return;
    }

    if (!window.copyUtils) {
      alert('复制功能模块未加载，请刷新页面重试');
      return;
    }

    try {
      const html = preview.innerHTML;
      const success = await window.copyUtils.copyHTMLSource(html, currentTemplate);
      if (success) {
        window.copyUtils.showToast('HTML 源码已复制到剪贴板', 'success');
      } else {
        window.copyUtils.showToast('复制失败，请重试', 'error');
      }
    } catch (error) {
      console.error('HTML copy error:', error);
      window.copyUtils.showToast('复制失败: ' + error.message, 'error');
    }
  });

  // 键盘快捷键
  editor.addEventListener('keydown', (e) => {
    // Tab 键插入空格
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
    }

    // Cmd+B 加粗
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      insertMarkdown('**', '**', 'bold text');
    }

    // Cmd+I 斜体
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault();
      insertMarkdown('*', '*', 'italic text');
    }

    // Cmd+K 链接
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      insertMarkdown('[', '](url)', 'link text');
    }

    // Cmd+Shift+W 复制到微信
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'W') {
      e.preventDefault();
      document.getElementById('copyWeChatBtn')?.click();
    }

    // Cmd+Shift+B 复制到博客
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'B') {
      e.preventDefault();
      document.getElementById('copyBlogBtn')?.click();
    }

    // Cmd+Shift+H 复制 HTML
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'H') {
      e.preventDefault();
      document.getElementById('copyHTMLBtn')?.click();
    }
  });

  // 编辑器和预览区域拖拽调整大小
  const resizeHandle = document.getElementById('editorResizeHandle');
  const editorPane = document.getElementById('editorPane');
  const container = document.querySelector('.editor-container');

  if (resizeHandle && editorPane && container) {
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startWidth = editorPane.offsetWidth;
      resizeHandle.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startX;
      const newWidth = startWidth + deltaX;
      const containerWidth = container.offsetWidth;
      const minWidth = 200;
      const maxWidth = containerWidth - 200;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        const percentage = (newWidth / containerWidth) * 100;
        editorPane.style.width = percentage + '%';
        resizeHandle.style.left = percentage + '%';
      }
    });

    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        resizeHandle.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        // 保存编辑器宽度到 localStorage
        const percentage = (editorPane.offsetWidth / container.offsetWidth) * 100;
        localStorage.setItem('mdskill_editor_width', percentage.toString());
      }
    });

    // 加载保存的编辑器宽度
    const savedWidth = localStorage.getItem('mdskill_editor_width');
    if (savedWidth) {
      editorPane.style.width = savedWidth + '%';
      resizeHandle.style.left = savedWidth + '%';
    }
  }
}

// 注册所有 IPC 事件监听器
function registerIPCListeners() {
  // 文件操作
  ipcRenderer.on('file-new', () => {
    document.getElementById('newBtn').click();
  });

  ipcRenderer.on('file-save', () => {
    document.getElementById('saveBtn').click();
  });

  ipcRenderer.on('file-save-as', async () => {
    const result = await ipcRenderer.invoke('save-file-as', editor.value);
    if (result.success) {
      currentFilePath = result.filePath;
      isModified = false;
      updateFileStatus();
    }
  });

  ipcRenderer.on('file-opened', (event, { path, content }) => {
    console.log('[file-opened] Event received');
    console.log('[file-opened] path:', path);
    console.log('[file-opened] content length:', content?.length);
    console.log('[file-opened] editor element:', editor);

    if (!editor) {
      console.error('ERROR: editor element is null!');
      return;
    }

    editor.value = content;
    currentFilePath = path;
    isModified = false;
    updateFileStatus();
    updatePreview();
    console.log('[file-opened] File loaded successfully');
  });

  // 从侧边栏加载文件
  ipcRenderer.on('file-loaded', (event, { filePath, content }) => {
    editor.value = content;
    currentFilePath = filePath;
    isModified = false;
    updateFileStatus();
    updatePreview();
  });

  ipcRenderer.on('toggle-preview', () => {
    document.getElementById('togglePreviewBtn').click();
  });

  // PDF 导出
  ipcRenderer.on('export-pdf', async () => {
    const isPro = licenseManager.isPro();
    if (!isPro) {
      showActivationPrompt('PDF 导出');
      return;
    }
    await exportToPDF();
  });

  // 复制功能
  ipcRenderer.on('copy-wechat', () => {
    document.getElementById('copyWeChatBtn')?.click();
  });

  ipcRenderer.on('copy-blog', () => {
    document.getElementById('copyBlogBtn')?.click();
  });

  ipcRenderer.on('copy-html', () => {
    document.getElementById('copyHTMLBtn')?.click();
  });

  // AI 格式化
  ipcRenderer.on('start-ai-format', async () => {
    const config = await ipcRenderer.invoke('get-ai-config');
    if (config) {
      await formatWithAI(config);
    }
  });
}


// 检查订阅状态
async function checkSubscriptionStatus() {
  try {
    const result = await ipcRenderer.invoke('get-subscription-status');
    if (result.success) {
      const status = result.data;
      console.log('[Subscription] Status:', status);

      // 检查是否需要显示续费提醒
      const shouldRemind = await ipcRenderer.invoke('should-show-renewal-reminder');
      if (shouldRemind) {
        showRenewalReminder(status);
      }

      // 如果已过期，显示过期提示
      if (status.isExpired) {
        showExpiredNotice(status);
      }
    }
  } catch (error) {
    console.error('[Subscription] Check error:', error);
  }
}

// 显示续费提醒
function showRenewalReminder(status) {
  const message = `您的会员将在 ${status.daysLeft} 天后到期，续费仅需 19元/月`;

  if (confirm(`⏰ 会员即将到期\n\n${message}\n\n是否立即续费？`)) {
    openSubscriptionWindow();
  }

  // 标记提醒已显示
  ipcRenderer.invoke('mark-reminder-shown');
}

// 显示过期提示
function showExpiredNotice(status) {
  const message = '您的会员已过期，续费后立即恢复所有功能\n\n月会员：19元/月';

  if (confirm(`😢 会员已过期\n\n${message}\n\n是否立即续费？`)) {
    openSubscriptionWindow();
  }
}

// 打开订阅管理窗口
function openSubscriptionWindow() {
  ipcRenderer.send('open-subscription');
}

// 应用模板
function applyTemplate(template) {
  const css = generateTemplateCSS(template.styles);
  document.getElementById('dynamicStyles').textContent = css;

  // 判断是亮色还是暗色主题
  const isLight = ['#ffffff', '#fafafa', '#fefdf8', '#fef3c7'].some(
    color => template.styles.backgroundColor.toLowerCase() === color.toLowerCase()
  );

  // 更新编辑器背景色和文字颜色
  const editorPane = document.querySelector('.editor-pane');
  const editorTextarea = document.getElementById('editor');

  if (isLight) {
    editorPane.style.background = '#fafafa';
    editorTextarea.style.color = '#1a1a1a';
    editorTextarea.style.caretColor = '#1a1a1a';
  } else {
    editorPane.style.background = '#1e1e1e';
    editorTextarea.style.color = '#d4d4d4';
    editorTextarea.style.caretColor = '#d4d4d4';
  }

  // 更新预览背景色
  document.querySelector('.preview-pane').style.background = template.styles.backgroundColor;
}

// 暴露为全局函数供 theme-preview.js 使用
window.applyTemplate = applyTemplate;
window.currentTemplate = currentTemplate;

// 更新预览（防抖优化）
function updatePreview() {
  const markdown = editor.value;
  const html = marked.parse(markdown);

  // 只在内容真正变化时才更新 DOM
  if (preview.innerHTML !== html) {
    requestAnimationFrame(() => {
      preview.innerHTML = html;
    });
  }
}

// 防抖更新预览
function debouncedUpdatePreview() {
  if (updateTimer) {
    clearTimeout(updateTimer);
  }

  updateTimer = setTimeout(() => {
    updatePreview();
  }, 300); // 300ms 延迟，减少抖动
}

// 更新文件状态
function updateFileStatus() {
  if (currentFilePath) {
    const fileName = currentFilePath.split('/').pop();
    fileStatus.textContent = fileName + (isModified ? ' •' : '');
  } else {
    fileStatus.textContent = 'Untitled' + (isModified ? ' •' : '');
  }
}

// 使用 AI 格式化文本
let aiFormatAbortController = null;

async function formatWithAI(config) {
  const content = editor.value;

  if (!content.trim()) {
    alert('编辑器内容为空');
    return;
  }

  // 创建 AbortController 用于取消请求
  aiFormatAbortController = new AbortController();

  // 显示进度提示
  const progressOverlay = document.getElementById('aiProgressOverlay');
  if (progressOverlay) {
    progressOverlay.style.display = 'flex';
  }

  // 禁用 MD 按钮
  const aiBtn = document.getElementById('aiFormatBtn');
  aiBtn.disabled = true;

  try {
    let formattedText;

    if (config.provider === 'openai') {
      formattedText = await formatWithOpenAI(config, content, aiFormatAbortController.signal);
    } else if (config.provider === 'anthropic') {
      formattedText = await formatWithAnthropic(config, content, aiFormatAbortController.signal);
    } else if (config.provider === 'deepseek' || config.provider === 'zhipu' || config.provider === 'moonshot') {
      formattedText = await formatWithOpenAICompatible(config, content, aiFormatAbortController.signal);
    } else if (config.provider === 'custom') {
      formattedText = await formatWithCustomAPI(config, content, aiFormatAbortController.signal);
    }

    if (formattedText) {
      editor.value = formattedText;
      isModified = true;
      updateFileStatus();
      updatePreview();
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('AI 格式化已取消');
    } else {
      console.error('AI 格式化失败:', error);
      alert('AI 格式化失败: ' + error.message);
    }
  } finally {
    // 隐藏进度提示
    if (progressOverlay) {
      progressOverlay.style.display = 'none';
    }
    aiBtn.disabled = false;
    aiFormatAbortController = null;
  }
}

// OpenAI API 调用
async function formatWithOpenAI(config, content, signal) {
  const endpoint = config.endpoint || 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey}`,
    ...(config.customHeaders || {})
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    signal: signal,
    body: JSON.stringify({
      model: config.model || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: config.systemPrompt || '你是一个 Markdown 格式化专家。将用户提供的文本转换为格式良好的 Markdown 文档。保持原意，优化排版，添加适当的标题、列表、强调等格式。只返回格式化后的 Markdown 文本，不要添加任何解释。'
        },
        {
          role: 'user',
          content: content
        }
      ],
      temperature: config.temperature !== undefined ? config.temperature : 0.3,
      max_tokens: config.maxTokens || 4096
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API 请求失败');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Anthropic API 调用
async function formatWithAnthropic(config, content, signal) {
  const endpoint = config.endpoint || 'https://api.anthropic.com/v1/messages';
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': config.apiKey,
    'anthropic-version': '2023-06-01',
    ...(config.customHeaders || {})
  };

  const systemPrompt = config.systemPrompt || '你是一个 Markdown 格式化专家。将以下文本转换为格式良好的 Markdown 文档。保持原意，优化排版，添加适当的标题、列表、强调等格式。只返回格式化后的 Markdown 文本，不要添加任何解释。';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    signal: signal,
    body: JSON.stringify({
      model: config.model || 'claude-opus-4-20250514',
      max_tokens: config.maxTokens || 4096,
      messages: [
        {
          role: 'user',
          content: `${systemPrompt}\n\n${content}`
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API 请求失败');
  }

  const data = await response.json();
  return data.content[0].text;
}

// OpenAI 兼容 API 调用（DeepSeek、智谱、Kimi 等）
async function formatWithOpenAICompatible(config, content, signal) {
  const endpoint = config.endpoint || 'https://api.deepseek.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey}`,
    ...(config.customHeaders || {})
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    signal: signal,
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: config.systemPrompt || '你是一个 Markdown 格式化专家。将用户提供的文本转换为格式良好的 Markdown 文档。保持原意，优化排版，添加适当的标题、列表、强调等格式。只返回格式化后的 Markdown 文本，不要添加任何解释。'
        },
        {
          role: 'user',
          content: content
        }
      ],
      temperature: config.temperature !== undefined ? config.temperature : 0.3,
      max_tokens: config.maxTokens || 4096
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || error.message || 'API 请求失败');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 自定义 API 调用
async function formatWithCustomAPI(config, content, signal) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey}`,
    ...(config.customHeaders || {})
  };

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: headers,
    signal: signal,
    body: JSON.stringify({
      model: config.model || 'custom',
      messages: [
        {
          role: 'system',
          content: config.systemPrompt || '你是一个 Markdown 格式化专家。将用户提供的文本转换为格式良好的 Markdown 文档。保持原意，优化排版，添加适当的标题、列表、强调等格式。只返回格式化后的 Markdown 文本，不要添加任何解释。'
        },
        {
          role: 'user',
          content: content
        }
      ],
      temperature: config.temperature !== undefined ? config.temperature : 0.3,
      max_tokens: config.maxTokens || 4096
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || error.message || 'API 请求失败');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 更新主题选择器，标记专业版主题
function updateThemeSelector(isPro) {
  const select = document.getElementById('templateSelect');

  // 如果选择器不存在（已被按钮替换），则跳过
  if (!select) {
    return;
  }

  const allTemplates = getAllTemplates();

  // 清空现有选项
  select.innerHTML = '';

  // 重新生成选项
  allTemplates.forEach(template => {
    const option = document.createElement('option');
    option.value = template.id;

    if (template.isPremium) {
      option.textContent = `${template.icon} ${template.name} 🔒`;
      if (!isPro) {
        option.disabled = true;
        option.style.color = '#888';
      }
    } else {
      option.textContent = `${template.icon} ${template.name}`;
    }

    select.appendChild(option);
  });

  // 设置当前值
  if (currentTemplate) {
    select.value = currentTemplate.id;
  }
}

// 更新 PDF 按钮状态
function updatePdfButtonState(isPro) {
  const pdfBtn = document.getElementById('exportPdfBtn');
  if (!isPro) {
    pdfBtn.style.opacity = '0.5';
    pdfBtn.title = '导出 PDF (专业版功能 🔒)';
  } else {
    pdfBtn.style.opacity = '1';
    pdfBtn.title = '导出 PDF (Cmd+E)';
  }
}

// Markdown 格式化按钮

// 检查功能权限（统一的权限检查函数）
async function checkFeatureAccess(featureName) {
  // 先检查订阅状态
  const result = await ipcRenderer.invoke('check-feature-access', featureName);

  if (result.hasAccess) {
    return true;
  }

  // 如果订阅无权限，再检查旧的买断授权（兼容性）
  const isPro = licenseManager.isPro();
  if (isPro) {
    return true;
  }

  // 都没有权限，显示提示
  return false;
}

// 显示功能限制提示
function showFeatureLockedPrompt(featureName) {
  const message = `🔒 ${featureName}是会员专享功能\n\n月会员：19元/月\n新用户享7天免费试用`;

  if (confirm(`${message}\n\n是否查看会员权益？`)) {
    openSubscriptionWindow();
  }
}

// 插入 Markdown 语法
function insertMarkdown(before, after, placeholder) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selectedText = editor.value.substring(start, end);
  const text = selectedText || placeholder;
  const newText = before + text + after;

  editor.value = editor.value.substring(0, start) + newText + editor.value.substring(end);

  // 设置光标位置
  if (selectedText) {
    editor.selectionStart = start;
    editor.selectionEnd = start + newText.length;
  } else {
    editor.selectionStart = start + before.length;
    editor.selectionEnd = start + before.length + text.length;
  }

  editor.focus();
  isModified = true;
  updateFileStatus();
  updatePreview();
}

// 导出 PDF 函数
async function exportToPDF() {
  console.log('PDF export triggered');

  try {
    // 获取当前文件名作为默认 PDF 名称
    let defaultName = 'document.pdf';
    if (currentFilePath) {
      const fileName = currentFilePath.split('/').pop().replace(/\.(md|markdown|txt)$/i, '');
      defaultName = `${fileName}.pdf`;
    }
    console.log('Default PDF name:', defaultName);

    // 获取预览内容
    const preview = document.getElementById('preview');
    if (!preview) {
      throw new Error('Preview element not found');
    }

    // 获取当前主题的 CSS
    const themeStyle = document.getElementById('theme-style');
    const themeCSS = themeStyle ? themeStyle.textContent : '';

    // 获取 github-markdown.css 的内容
    const markdownStyleLink = document.querySelector('link[href*="github-markdown"]');
    let markdownCSS = '';
    if (markdownStyleLink) {
      try {
        const response = await fetch(markdownStyleLink.href);
        markdownCSS = await response.text();
      } catch (e) {
        console.warn('Failed to load markdown CSS:', e);
      }
    }

    // 构建完整的 HTML 文档
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    /* GitHub Markdown CSS */
    ${markdownCSS}

    /* 主题样式 */
    ${themeCSS}

    /* PDF 打印样式 */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      background: white;
    }

    .markdown-body {
      padding: 0;
      max-width: 100%;
      overflow: visible;
    }

    /* 分页控制 */
    h1, h2, h3 {
      page-break-after: avoid;
      break-after: avoid;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    pre, table, img, blockquote {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    p {
      orphans: 3;
      widows: 3;
    }

    li {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    pre code {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  </style>
</head>
<body>
  <div class="markdown-body">
    ${preview.innerHTML}
  </div>
</body>
</html>
    `;

    console.log('HTML content prepared, length:', htmlContent.length);

    // 调用主进程导出 PDF
    const result = await ipcRenderer.invoke('export-pdf', {
      defaultPath: defaultName,
      htmlContent: htmlContent
    });
    console.log('Export result:', result);

    if (result.success) {
      console.log('PDF exported successfully:', result.filePath);
      alert(`PDF 导出成功！\n保存位置: ${result.filePath}`);
    } else if (result.canceled) {
      console.log('PDF export canceled by user');
    } else {
      console.error('Failed to export PDF:', result.error);
      alert(`PDF 导出失败: ${result.error}`);
    }
  } catch (error) {
    console.error('Error during PDF export:', error);
    alert(`PDF 导出出错: ${error.message}`);
  }
}

// 显示激活提示
function showActivationPrompt(featureName) {
  const deviceId = licenseManager.getDeviceFingerprint();

  const message = `${featureName}是专业版功能 🔒\n\n` +
    `您的设备指纹：${deviceId}\n\n` +
    `请联系开发者获取授权码：\n` +
    `微信: AIPMAndy\n\n` +
    `获取授权码后，请在"帮助"菜单中选择"激活专业版"进行激活。`;

  alert(message);
}

// 初始化应用
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
