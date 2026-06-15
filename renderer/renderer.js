const { ipcRenderer } = require('electron');
const { marked } = require('marked');
const hljs = require('highlight.js');
const katex = require('katex');
const licenseManager = require('../license-manager');

// 模板函数包装 - 从全局 window 对象获取
function getRegisteredTemplates() {
  return window.getAllTemplates ? window.getAllTemplates() : [];
}

function getRegisteredTemplateById(id) {
  return window.getTemplateById ? window.getTemplateById(id) : null;
}

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
  breaks: false,  // 关闭自动换行转 <br>，避免多余空行
  gfm: true,
  pedantic: false
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

  // 先获取高亮后的代码（不带行号）
  const highlighted = originalCode(code, language);

  // 提取 <code> 标签内的内容
  const codeMatch = highlighted.match(/<code[^>]*>([\s\S]*)<\/code>/);
  if (!codeMatch) {
    return highlighted;
  }

  const highlightedCode = codeMatch[1];
  const lines = highlightedCode.split('\n');

  // 给已高亮的代码添加行号
  const numberedLines = lines.map((line, index) => {
    const lineNum = index + 1;
    return `<span class="code-line" data-line="${lineNum}"><span class="line-number">${lineNum}</span>${line}</span>`;
  }).join('\n');

  // 替换原来的代码内容
  return highlighted
    .replace(/<code[^>]*>[\s\S]*<\/code>/, `<code>${numberedLines}</code>`)
    .replace(/<pre>/, '<pre class="code-block-with-lines">');
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
let editorFontSize = 16; // 默认字体大小
let lastSaveTime = null; // 最后保存时间

// 初始化
async function init() {
  try {
    // 初始化 DOM 元素引用
    editor = document.getElementById('editor');
    preview = document.getElementById('preview');
    editorContainer = document.querySelector('.editor-container');
    fileStatus = document.getElementById('fileStatus');

    updateLocalizedChrome();

    // 检查关键 DOM 元素
    if (!editor || !preview || !editorContainer) {
      console.error('关键 DOM 元素缺失');
      const msg = window.i18nHelpers ? window.i18nHelpers.t('messages.initFailed') : 'App initialization failed';
      if (window.toast) {
        toast.error(msg);
      } else {
        alert(msg);
      }
      return;
    }

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
      currentTemplate = getRegisteredTemplateById(savedTemplateId);

      // 如果保存的模板是专业版但用户不是专业版，回退到免费主题
      if (currentTemplate.isPremium && !isPro) {
        currentTemplate = getRegisteredTemplateById('github-dark');
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
        const msg = window.i18nHelpers ? window.i18nHelpers.t('messages.editorLost') : 'Editor element lost';
        if (window.toast) {
          toast.error(msg);
        } else {
          alert(msg);
        }
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

    // 初始预览 - 延迟执行确保 DOM 完全就绪
    try {
      requestAnimationFrame(() => {
        updatePreview();
      });
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
    } catch (error) {
      console.error('IPC 事件监听器注册失败:', error);
    }

    // 初始化文档搜索功能
    if (typeof initDocumentSearch === 'function') {
      initDocumentSearch();
    }

    // 初始化查找/替换功能
    if (typeof FindReplace !== 'undefined') {
      window.findReplace = new FindReplace(editor);
      console.log('查找/替换功能初始化成功');
    }

    // 初始化行号功能
    if (typeof LineNumbers !== 'undefined') {
      const editorPane = document.querySelector('.editor-pane');
      window.lineNumbers = new LineNumbers(editor, editorPane);
      window.lineNumbers.restore();
      console.log('行号功能初始化成功');
    }

    // 初始化命令面板
    if (typeof CommandPalette !== 'undefined') {
      window.commandPalette = new CommandPalette();
      console.log('命令面板初始化成功');
    }

    // 恢复代码块行号设置
    const codeBlockLinesEnabled = localStorage.getItem('codeBlockLinesEnabled');
    if (codeBlockLinesEnabled === 'false') {
      preview.classList.add('code-block-lines-disabled');
    }

    // 初始化字体大小设置
    initFontSize();

    // 初始化状态栏
    initStatusBar();

    // 通知主进程渲染进程已完全就绪
    console.log('[init] Renderer is ready, notifying main process');
    const windowId = await ipcRenderer.invoke('get-window-id');
    ipcRenderer.send(`renderer-ready-${windowId}`);
  } catch (error) {
    console.error('初始化过程中发生严重错误:', error);
    if (window.toast) {
      toast.error(window.i18nHelpers.t('alerts.initFailed', {error: error.message}));
    } else {
      window.i18nHelpers.showAlert('alerts.initFailed', {error: error.message});
    }
  }
}

// 注册所有 DOM 事件监听器
function registerDOMListeners() {
  // 保存编辑器状态的防抖函数
  let saveStateTimer = null;
  const saveEditorState = () => {
    if (saveStateTimer) {
      clearTimeout(saveStateTimer);
    }
    saveStateTimer = setTimeout(() => {
      if (currentFilePath && editor) {
        try {
          const session = JSON.parse(localStorage.getItem('mdskill.session.v1') || '{}');
          session.editorState = {
            filePath: currentFilePath,
            cursorPosition: editor.selectionStart,
            scrollTop: editor.scrollTop
          };
          localStorage.setItem('mdskill.session.v1', JSON.stringify(session));
        } catch (e) {
          console.error('Failed to save editor state:', e);
        }
      }
    }, 1000); // 1秒防抖
  };

  // 编辑器输入事件
  editor.addEventListener('input', () => {
    isModified = true;
    updateFileStatus();
    debouncedUpdatePreview();
    updateWordCount(); // 更新字数统计
    saveEditorState(); // 保存编辑器状态
  });

  // 监听光标位置变化
  editor.addEventListener('selectionchange', saveEditorState);
  editor.addEventListener('click', saveEditorState);
  editor.addEventListener('keyup', saveEditorState);

  // 监听滚动事件
  editor.addEventListener('scroll', saveEditorState);

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
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;

    try {
      if (currentFilePath) {
        const result = await ipcRenderer.invoke('save-file', {
          filePath: currentFilePath,
          content: editor.value
        });
        if (result.success) {
          isModified = false;
          lastSaveTime = Date.now(); // 记录保存时间
          updateFileStatus();
          updateStatusBar(); // 更新状态栏
          if (window.toast) {
            toast.success('文件已保存');
          }
        } else {
          if (window.toast) {
            toast.error('保存失败：' + (result.error || '未知错误'));
          }
        }
      } else {
        const result = await ipcRenderer.invoke('save-file-as', editor.value);
        if (result.success) {
          currentFilePath = result.filePath;
          isModified = false;
          lastSaveTime = Date.now(); // 记录保存时间
          updateFileStatus();
          updateStatusBar(); // 更新状态栏
          if (window.toast) {
            toast.success('文件已保存');
          }
        } else if (result.error) {
          if (window.toast) {
            toast.error('保存失败：' + result.error);
          }
        }
      }
    } catch (error) {
      console.error('保存文件时出错:', error);
      if (window.toast) {
        toast.error('保存失败：' + error.message);
      }
    } finally {
      saveBtn.disabled = false;
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
      const template = getRegisteredTemplateById(templateId);
      const isPro = licenseManager.isPro();

      if (template.isPremium && !isPro) {
        showActivationPrompt('themes');
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
    const templates = getRegisteredTemplates();
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

      const template = getRegisteredTemplateById(templateId);

      if (template.isPremium) {
        const hasAccess = await checkFeatureAccess('premium_themes');
        if (!hasAccess) {
          showFeatureLockedPrompt('premiumThemes');
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
    // 打开主题预览面板
    if (window.themePreview && window.themePreview.openThemePreview) {
      window.themePreview.openThemePreview(currentTemplate.id);
    } else {
      console.error('主题预览模块未加载');
    }
  });

  // 搜索和大纲按钮
  const searchBtn = document.getElementById('searchBtn');
  const outlineBtn = document.getElementById('outlineBtn');

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      if (window.documentSearch) {
        window.documentSearch.show('search');
      }
    });
  }

  if (outlineBtn) {
    outlineBtn.addEventListener('click', () => {
      if (window.documentSearch) {
        window.documentSearch.show('outline');
      }
    });
  }

  // Line numbers toggle
  const lineNumbersBtn = document.getElementById('lineNumbersBtn');
  if (lineNumbersBtn) {
    lineNumbersBtn.addEventListener('click', () => {
      if (window.lineNumbers) {
        const enabled = window.lineNumbers.toggle();
        lineNumbersBtn.classList.toggle('active', enabled);
      }
    });

    // Restore button state
    const saved = localStorage.getItem('lineNumbersEnabled');
    if (saved === 'true') {
      lineNumbersBtn.classList.add('active');
    }
  }

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
      showFeatureLockedPrompt('pdfExport');
      return;
    }
    await exportToPDF();
  });

  // 复制到微信公众号按钮
  document.getElementById('copyWeChatBtn')?.addEventListener('click', async () => {
    const hasAccess = await checkFeatureAccess('wechat_copy');
    if (!hasAccess) {
      showFeatureLockedPrompt('wechatCopy');
      return;
    }

    if (!window.wechatRenderer) {
      const msg = window.i18nHelpers ? window.i18nHelpers.t('messages.wechatRendererNotLoaded') : 'WeChat renderer not loaded';
      if (window.toast) {
        toast.error(msg);
      } else {
        alert(msg);
      }
      return;
    }

    try {
      const markdown = editor.value;
      if (!markdown || markdown.trim() === '') {
        window.copyUtils.showToast(window.i18nHelpers.t('toast.editorEmpty'), 'error');
        return;
      }

      const wechatHTML = window.wechatRenderer.renderMarkdownForWeChat(markdown, currentTemplate);
      const themeName = currentTemplate.name || 'Unknown';

      // Show preview modal
      const previewModal = new window.WeChatPreviewModal();
      const confirmed = await previewModal.show(wechatHTML, themeName);

      if (!confirmed) {
        return; // User canceled
      }

      // User confirmed, proceed with copy
      const success = await window.copyUtils.writeHTMLToClipboard(wechatHTML, markdown);

      if (success) {
        const message = window.i18nHelpers
          ? window.i18nHelpers.t('toast.copyWechatSuccessWithTheme', { theme: themeName })
          : `已使用「${themeName}」主题复制到微信`;
        window.copyUtils.showToast(message, 'success');
      } else {
        window.copyUtils.showToast(window.i18nHelpers.t('toast.copyFailed'), 'error');
      }
    } catch (error) {
      console.error('WeChat copy error:', error);
      window.copyUtils.showToast(window.i18nHelpers.t('toast.copyFailedError', {error: error.message}), 'error');
    }
  });

  // 复制到博客按钮
  document.getElementById('copyBlogBtn')?.addEventListener('click', async () => {
    const hasAccess = await checkFeatureAccess('blog_copy');
    if (!hasAccess) {
      showFeatureLockedPrompt('blogCopy');
      return;
    }

    if (!window.copyUtils) {
      if (window.toast) {
        toast.error(window.i18nHelpers.t('alerts.copyModuleNotLoaded'));
      } else {
        window.i18nHelpers.showAlert('alerts.copyModuleNotLoaded');
      }
      return;
    }

    try {
      const success = await window.copyUtils.copyForBlog(preview, currentTemplate);
      if (success) {
        window.copyUtils.showToast(window.i18nHelpers.t('toast.copyBlogSuccess'), 'success');
      } else {
        window.copyUtils.showToast(window.i18nHelpers.t('toast.copyFailed'), 'error');
      }
    } catch (error) {
      console.error('Blog copy error:', error);
      window.copyUtils.showToast(window.i18nHelpers.t('toast.copyFailedError', {error: error.message}), 'error');
    }
  });

  // 复制 HTML 源码按钮
  document.getElementById('copyHTMLBtn')?.addEventListener('click', async () => {
    const hasAccess = await checkFeatureAccess('html_export');
    if (!hasAccess) {
      showFeatureLockedPrompt('htmlExport');
      return;
    }

    if (!window.copyUtils) {
      if (window.toast) {
        toast.error(window.i18nHelpers.t('alerts.copyModuleNotLoaded'));
      } else {
        window.i18nHelpers.showAlert('alerts.copyModuleNotLoaded');
      }
      return;
    }

    try {
      const html = preview.innerHTML;
      const success = await window.copyUtils.copyHTMLSource(html, currentTemplate);
      if (success) {
        window.copyUtils.showToast(window.i18nHelpers.t('toast.copyHtmlSuccess'), 'success');
      } else {
        window.copyUtils.showToast(window.i18nHelpers.t('toast.copyFailed'), 'error');
      }
    } catch (error) {
      console.error('HTML copy error:', error);
      window.copyUtils.showToast(window.i18nHelpers.t('toast.copyFailedError', {error: error.message}), 'error');
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

  // Add paste event listener for image pasting
  editor.addEventListener('paste', async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    // Check if clipboard contains an image
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();

        // Get image as blob
        const blob = item.getAsFile();
        if (!blob) continue;

        // Convert blob to buffer
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Show uploading toast
        const uploadingMsg = window.i18nHelpers
          ? window.i18nHelpers.t('toast.uploadingImage')
          : 'Uploading image...';
        if (window.toast) {
          toast.info(uploadingMsg);
        }

        try {
          // Save image via IPC
          const result = await ipcRenderer.invoke('save-image', {
            imageBuffer: buffer,
            currentFilePath: currentFilePath
          });

          if (result.success) {
            // Insert markdown image syntax at cursor position
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const imageMarkdown = `![image](${result.path})`;

            editor.value = editor.value.substring(0, start) + imageMarkdown + editor.value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + imageMarkdown.length;

            // Trigger preview update
            updatePreview();
            setModified(true);

            // Show success message
            const successMsg = window.i18nHelpers
              ? window.i18nHelpers.t('toast.imageUploaded')
              : 'Image uploaded successfully';
            if (window.toast) {
              toast.success(successMsg);
            }
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          const errorMsg = window.i18nHelpers
            ? window.i18nHelpers.t('toast.imageUploadFailed', { error: error.message })
            : `Image upload failed: ${error.message}`;
          if (window.toast) {
            toast.error(errorMsg);
          }
        }

        break;
      }
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

    // 重置缓存并立即更新预览
    lastMarkdown = '';
    requestAnimationFrame(() => {
      updatePreview();
    });

    // 恢复编辑器状态（光标位置和滚动位置）
    const session = localStorage.getItem('mdskill.session.v1');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        const editorState = sessionData.editorState;
        if (editorState && editorState.filePath === path) {
          // 恢复光标位置
          if (editorState.cursorPosition !== undefined) {
            editor.setSelectionRange(editorState.cursorPosition, editorState.cursorPosition);
          }
          // 恢复滚动位置
          if (editorState.scrollTop !== undefined) {
            editor.scrollTop = editorState.scrollTop;
          }
        }
      } catch (e) {
        console.error('Failed to restore editor state:', e);
      }
    }

    console.log('[file-opened] File loaded successfully');

    // 开始监听文件外部修改
    ipcRenderer.send('start-watching-file', path);
  });

  // 从侧边栏加载文件
  ipcRenderer.on('file-loaded', (event, { filePath, content }) => {
    editor.value = content;
    currentFilePath = filePath;
    isModified = false;
    updateFileStatus();

    // 重置缓存并更新预览
    lastMarkdown = '';
    updatePreview();

    // 开始监听文件外部修改
    ipcRenderer.send('start-watching-file', filePath);
  });

  // 文件外部修改通知
  ipcRenderer.on('file-changed-externally', (event, { path, content }) => {
    console.log('[file-changed-externally] File changed:', path);

    // 如果当前文件有未保存的修改，询问用户
    if (isModified) {
      const message = window.i18nHelpers
        ? window.i18nHelpers.t('messages.fileChangedExternally')
        : 'This file has been modified externally. You have unsaved changes. Do you want to reload?';

      if (window.toast) {
        window.toast.warning(message, {
          duration: 0, // 不自动消失
          action: {
            text: 'Reload',
            onClick: () => {
              editor.value = content;
              isModified = false;
              updateFileStatus();
              lastMarkdown = '';
              updatePreview();
              if (window.toast) {
                const reloadMsg = window.i18nHelpers?.t('messages.fileReloaded') || 'File reloaded';
                window.toast.success(reloadMsg);
              }
            }
          }
        });
      } else {
        const shouldReload = confirm(message);
        if (shouldReload) {
          editor.value = content;
          isModified = false;
          updateFileStatus();
          lastMarkdown = '';
          updatePreview();
        }
      }
    } else {
      // 没有未保存的修改，直接刷新
      editor.value = content;
      isModified = false;
      updateFileStatus();
      lastMarkdown = '';
      updatePreview();

      // 提示用户文件已刷新
      if (window.toast) {
        const message = window.i18nHelpers?.t('messages.fileReloadedAuto') || 'File reloaded (modified externally)';
        window.toast.info(message, { duration: 3000 });
      }

      console.log('[file-changed-externally] File reloaded automatically');
    }
  });

  // 文件外部删除通知
  ipcRenderer.on('file-deleted-externally', (event, { path }) => {
    console.log('[file-deleted-externally] File deleted:', path);

    const message = window.i18nHelpers?.t('messages.fileDeleted') || 'The file has been deleted externally';

    if (window.toast) {
      window.toast.error(message, { duration: 0 });
    } else {
      alert(message);
    }

    // 停止监听
    ipcRenderer.send('stop-watching-file');
  });

  ipcRenderer.on('toggle-preview', () => {
    document.getElementById('togglePreviewBtn').click();
  });

  // PDF 导出
  ipcRenderer.on('export-pdf', async () => {
    const isPro = licenseManager.isPro();
    if (!isPro) {
      showActivationPrompt('pdfExport');
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

  // 查找/替换
  ipcRenderer.on('open-find', () => {
    if (window.findReplace) {
      window.findReplace.open('find');
    }
  });

  ipcRenderer.on('open-find-replace', () => {
    if (window.findReplace) {
      window.findReplace.open('replace');
    }
  });

  // 代码块行号切换
  ipcRenderer.on('toggle-code-block-lines', (event, enabled) => {
    const preview = document.getElementById('preview');
    if (preview) {
      if (enabled) {
        preview.classList.remove('code-block-lines-disabled');
      } else {
        preview.classList.add('code-block-lines-disabled');
      }
      localStorage.setItem('codeBlockLinesEnabled', enabled);
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
  const message = window.i18nHelpers
    ? window.i18nHelpers.t('subscriptionMessages.expiring', { days: status.daysLeft })
    : `Your membership expires in ${status.daysLeft} days. Renew for just ¥19/month.`;

  if (window.i18nHelpers && window.i18nHelpers.showConfirm) {
    if (window.i18nHelpers.showConfirm('confirmations.membershipExpiring', { message })) {
      openSubscriptionWindow();
    }
  } else if (confirm(`⏰ Membership Expiring\n\n${message}\n\nRenew now?`)) {
    openSubscriptionWindow();
  }

  // 标记提醒已显示
  ipcRenderer.invoke('mark-reminder-shown');
}

// 显示过期提示
function showExpiredNotice(status) {
  const message = window.i18nHelpers
    ? window.i18nHelpers.t('subscriptionMessages.expired')
    : 'Your membership has expired. Renew to restore all Pro features.\n\nMonthly membership: ¥19/month';

  if (window.i18nHelpers && window.i18nHelpers.showConfirm) {
    if (window.i18nHelpers.showConfirm('confirmations.membershipExpired', { message })) {
      openSubscriptionWindow();
    }
  } else if (confirm(`😢 Membership Expired\n\n${message}\n\nRenew now?`)) {
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

  // 更新状态栏主题显示
  updateThemeDisplay(template);

  // 保存主题选择到会话
  try {
    const session = JSON.parse(localStorage.getItem('mdskill.session.v1') || '{}');
    session.theme = template.id;
    localStorage.setItem('mdskill.session.v1', JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save theme to session:', e);
  }
}

// 更新主题显示
function updateThemeDisplay(template) {
  const themeDisplay = document.getElementById('currentTheme');
  if (themeDisplay) {
    themeDisplay.textContent = template.name;
  }
}

// 暴露为全局函数供 theme-preview.js 使用
window.applyTemplate = applyTemplate;
window.currentTemplate = currentTemplate;

// 更新预览（性能优化）
let lastMarkdown = '';
function updatePreview() {
  let markdown = editor.value;

  // 性能优化：如果内容未变化，直接返回
  if (markdown === lastMarkdown) {
    return;
  }
  lastMarkdown = markdown;

  // 预处理：压缩连续的空行为单个空行（保持段落分隔）
  markdown = markdown.replace(/\n\s*\n\s*\n+/g, '\n\n');

  const html = marked.parse(markdown);

  // 使用 requestAnimationFrame 优化 DOM 更新
  requestAnimationFrame(() => {
    preview.innerHTML = html;
  });
}

// 防抖更新预览
function debouncedUpdatePreview() {
  if (updateTimer) {
    clearTimeout(updateTimer);
  }

  updateTimer = setTimeout(() => {
    updatePreview();
  }, 150); // 150ms 延迟，更快响应
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
    const msg = window.i18nHelpers ? window.i18nHelpers.t('messages.emptyContent') : 'Editor content is empty';
    if (window.toast) {
      toast.warning(msg);
    } else {
      alert(msg);
    }
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
      if (window.toast) {
        toast.error(window.i18nHelpers.t('alerts.aiFormatFailed', {error: error.message}));
      } else {
        window.i18nHelpers.showAlert('alerts.aiFormatFailed', {error: error.message});
      }
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

  const allTemplates = getRegisteredTemplates();

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

  // 更新选择器的显示文本（显示当前主题名）
  updateThemeSelectorDisplay();
}

// 更新主题选择器显示当前主题名
function updateThemeSelectorDisplay() {
  const select = document.getElementById('templateSelect');
  if (!select || !currentTemplate) {
    return;
  }

  // 如果 select 没有被替换成其他元素，更新其显示
  const selectedOption = select.options[select.selectedIndex];
  if (selectedOption) {
    // 已经通过 value 选中了正确的 option，浏览器会自动显示
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
function getLocalizedFeatureName(featureKey) {
  if (window.i18nHelpers) {
    return window.i18nHelpers.t(`featureNames.${featureKey}`);
  }

  const fallback = {
    themes: 'Themes',
    premiumThemes: 'Beautiful Themes',
    pdfExport: 'PDF Export',
    wechatCopy: 'Copy to WeChat',
    blogCopy: 'Copy to Blog',
    htmlExport: 'Copy HTML Source'
  };
  return fallback[featureKey] || featureKey;
}

// 显示功能限制提示
function showFeatureLockedPrompt(featureKey) {
  const featureName = getLocalizedFeatureName(featureKey);
  const message = window.i18nHelpers
    ? window.i18nHelpers.t('subscriptionMessages.featureLocked', { featureName })
    : `🔒 ${featureName} is a Pro feature\n\nMonthly membership: ¥19/month\nNew users get a 7-day free trial`;

  if (window.i18nHelpers && window.i18nHelpers.showConfirm) {
    if (window.i18nHelpers.showConfirm('confirmations.viewMembershipBenefits', { message })) {
      openSubscriptionWindow();
    }
  } else if (confirm(`${message}\n\nView membership benefits?`)) {
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

  let progressOverlay = null;

  // 禁用导出按钮
  const pdfBtn = document.getElementById('exportPdfBtn');
  const originalDisabled = pdfBtn.disabled;
  pdfBtn.disabled = true;

  try {
    // 获取当前文件名作为默认 PDF 名称
    let defaultName = 'document.pdf';
    if (currentFilePath) {
      const fileName = currentFilePath.split('/').pop().replace(/\.(md|markdown|txt)$/i, '');
      defaultName = `${fileName}.pdf`;
    }
    console.log('Default PDF name:', defaultName);

    // 显示进度覆盖层
    if (typeof PDFExportProgress !== 'undefined') {
      progressOverlay = new PDFExportProgress();
      progressOverlay.show(defaultName);
    }

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
      const msg = window.i18nHelpers
        ? window.i18nHelpers.t('messages.pdfExportSuccess', { path: result.filePath })
        : `PDF exported successfully!\nSaved to: ${result.filePath}`;
      if (window.toast) {
        toast.success(msg, 5000);
      } else {
        alert(msg);
      }
    } else if (result.canceled) {
      console.log('PDF export canceled by user');
    } else {
      console.error('Failed to export PDF:', result.error);
      const msg = window.i18nHelpers
        ? window.i18nHelpers.t('messages.pdfExportFailed', { error: result.error })
        : `PDF export failed: ${result.error}`;
      if (window.toast) {
        toast.error(msg);
      } else {
        alert(msg);
      }
    }
  } catch (error) {
    console.error('Error during PDF export:', error);
    const msg = window.i18nHelpers
      ? window.i18nHelpers.t('messages.pdfExportError', { error: error.message })
      : `PDF export error: ${error.message}`;
    if (window.toast) {
      toast.error(msg);
    } else {
      alert(msg);
    }
  } finally {
    // 关闭进度提示
    if (progressOverlay) {
      progressOverlay.hide();
    }
    // 恢复导出按钮状态
    pdfBtn.disabled = originalDisabled;
  }
}

// 显示激活提示
function showActivationPrompt(featureKey) {
  const deviceId = licenseManager.getDeviceFingerprint();
  const featureName = getLocalizedFeatureName(featureKey);
  const message = window.i18nHelpers
    ? window.i18nHelpers.t('activationPrompt.message', { featureName, deviceId })
    : `${featureName} is a Pro feature 🔒\n\nYour Device ID: ${deviceId}\n\nContact the developer for a license key:\nWeChat: AIPMAndy\n\nAfter getting a license key, choose "Activate Pro" from the Help menu.`;

  if (window.toast) {
    toast.warning(message.replace(/\n\n/g, '\n'), 6000);
  } else {
    alert(message);
  }
}

// 初始化字体大小
function initFontSize() {
  // 从 localStorage 加载保存的字体大小
  const savedSize = localStorage.getItem('mdskill_editor_font_size');
  if (savedSize) {
    editorFontSize = parseInt(savedSize, 10);
  }

  // 应用字体大小到编辑器
  applyFontSize();

  // 注册键盘快捷键 (Cmd+= 放大, Cmd+- 缩小)
  document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + F: 打开查找
    if ((e.metaKey || e.ctrlKey) && e.key === 'f' && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      if (window.findReplace) {
        window.findReplace.open('find');
      }
    }
    // Cmd/Ctrl + Option/Alt + F: 打开查找替换
    else if ((e.metaKey || e.ctrlKey) && e.altKey && e.key === 'f') {
      e.preventDefault();
      if (window.findReplace) {
        window.findReplace.open('replace');
      }
    }
    // Cmd/Ctrl + 0-6: 块级快捷键（标题层级）
    else if ((e.metaKey || e.ctrlKey) && /^[0-6]$/.test(e.key)) {
      e.preventDefault();
      convertBlockLevel(parseInt(e.key));
    }
    // Cmd/Ctrl + =: 增大字体
    else if ((e.metaKey || e.ctrlKey) && e.key === '=') {
      e.preventDefault();
      increaseFontSize();
    }
    // Cmd/Ctrl + -: 减小字体
    else if ((e.metaKey || e.ctrlKey) && e.key === '-') {
      e.preventDefault();
      decreaseFontSize();
    }
  });
}

// 块级转换（Ctrl+0-6）
function convertBlockLevel(level) {
  if (!editor) return;

  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const text = editor.value;

  // 找到当前行的起始位置
  let lineStart = start;
  while (lineStart > 0 && text[lineStart - 1] !== '\n') {
    lineStart--;
  }

  // 找到当前行的结束位置
  let lineEnd = end;
  while (lineEnd < text.length && text[lineEnd] !== '\n') {
    lineEnd++;
  }

  // 获取当前行内容
  let line = text.substring(lineStart, lineEnd);

  // 移除现有的标题标记
  const cleaned = line.replace(/^#{1,6}\s*/, '');

  // 添加新的标题标记
  let newLine;
  if (level === 0) {
    // Ctrl+0: 转为普通段落
    newLine = cleaned;
  } else {
    // Ctrl+1-6: 转为对应层级标题
    newLine = '#'.repeat(level) + ' ' + cleaned;
  }

  // 替换当前行
  const before = text.substring(0, lineStart);
  const after = text.substring(lineEnd);
  editor.value = before + newLine + after;

  // 恢复光标位置（在新内容的相同相对位置）
  const offset = start - lineStart;
  const newCursorPos = lineStart + Math.min(offset, newLine.length);
  editor.setSelectionRange(newCursorPos, newCursorPos);

  // 标记为已修改并更新预览
  isModified = true;
  updateFileStatus();
  updatePreview();
}

// 应用字体大小
function applyFontSize() {
  if (editor) {
    editor.style.fontSize = `${editorFontSize}px`;
  }

  // 更新状态栏显示
  updateStatusBar();
}

// 增大字体
function increaseFontSize() {
  if (editorFontSize < 20) {
    editorFontSize++;
    localStorage.setItem('mdskill_editor_font_size', editorFontSize);
    applyFontSize();
  }
}

// 减小字体
function decreaseFontSize() {
  if (editorFontSize > 14) {
    editorFontSize--;
    localStorage.setItem('mdskill_editor_font_size', editorFontSize);
    applyFontSize();
  }
}

// 初始化状态栏
function initStatusBar() {
  const statusBar = document.querySelector('.status-bar');
  if (!statusBar) {
    console.error('Status bar element not found');
    return;
  }

  // 创建状态栏元素（如果不存在）
  let wordCountEl = document.getElementById('wordCount');
  if (!wordCountEl) {
    wordCountEl = document.createElement('span');
    wordCountEl.id = 'wordCount';
    wordCountEl.className = 'status-item';
    statusBar.appendChild(wordCountEl);
  }

  let fontSizeEl = document.getElementById('fontSize');
  if (!fontSizeEl) {
    fontSizeEl = document.createElement('span');
    fontSizeEl.id = 'fontSize';
    fontSizeEl.className = 'status-item';
    statusBar.appendChild(fontSizeEl);
  }

  let autoSaveEl = document.getElementById('autoSave');
  if (!autoSaveEl) {
    autoSaveEl = document.createElement('span');
    autoSaveEl.id = 'autoSave';
    autoSaveEl.className = 'status-item';
    statusBar.appendChild(autoSaveEl);
  }

  // 初始更新
  updateStatusBar();
}

// 更新状态栏
function updateStatusBar() {
  const wordCountEl = document.getElementById('wordCount');
  const fontSizeEl = document.getElementById('fontSize');
  const autoSaveEl = document.getElementById('autoSave');
  const t = window.i18nHelpers ? window.i18nHelpers.t : null;

  // 更新字数统计
  if (wordCountEl && editor) {
    const text = editor.value;
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    wordCountEl.textContent = t
      ? t('status.wordsChars', { words: wordCount, chars: charCount })
      : `${wordCount} words, ${charCount} chars`;
  }

  // 更新字体大小
  if (fontSizeEl) {
    fontSizeEl.textContent = `${editorFontSize}px`;
  }

  // 更新自动保存状态
  if (autoSaveEl) {
    if (lastSaveTime) {
      const now = Date.now();
      const elapsed = Math.floor((now - lastSaveTime) / 1000);
      if (elapsed < 60) {
        autoSaveEl.textContent = t
          ? t('status.savedSecondsAgo', { seconds: elapsed })
          : `Saved ${elapsed}s ago`;
      } else {
        const minutes = Math.floor(elapsed / 60);
        autoSaveEl.textContent = t
          ? t('status.savedMinutesAgo', { minutes })
          : `Saved ${minutes}m ago`;
      }
    } else {
      autoSaveEl.textContent = t ? t('status.notSaved') : 'Not saved';
    }
  }
}

// 更新字数统计（在编辑器输入时调用）
function updateWordCount() {
  updateStatusBar();
}

function updateLocalizedChrome(lang) {
  if (!window.i18nHelpers) {
    return;
  }

  if (editor) {
    editor.setAttribute('placeholder', window.i18nHelpers.t('editor.placeholder'));
  }

  const brandText = document.getElementById('brandText');
  if (brandText) {
    brandText.textContent = window.i18nHelpers.t('branding.madeBy');
  }

  const aiProgressText = document.getElementById('aiProgressText');
  if (aiProgressText) {
    aiProgressText.textContent = window.i18nHelpers.t('aiProgress.formatting');
  }

  const aiCancelBtn = document.getElementById('aiCancelBtn');
  if (aiCancelBtn) {
    aiCancelBtn.textContent = window.i18nHelpers.t('aiProgress.cancel');
  }

  if (typeof initToolbarI18n === 'function') {
    initToolbarI18n(lang);
  }

  updateStatusBar();
}

// 监听语言切换事件
ipcRenderer.on('language-changed', (event, lang) => {
  console.log('Language changed to:', lang);

  if (window.i18nHelpers && window.i18nHelpers.setLanguage) {
    window.i18nHelpers.setLanguage(lang);
  }

  updateLocalizedChrome(lang);

  // 更新欢迎弹窗多语言
  if (window.welcomeModal && window.welcomeModal.refresh) {
    window.welcomeModal.refresh();
  }
});

// 初始化应用
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
