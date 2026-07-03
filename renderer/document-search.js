// 文档内搜索功能模块
class DocumentSearch {
  constructor() {
    this.isVisible = false;
    this.currentTab = 'search'; // 'search' or 'outline'
    this.searchQuery = '';
    this.useRegex = false;
    this.caseSensitive = false;
    this.matches = [];
    this.currentMatchIndex = -1;
    this.headings = [];

    this.init();
  }

  init() {
    this.createPanelHTML();
    this.attachEventListeners();
    this.bindKeyboardShortcuts();
    this.setupLanguageListener();
  }

  setupLanguageListener() {
    // Listen for language changes
    if (window.ipcRenderer) {
      window.ipcRenderer.on('language-changed', () => {
        if (typeof refreshDocSearchI18n === 'function') {
          refreshDocSearchI18n();
        }
      });
    }
  }

  createPanelHTML() {
    const texts = window.getDocSearchTexts ? window.getDocSearchTexts() : {
      tabSearch: '🔍 Search',
      tabOutline: '📋 Outline',
      placeholder: 'Search in document...',
      emptyHint: 'Enter keywords to search',
      prevMatch: 'Previous (Shift+Enter)',
      nextMatch: 'Next (Enter)',
      caseSensitive: 'Case sensitive',
      regex: 'Regular expression',
      closeTooltip: 'Close'
    };

    const panelHTML = `
      <div class="doc-search-panel" id="docSearchPanel">
        <div class="doc-search-header">
          <div class="doc-search-tabs">
            <button class="doc-search-tab active" data-tab="search">${texts.tabSearch}</button>
            <button class="doc-search-tab" data-tab="outline">${texts.tabOutline}</button>
          </div>
          <button class="doc-search-close" id="docSearchClose" title="${texts.closeTooltip}">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
            </svg>
          </button>
        </div>

        <div class="doc-search-input-wrapper">
          <div class="doc-search-input-row">
            <input
              type="text"
              class="doc-search-input"
              id="docSearchInput"
              placeholder="${texts.placeholder}"
            />
            <button class="doc-search-nav-btn" id="docSearchPrev" title="${texts.prevMatch}">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
              </svg>
            </button>
            <button class="doc-search-nav-btn" id="docSearchNext" title="${texts.nextMatch}">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
              </svg>
            </button>
            <div class="doc-search-counter" id="docSearchCounter">0/0</div>
          </div>
          <div class="doc-search-options">
            <button class="doc-search-option-btn" id="docSearchCaseSensitive" title="${texts.caseSensitive}">Aa</button>
            <button class="doc-search-option-btn" id="docSearchRegex" title="${texts.regex}">.*</button>
          </div>
        </div>

        <div class="doc-search-content" id="docSearchContent">
          <div class="doc-search-empty">${texts.emptyHint}</div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', panelHTML);
  }

  attachEventListeners() {
    const panel = document.getElementById('docSearchPanel');
    const closeBtn = document.getElementById('docSearchClose');
    const input = document.getElementById('docSearchInput');
    const prevBtn = document.getElementById('docSearchPrev');
    const nextBtn = document.getElementById('docSearchNext');
    const caseSensitiveBtn = document.getElementById('docSearchCaseSensitive');
    const regexBtn = document.getElementById('docSearchRegex');
    const tabs = panel.querySelectorAll('.doc-search-tab');
    const content = document.getElementById('docSearchContent');

    // 切换标签
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        this.switchTab(tabName);
      });
    });

    // 关闭按钮
    closeBtn.addEventListener('click', () => {
      this.hide();
    });

    // 搜索输入 - 支持中文输入法
    let isComposing = false;

    input.addEventListener('compositionstart', () => {
      isComposing = true;
    });

    input.addEventListener('compositionend', (e) => {
      isComposing = false;
      this.searchQuery = e.target.value;
      this.performSearch();
    });

    input.addEventListener('input', (e) => {
      // 中文输入法组合中不触发搜索
      if (!isComposing) {
        this.searchQuery = e.target.value;
        this.performSearch();
      }
    });

    // 键盘导航
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          this.goToPrevMatch();
        } else {
          this.goToNextMatch();
        }
      } else if (e.key === 'Escape') {
        this.hide();
      }
    });

    // 导航按钮
    prevBtn.addEventListener('click', () => this.goToPrevMatch());
    nextBtn.addEventListener('click', () => this.goToNextMatch());

    // 选项按钮
    caseSensitiveBtn.addEventListener('click', () => {
      this.caseSensitive = !this.caseSensitive;
      caseSensitiveBtn.classList.toggle('active', this.caseSensitive);
      this.performSearch();
    });

    regexBtn.addEventListener('click', () => {
      this.useRegex = !this.useRegex;
      regexBtn.classList.toggle('active', this.useRegex);
      this.performSearch();
    });

    // 点击大纲项或搜索结果
    content.addEventListener('click', (e) => {
      const item = e.target.closest('.doc-outline-item');
      if (!item) return;

      if (this.currentTab === 'outline') {
        // 大纲模式：跳转到行
        const line = parseInt(item.dataset.line);
        if (!isNaN(line)) {
          this.jumpToLine(line);
        }
      } else if (this.currentTab === 'search') {
        // 搜索模式：跳转到匹配项
        const index = parseInt(item.dataset.index);
        if (!isNaN(index) && index >= 0 && index < this.matches.length) {
          this.currentMatchIndex = index;
          this.jumpToMatch(index);
          this.showSearchResults();
        }
      }
    });
  }

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + F - 打开搜索
      if ((e.metaKey || e.ctrlKey) && e.key === 'f' && !e.shiftKey) {
        e.preventDefault();
        this.show('search');
      }

      // Cmd/Ctrl + Shift + O - 打开大纲
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        this.show('outline');
      }

      // Cmd/Ctrl + G - 下一个匹配（全局快捷键）
      if ((e.metaKey || e.ctrlKey) && e.key === 'g' && !e.shiftKey && this.isVisible && this.currentTab === 'search') {
        e.preventDefault();
        this.goToNextMatch();
      }

      // Cmd/Ctrl + Shift + G - 上一个匹配（全局快捷键）
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        if (this.isVisible && this.currentTab === 'search') {
          this.goToPrevMatch();
        }
      }
    });
  }

  show(tab = 'search') {
    const wasVisible = this.isVisible;
    this.isVisible = true;
    this.currentTab = tab;

    const panel = document.getElementById('docSearchPanel');
    panel.classList.add('active');

    this.switchTab(tab);

    if (tab === 'search') {
      const input = document.getElementById('docSearchInput');

      // 如果搜索面板已经打开，再次按 Cmd+F 应该清空并重新聚焦
      if (wasVisible) {
        input.value = '';
        this.searchQuery = '';
        this.clearHighlights();
        this.performSearch();
      } else {
        // 首次打开：如果编辑器有选中文本，自动填充到搜索框
        const editor = document.getElementById('editor');
        if (editor) {
          const selectedText = editor.value.substring(
            editor.selectionStart,
            editor.selectionEnd
          );
          if (selectedText && selectedText.length > 0 && selectedText.length < 100) {
            input.value = selectedText;
            this.searchQuery = selectedText;
            this.performSearch();
          }
        }
      }

      input.focus();
      input.select();
    } else if (tab === 'outline') {
      this.refreshOutline();
    }
  }

  hide() {
    this.isVisible = false;
    const panel = document.getElementById('docSearchPanel');
    panel.classList.remove('active');
    this.clearHighlights();
    this.removeVisualHighlight(); // 关闭搜索面板时移除高亮
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    // 更新标签样式
    const tabs = document.querySelectorAll('.doc-search-tab');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // 更新内容区域
    if (tabName === 'search') {
      document.querySelector('.doc-search-input-wrapper').style.display = 'flex';
      if (this.searchQuery) {
        this.performSearch();
      } else {
        const texts = window.getDocSearchTexts ? window.getDocSearchTexts() : {emptyHint: 'Enter keywords to search'};
        this.showEmptyState(texts.emptyHint);
      }
    } else if (tabName === 'outline') {
      document.querySelector('.doc-search-input-wrapper').style.display = 'none';
      this.refreshOutline();
    }
  }

  performSearch() {
    const editor = document.getElementById('editor');
    if (!editor || !this.searchQuery) {
      this.clearHighlights();
      if (!this.searchQuery) {
        const texts = window.getDocSearchTexts ? window.getDocSearchTexts() : {emptyHintWithTip: 'Enter keywords to search'};
        this.showEmptyState(texts.emptyHintWithTip);
      }
      this.updateCounter();
      return;
    }

    const text = editor.value;
    this.matches = this.findMatches(text, this.searchQuery);

    if (this.matches.length === 0) {
      const texts = window.getDocSearchTexts ? window.getDocSearchTexts() : {noResults: 'No results found'};
      this.showEmptyState(texts.noResults);
      this.clearHighlights();
    } else {
      this.currentMatchIndex = 0;
      this.highlightMatches();
      this.jumpToMatch(0);
    }

    this.updateCounter();
  }

  findMatches(text, query) {
    const matches = [];

    try {
      if (this.useRegex) {
        const flags = this.caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(query, flags);
        let match;

        while ((match = regex.exec(text)) !== null) {
          matches.push({
            index: match.index,
            length: match[0].length,
            line: this.getLineFromIndex(text, match.index)
          });
        }
      } else {
        const searchText = this.caseSensitive ? text : text.toLowerCase();
        const searchQuery = this.caseSensitive ? query : query.toLowerCase();
        let index = 0;

        while ((index = searchText.indexOf(searchQuery, index)) !== -1) {
          matches.push({
            index: index,
            length: query.length,
            line: this.getLineFromIndex(text, index)
          });
          index += query.length;
        }
      }

      // 清除错误状态
      this.clearRegexError();
    } catch (e) {
      // 正则表达式错误
      console.error('Search error:', e);
      this.showRegexError(e.message);
    }

    return matches;
  }

  showRegexError(message) {
    const input = document.getElementById('docSearchInput');
    const content = document.getElementById('docSearchContent');

    // 添加错误样式
    input.classList.add('regex-error');

    // 显示错误提示
    const errorHtml = `
      <div class="doc-search-error">
        <div class="doc-search-error-icon">⚠️</div>
        <div class="doc-search-error-title">正则表达式错误</div>
        <div class="doc-search-error-message">${this.escapeHtml(message)}</div>
      </div>
    `;
    content.innerHTML = errorHtml;
  }

  clearRegexError() {
    const input = document.getElementById('docSearchInput');
    input.classList.remove('regex-error');
  }

  getLineFromIndex(text, index) {
    return text.substring(0, index).split('\n').length - 1;
  }

  getIndexFromLine(text, line) {
    const lines = text.split('\n');
    let index = 0;
    for (let i = 0; i < line && i < lines.length; i++) {
      index += lines[i].length + 1; // +1 for newline
    }
    return index;
  }

  highlightMatches() {
    // Note: textarea 不支持直接高亮，这里更新显示
    // 实际高亮通过跳转和选择实现
    this.showSearchResults();
  }

  showSearchResults() {
    const content = document.getElementById('docSearchContent');
    const editor = document.getElementById('editor');
    const text = editor.value;
    const lines = text.split('\n');

    const resultsHTML = this.matches.map((match, index) => {
      const line = match.line;
      const lineText = lines[line] || '';
      const isActive = index === this.currentMatchIndex;

      return `
        <div class="doc-outline-item ${isActive ? 'active' : ''}" data-index="${index}" style="cursor: pointer;">
          <span class="doc-outline-icon">L${line + 1}</span>
          <span class="doc-outline-text">${this.escapeHtml(lineText.trim())}</span>
        </div>
      `;
    }).join('');

    content.innerHTML = resultsHTML;
  }

  jumpToMatch(index) {
    if (index < 0 || index >= this.matches.length) return;

    const match = this.matches[index];
    const editor = document.getElementById('editor');

    // 设置编辑器选区（高亮显示）
    editor.setSelectionRange(match.index, match.index + match.length);

    // 滚动到可见区域（不改变焦点）
    this.scrollToSelection(editor);

    // 添加视觉高亮提示
    this.addVisualHighlight(editor, match);

    // 同时滚动预览面板到对应位置
    this.scrollPreviewToMatch(match, editor);

    // 保持焦点在搜索框（不要让编辑器抢走焦点）
    const searchInput = document.getElementById('docSearchInput');
    if (searchInput && this.isVisible) {
      searchInput.focus();
    }
  }

  scrollPreviewToMatch(match, editor) {
    const preview = document.getElementById('preview');
    if (!preview) return;

    try {
      // 获取匹配文本
      const matchText = editor.value.substring(match.index, match.index + match.length);

      // 获取匹配位置所在的完整段落或块内容
      const textBeforeMatch = editor.value.substring(0, match.index);
      const textAfterMatch = editor.value.substring(match.index + match.length);

      // 找到匹配所在的段落（通过前后双换行符分隔）
      const paragraphStartIndex = textBeforeMatch.lastIndexOf('\n\n');
      const paragraphEndIndex = textAfterMatch.indexOf('\n\n');

      const blockStart = paragraphStartIndex === -1 ? 0 : paragraphStartIndex + 2;
      const blockEnd = match.index + match.length + (paragraphEndIndex === -1 ? textAfterMatch.length : paragraphEndIndex);
      const blockText = editor.value.substring(blockStart, blockEnd).trim();

      // 获取单行文本（用于二级匹配）
      const lastNewlineIndex = textBeforeMatch.lastIndexOf('\n');
      const lineStart = lastNewlineIndex === -1 ? 0 : lastNewlineIndex + 1;
      const lineEnd = editor.value.indexOf('\n', match.index);
      const lineText = editor.value.substring(lineStart, lineEnd === -1 ? editor.value.length : lineEnd).trim();

      // 在预览HTML中查找包含匹配文本的元素
      const allElements = preview.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, th, blockquote, pre, div.math-block, section');

      let targetElement = null;
      let bestMatch = { element: null, score: 0, method: '' };

      for (const element of allElements) {
        const elementText = (element.textContent || '').trim();

        // 跳过空元素
        if (!elementText) continue;

        // 方法1：精确匹配完整段落/块文本（最高优先级）
        if (blockText && elementText === blockText) {
          targetElement = element;
          break;
        }

        // 方法2：匹配包含完整块文本的元素
        if (blockText && elementText.includes(blockText)) {
          const score = blockText.length / elementText.length;
          if (score > bestMatch.score) {
            bestMatch = { element, score, method: 'block' };
          }
        }

        // 方法3：匹配完整行文本
        if (lineText && elementText === lineText) {
          const score = 0.8; // 稍低于块匹配
          if (score > bestMatch.score) {
            bestMatch = { element, score, method: 'line-exact' };
          }
        }

        // 方法4：匹配包含行文本的元素
        if (lineText && elementText.includes(lineText)) {
          const score = (lineText.length / elementText.length) * 0.7;
          if (score > bestMatch.score) {
            bestMatch = { element, score, method: 'line' };
          }
        }

        // 方法5：匹配包含搜索关键词的元素（最低优先级）
        if (matchText && elementText.includes(matchText)) {
          const score = (matchText.length / elementText.length) * 0.5;
          if (score > bestMatch.score) {
            bestMatch = { element, score, method: 'keyword' };
          }
        }
      }

      // 使用最佳匹配
      if (!targetElement && bestMatch.element && bestMatch.score > 0.3) {
        targetElement = bestMatch.element;
      }

      if (targetElement) {
        // 确保元素可见
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 移除之前的高亮
        preview.querySelectorAll('.preview-search-highlight').forEach(el => {
          el.classList.remove('preview-search-highlight');
        });

        // 添加临时高亮效果
        targetElement.classList.add('preview-search-highlight');
        setTimeout(() => {
          targetElement.classList.remove('preview-search-highlight');
        }, 2000);
      }
    } catch (error) {
      console.error('Preview scroll error:', error);
    }
  }

  addVisualHighlight(editor, match) {
    // 移除之前的高亮
    this.removeVisualHighlight();

    // 添加高亮 CSS 类来增强选中效果（持续显示，直到跳转到下一个或关闭搜索）
    editor.classList.add('search-highlight-active');

    // 不再自动移除，让高亮持续显示
    // 高亮会在以下情况被移除：
    // 1. 跳转到下一个匹配项时
    // 2. 关闭搜索面板时
    // 3. 开始新搜索时
  }

  removeVisualHighlight() {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.classList.remove('search-highlight-active');
    }
  }

  scrollToSelection(editor) {
    const lineHeight = parseInt(window.getComputedStyle(editor).lineHeight) || 20;
    const cursorPos = editor.selectionStart;
    const textBeforeCursor = editor.value.substring(0, cursorPos);
    const lineNumber = (textBeforeCursor.match(/\n/g) || []).length;

    const scrollTop = Math.max(0, lineNumber * lineHeight - editor.clientHeight / 2);
    editor.scrollTop = scrollTop;
  }

  goToNextMatch() {
    if (this.matches.length === 0) return;
    this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matches.length;
    this.jumpToMatch(this.currentMatchIndex);
    this.updateCounter();
    this.showSearchResults();
  }

  goToPrevMatch() {
    if (this.matches.length === 0) return;
    this.currentMatchIndex = this.currentMatchIndex <= 0
      ? this.matches.length - 1
      : this.currentMatchIndex - 1;
    this.jumpToMatch(this.currentMatchIndex);
    this.updateCounter();
    this.showSearchResults();
  }

  updateCounter() {
    const counter = document.getElementById('docSearchCounter');
    const prevBtn = document.getElementById('docSearchPrev');
    const nextBtn = document.getElementById('docSearchNext');

    if (this.matches.length === 0) {
      counter.textContent = '0/0';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
    } else {
      counter.textContent = `${this.currentMatchIndex + 1}/${this.matches.length}`;
      prevBtn.disabled = false;
      nextBtn.disabled = false;
    }
  }

  clearHighlights() {
    this.matches = [];
    this.currentMatchIndex = -1;
    this.updateCounter();
  }

  refreshOutline() {
    const editor = document.getElementById('editor');
    if (!editor) return;

    const text = editor.value;
    this.headings = this.extractHeadings(text);

    if (this.headings.length === 0) {
      this.showEmptyState('文档中暂无标题\n\n试试添加一些 Markdown 标题：\n# 一级标题\n## 二级标题');
      return;
    }

    this.renderOutline();
  }

  extractHeadings(text) {
    const lines = text.split('\n');
    const headings = [];

    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        headings.push({
          level: match[1].length,
          text: match[2].trim(),
          line: index
        });
      }
    });

    return headings;
  }

  renderOutline() {
    const content = document.getElementById('docSearchContent');
    const editor = document.getElementById('editor');
    const cursorLine = this.getLineFromIndex(editor.value, editor.selectionStart);

    const outlineHTML = this.headings.map((heading) => {
      const isActive = heading.line === cursorLine;
      const icon = '#'.repeat(heading.level);

      return `
        <div class="doc-outline-item ${isActive ? 'active' : ''}" data-line="${heading.line}" data-level="${heading.level}">
          <span class="doc-outline-icon">${icon}</span>
          <span class="doc-outline-text">${this.escapeHtml(heading.text)}</span>
        </div>
      `;
    }).join('');

    content.innerHTML = `<div class="doc-outline-list">${outlineHTML}</div>`;
  }

  jumpToLine(line) {
    const editor = document.getElementById('editor');
    const index = this.getIndexFromLine(editor.value, line);

    // 设置选区但不夺取焦点
    editor.setSelectionRange(index, index);
    this.scrollToSelection(editor);

    // 刷新大纲高亮
    if (this.currentTab === 'outline') {
      this.refreshOutline();
    }
  }

  showEmptyState(message) {
    const content = document.getElementById('docSearchContent');
    const icon = this.currentTab === 'outline' ? '📋' : '🔍';
    content.innerHTML = `
      <div class="doc-search-empty">
        <div class="doc-search-empty-icon">${icon}</div>
        <div>${message}</div>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// 初始化（将在 renderer.js 中调用）
let documentSearch;

function initDocumentSearch() {
  documentSearch = new DocumentSearch();
  window.documentSearch = documentSearch;
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DocumentSearch, initDocumentSearch };
}
