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

// DOM 元素
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const editorContainer = document.querySelector('.editor-container');
const fileStatus = document.getElementById('fileStatus');

// 状态
let currentFilePath = null;
let isModified = false;
let previewVisible = true;
let currentTemplate = null;
let updateTimer = null; // 防抖定时器

// 初始化
async function init() {
  // 调试：检查模块是否加载
  console.log('=== 模块加载检查 ===');
  console.log('window.copyUtils:', window.copyUtils);
  console.log('window.themePreview:', window.themePreview);
  console.log('window.getAllTemplates:', typeof window.getAllTemplates);
  console.log('window.getTemplateById:', typeof window.getTemplateById);

  // 检查授权状态
  const isPro = licenseManager.isPro();

  // 加载保存的模板
  const savedTemplateId = localStorage.getItem('mdskill_template') || 'github-dark';
  currentTemplate = getTemplateById(savedTemplateId);

  // 如果保存的模板是专业版但用户不是专业版，回退到免费主题
  if (currentTemplate.isPremium && !isPro) {
    currentTemplate = getTemplateById('github-dark');
    localStorage.setItem('mdskill_template', 'github-dark');
  }

  // 暴露为全局变量
  window.currentTemplate = currentTemplate;

  applyTemplate(currentTemplate);

  // 初始化主题预览面板（确保 window.themePreview 已加载）
  if (window.themePreview && window.themePreview.initThemePreview) {
    window.themePreview.initThemePreview();
  }

  // 更新主题选择器，标记专业版主题
  updateThemeSelector(isPro);

  // 更新 PDF 按钮状态
  updatePdfButtonState(isPro);

  // 不自动加载上次打开的文件，让用户主动选择
  // 如果是通过双击文件打开，会通过 'file-opened' 事件加载

  // 初始预览
  updatePreview();
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

// 编辑器输入事件
editor.addEventListener('input', () => {
  isModified = true;
  updateFileStatus();
  debouncedUpdatePreview(); // 使用防抖更新
});

// 工具栏按钮
document.getElementById('newBtn').addEventListener('click', () => {
  // 创建新窗口
  ipcRenderer.send('new-window');
});

document.getElementById('openBtn').addEventListener('click', async () => {
  // 触发主进程的打开文件对话框
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
    // Save As
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

// 模板选择器
const templateSelect = document.getElementById('templateSelect');
if (templateSelect) {
  templateSelect.addEventListener('change', (e) => {
    const templateId = e.target.value;
    const template = getTemplateById(templateId);
    const isPro = licenseManager.isPro();

    // 检查是否是专业版主题
    if (template.isPremium && !isPro) {
      // 显示激活提示
      showActivationPrompt('主题');
      // 恢复到当前主题
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
  // 填充主题选项
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

  // 监听主题切换
  themeSelector.addEventListener('change', (e) => {
    const templateId = e.target.value;
    if (!templateId) return;

    const template = getTemplateById(templateId);
    const isPro = licenseManager.isPro();

    // 检查是否是专业版主题
    if (template.isPremium && !isPro) {
      showActivationPrompt('主题');
      // 恢复到当前主题
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

// 主题切换按钮（快速切换亮/暗）
document.getElementById('themeBtn').addEventListener('click', () => {
  const currentId = currentTemplate.id;
  let newId;

  if (currentId === 'github-dark' || currentId === 'default') {
    newId = 'github-light';
  } else if (currentId === 'github-light') {
    newId = 'github-dark';
  } else {
    // 其他主题切换到 GitHub Dark
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
  const isPro = licenseManager.isPro();

  if (!isPro) {
    showActivationPrompt('PDF 导出');
    return;
  }

  await exportToPDF();
});

// 复制到微信公众号按钮
document.getElementById('copyWeChatBtn')?.addEventListener('click', async () => {
  const isPro = licenseManager.isPro();

  if (!isPro) {
    showActivationPrompt('复制到微信公众号');
    return;
  }

  if (!window.copyUtils) {
    alert('复制功能模块未加载，请刷新页面重试');
    return;
  }

  try {
    // 传递预览元素而不是 innerHTML
    const success = await window.copyUtils.copyForWeChat(preview, currentTemplate);
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
  const isPro = licenseManager.isPro();

  if (!isPro) {
    showActivationPrompt('复制到博客');
    return;
  }

  if (!window.copyUtils) {
    alert('复制功能模块未加载，请刷新页面重试');
    return;
  }

  try {
    // 传递预览元素而不是 innerHTML
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
  const isPro = licenseManager.isPro();

  if (!isPro) {
    showActivationPrompt('复制 HTML 源码');
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

// IPC 事件监听
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
  editor.value = content;
  currentFilePath = path;
  isModified = false;
  updateFileStatus();
  updatePreview();
});

ipcRenderer.on('toggle-preview', () => {
  document.getElementById('togglePreviewBtn').click();
});

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

    // 获取 DOM 元素
    const editorContainer = document.querySelector('.editor-container');
    const editorPane = document.getElementById('editorPane');
    const previewPane = document.getElementById('previewPane');

    if (!editorContainer || !editorPane || !previewPane) {
      throw new Error('Required DOM elements not found');
    }

    // 保存原始样式
    const originalContainerDisplay = editorContainer.style.display;
    const originalEditorDisplay = editorPane.style.display;
    const originalPreviewWidth = previewPane.style.width;
    const originalPreviewMaxWidth = previewPane.style.maxWidth;
    const originalPreviewMargin = previewPane.style.margin;
    const originalPreviewPadding = previewPane.style.padding;

    // 设置为只显示预览
    editorContainer.style.display = 'flex';
    editorPane.style.display = 'none';
    previewPane.style.width = '100%';
    previewPane.style.maxWidth = '210mm'; // A4 宽度
    previewPane.style.margin = '0 auto';
    previewPane.style.padding = '20mm'; // A4 边距

    console.log('Layout adjusted for PDF export');

    // 等待布局更新
    await new Promise(resolve => setTimeout(resolve, 200));

    console.log('Calling main process to export PDF...');
    // 调用主进程导出 PDF
    const result = await ipcRenderer.invoke('export-pdf', { defaultPath: defaultName });
    console.log('Export result:', result);

    // 恢复原始布局
    editorContainer.style.display = originalContainerDisplay;
    editorPane.style.display = originalEditorDisplay;
    previewPane.style.width = originalPreviewWidth;
    previewPane.style.maxWidth = originalPreviewMaxWidth;
    previewPane.style.margin = originalPreviewMargin;
    previewPane.style.padding = originalPreviewPadding;

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

ipcRenderer.on('export-pdf', async () => {
  const isPro = licenseManager.isPro();

  if (!isPro) {
    showActivationPrompt('PDF 导出');
    return;
  }

  await exportToPDF();
});

// IPC 监听器 - 复制功能
ipcRenderer.on('copy-wechat', () => {
  document.getElementById('copyWeChatBtn')?.click();
});

ipcRenderer.on('copy-blog', () => {
  document.getElementById('copyBlogBtn')?.click();
});

ipcRenderer.on('copy-html', () => {
  document.getElementById('copyHTMLBtn')?.click();
});

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
init();
