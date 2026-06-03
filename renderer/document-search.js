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
  }

  createPanelHTML() {
    const panelHTML = `
      <div class="doc-search-panel" id="docSearchPanel">
        <div class="doc-search-header">
          <div class="doc-search-tabs">
            <button class="doc-search-tab active" data-tab="search">🔍 搜索</button>
            <button class="doc-search-tab" data-tab="outline">📋 大纲</button>
          </div>
          <button class="doc-search-close" id="docSearchClose">
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
              placeholder="搜索内容..."
            />
            <button class="doc-search-nav-btn" id="docSearchPrev" title="上一个 (Shift+Enter)">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
              </svg>
            </button>
            <button class="doc-search-nav-btn" id="docSearchNext" title="下一个 (Enter)">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
              </svg>
            </button>
            <div class="doc-search-counter" id="docSearchCounter">0/0</div>
          </div>
          <div class="doc-search-options">
            <button class="doc-search-option-btn" id="docSearchCaseSensitive" title="区分大小写">Aa</button>
            <button class="doc-search-option-btn" id="docSearchRegex" title="正则表达式">.*</button>
          </div>
        </div>

        <div class="doc-search-content" id="docSearchContent">
          <div class="doc-search-empty">输入关键词开始搜索</div>
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

    // 搜索输入
    input.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.performSearch();
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
    });
  }

  show(tab = 'search') {
    this.isVisible = true;
    this.currentTab = tab;

    const panel = document.getElementById('docSearchPanel');
    panel.classList.add('active');

    this.switchTab(tab);

    if (tab === 'search') {
      const input = document.getElementById('docSearchInput');
      // 如果编辑器有选中文本，自动填充到搜索框
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
        this.showEmptyState('输入关键词开始搜索');
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
        this.showEmptyState('输入关键词开始搜索\n\n支持正则表达式，试试：\n\\b\\w{5}\\b (匹配5个字母的单词)');
      }
      this.updateCounter();
      return;
    }

    const text = editor.value;
    this.matches = this.findMatches(text, this.searchQuery);

    if (this.matches.length === 0) {
      this.showEmptyState('未找到匹配项\n\n试试：\n• 检查拼写\n• 使用不同的关键词\n• 关闭"区分大小写"选项');
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
    } catch (e) {
      // Invalid regex
      console.error('Search error:', e);
    }

    return matches;
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

    // 绑定点击事件 - 使用事件委托
    content.querySelectorAll('.doc-outline-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const index = parseInt(item.dataset.index);
        if (!isNaN(index) && index >= 0 && index < this.matches.length) {
          this.currentMatchIndex = index;
          this.jumpToMatch(index);
          this.showSearchResults(); // 更新高亮
        }
      });
    });
  }

  jumpToMatch(index) {
    if (index < 0 || index >= this.matches.length) return;

    const match = this.matches[index];
    const editor = document.getElementById('editor');

    // 先保存当前搜索框的焦点状态
    const searchInput = document.getElementById('docSearchInput');
    const hadSearchFocus = searchInput && document.activeElement === searchInput;

    // 设置编辑器选区（高亮显示）
    editor.setSelectionRange(match.index, match.index + match.length);

    // 强制聚焦到编辑器，让选区可见
    editor.focus();

    // 滚动到可见区域
    this.scrollToSelection(editor);

    // 添加视觉高亮提示
    this.addVisualHighlight(editor, match);

    // 如果搜索框之前有焦点，延迟恢复焦点
    if (hadSearchFocus && searchInput) {
      setTimeout(() => {
        searchInput.focus();
      }, 100);
    }
  }

  addVisualHighlight(editor, match) {
    // 移除之前的高亮
    this.removeVisualHighlight();

    // 创建高亮覆盖层
    const highlight = document.createElement('div');
    highlight.className = 'search-highlight-overlay';
    highlight.id = 'searchHighlightOverlay';

    // 计算位置
    const lineHeight = parseInt(window.getComputedStyle(editor).lineHeight) || 20;
    const textBeforeCursor = editor.value.substring(0, match.index);
    const lineNumber = (textBeforeCursor.match(/\n/g) || []).length;
    const lineText = textBeforeCursor.split('\n').pop();

    // 粗略估算字符宽度（等宽字体）
    const fontSize = parseInt(window.getComputedStyle(editor).fontSize) || 14;
    const charWidth = fontSize * 0.6;

    const top = lineNumber * lineHeight - editor.scrollTop;
    const left = lineText.length * charWidth + 10; // +10 for padding

    highlight.style.position = 'absolute';
    highlight.style.top = `${top}px`;
    highlight.style.left = `${left}px`;
    highlight.style.height = `${lineHeight}px`;
    highlight.style.width = `${match.length * charWidth}px`;
    highlight.style.backgroundColor = 'rgba(255, 193, 7, 0.4)';
    highlight.style.border = '2px solid #ffc107';
    highlight.style.borderRadius = '3px';
    highlight.style.pointerEvents = 'none';
    highlight.style.zIndex = '10';
    highlight.style.animation = 'searchPulse 0.6s ease-in-out 3';

    // 添加到编辑器容器
    const editorContainer = editor.parentElement;
    editorContainer.style.position = 'relative';
    editorContainer.appendChild(highlight);

    // 3秒后移除
    setTimeout(() => {
      this.removeVisualHighlight();
    }, 3000);
  }

  removeVisualHighlight() {
    const existing = document.getElementById('searchHighlightOverlay');
    if (existing) {
      existing.remove();
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
