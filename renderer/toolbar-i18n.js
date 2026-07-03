// 多语言工具栏初始化
// Toolbar i18n initialization

const { getCurrentLanguage } = require('../i18n/locales');

let currentLang = getCurrentLanguage();

// 工具栏按钮的多语言文本
const toolbarTexts = {
  en: {
    toggleSidebar: 'Toggle Sidebar',
    toggleTheme: 'Toggle Theme',
    aiFormat: 'AI Format to Markdown',
    searchDocument: 'Search Document (Cmd+F)',
    documentOutline: 'Document Outline',
    newWindow: 'New Window (Cmd+N)',
    openFile: 'Open File (Cmd+O)',
    saveFile: 'Save File (Cmd+S)',
    bold: 'Bold (Cmd+B)',
    italic: 'Italic (Cmd+I)',
    codeBlock: 'Inline Code',
    insertLink: 'Insert Link (Cmd+K)',
    selectTheme: 'Select Theme',
    exportPDF: 'Export PDF (Cmd+E)',
    copyToWechat: 'Copy to WeChat Official Account (Cmd+Shift+W)',
    copyToBlog: 'Copy to Blog (Cmd+Shift+B)',
    copyHTMLSource: 'Copy HTML Source (Cmd+Shift+H)',
    togglePreview: 'Toggle Preview (Cmd+P)'
  },
  zh: {
    toggleSidebar: '切换侧边栏',
    toggleTheme: '切换主题',
    aiFormat: 'AI 一键转 Markdown',
    searchDocument: '搜索文档 (Cmd+F)',
    documentOutline: '文档大纲',
    newWindow: '新建窗口 (Cmd+N)',
    openFile: '打开文件 (Cmd+O)',
    saveFile: '保存文件 (Cmd+S)',
    bold: '加粗 (Cmd+B)',
    italic: '斜体 (Cmd+I)',
    codeBlock: '行内代码',
    insertLink: '插入链接 (Cmd+K)',
    selectTheme: '选择主题',
    exportPDF: '导出 PDF (Cmd+E)',
    copyToWechat: '复制到微信公众号 (Cmd+Shift+W)',
    copyToBlog: '复制到博客 (Cmd+Shift+B)',
    copyHTMLSource: '复制HTML源码 (Cmd+Shift+H)',
    togglePreview: '切换预览 (Cmd+P)'
  }
};

// 更新所有工具栏按钮的 title
function updateToolbarTooltips(lang) {
  const texts = toolbarTexts[lang] || toolbarTexts.en;

  // 映射按钮 ID 到文本键
  const buttonMap = {
    'toggleSidebarBtn': 'toggleSidebar',
    'themeBtn': 'toggleTheme',
    'aiFormatBtn': 'aiFormat',
    'searchBtn': 'searchDocument',
    'outlineBtn': 'documentOutline',
    'newBtn': 'newWindow',
    'openBtn': 'openFile',
    'saveBtn': 'saveFile',
    'boldBtn': 'bold',
    'italicBtn': 'italic',
    'codeBtn': 'codeBlock',
    'linkBtn': 'insertLink',
    'templateSelect': 'selectTheme',
    'exportPdfBtn': 'exportPDF',
    'copyWeChatBtn': 'copyToWechat',
    'copyBlogBtn': 'copyToBlog',
    'copyHTMLBtn': 'copyHTMLSource',
    'togglePreviewBtn': 'togglePreview'
  };

  Object.keys(buttonMap).forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      const textKey = buttonMap[btnId];
      btn.title = texts[textKey];
    }
  });
}

// 初始化时更新一次
function initToolbarI18n(lang = currentLang) {
  currentLang = lang;
  updateToolbarTooltips(currentLang);
}

// 监听语言切换
if (window.electron && window.electron.ipcRenderer) {
  window.electron.ipcRenderer.on('language-changed', (event, lang) => {
    currentLang = lang;
    updateToolbarTooltips(lang);
  });
}

// 导出供外部调用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initToolbarI18n, updateToolbarTooltips };
}
