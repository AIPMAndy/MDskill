const { ipcRenderer } = require('electron');
const { marked } = require('marked');
const hljs = require('highlight.js');
const katex = require('katex');

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
  // 加载保存的模板
  const savedTemplateId = localStorage.getItem('mdskill_template') || 'github-dark';
  currentTemplate = getTemplateById(savedTemplateId);
  document.getElementById('templateSelect').value = savedTemplateId;
  applyTemplate(currentTemplate);

  // 尝试加载上次打开的文件
  const lastFile = await ipcRenderer.invoke('get-last-file');
  if (lastFile) {
    const result = await ipcRenderer.invoke('read-file', lastFile);
    if (result.success) {
      editor.value = result.content;
      currentFilePath = lastFile;
      updateFileStatus();
      updatePreview();
    }
  }

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
  if (isModified) {
    if (!confirm('You have unsaved changes. Continue?')) return;
  }
  editor.value = '';
  currentFilePath = null;
  isModified = false;
  updateFileStatus();
  updatePreview();
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

// 模板选择器
document.getElementById('templateSelect').addEventListener('change', (e) => {
  const templateId = e.target.value;
  currentTemplate = getTemplateById(templateId);
  applyTemplate(currentTemplate);
  localStorage.setItem('mdskill_template', templateId);
  updatePreview();
});

// 主题切换按钮（快速切换亮/暗）
document.getElementById('themeBtn').addEventListener('click', () => {
  const currentId = currentTemplate.id;
  let newId;

  if (currentId === 'github-dark') {
    newId = 'github-light';
  } else if (currentId === 'github-light') {
    newId = 'github-dark';
  } else {
    // 其他主题切换到 GitHub Dark
    newId = 'github-dark';
  }

  currentTemplate = getTemplateById(newId);
  document.getElementById('templateSelect').value = newId;
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

ipcRenderer.on('export-pdf', async () => {
  // 获取当前文件名作为默认 PDF 名称
  let defaultName = 'document.pdf';
  if (currentFilePath) {
    const fileName = currentFilePath.split('/').pop().replace(/\.(md|markdown|txt)$/i, '');
    defaultName = `${fileName}.pdf`;
  }

  // 临时隐藏编辑器，只显示预览区域用于导出
  const container = document.querySelector('.container');
  const editor = document.getElementById('editor');
  const preview = document.getElementById('preview');

  const originalDisplay = container.style.display;
  const originalEditorDisplay = editor.style.display;
  const originalPreviewWidth = preview.style.width;

  // 设置为只显示预览
  container.style.display = 'block';
  editor.style.display = 'none';
  preview.style.width = '100%';
  preview.style.maxWidth = '210mm'; // A4 宽度
  preview.style.margin = '0 auto';
  preview.style.padding = '20mm'; // A4 边距

  // 等待布局更新
  await new Promise(resolve => setTimeout(resolve, 100));

  // 调用主进程导出 PDF
  const result = await ipcRenderer.invoke('export-pdf', { defaultPath: defaultName });

  // 恢复原始布局
  container.style.display = originalDisplay;
  editor.style.display = originalEditorDisplay;
  preview.style.width = originalPreviewWidth;
  preview.style.maxWidth = '';
  preview.style.margin = '';
  preview.style.padding = '';

  if (result.success) {
    // 可以显示成功提示
    console.log('PDF exported successfully:', result.filePath);
  } else if (!result.canceled) {
    console.error('Failed to export PDF:', result.error);
  }
});

// 初始化应用
init();
