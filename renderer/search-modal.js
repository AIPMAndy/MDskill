// 搜索功能模块
// ipcRenderer 已在 renderer.js 中声明，这里直接使用

class SearchModal {
  constructor() {
    this.isVisible = false;
    this.currentMode = null; // 'quick', 'recent', 'content'
    this.results = [];
    this.selectedIndex = 0;

    this.init();
  }

  init() {
    this.createModalHTML();
    this.attachEventListeners();
    this.bindKeyboardShortcuts();
  }

  createModalHTML() {
    const modalHTML = `
      <div class="search-modal" id="searchModal">
        <div class="search-modal-overlay"></div>
        <div class="search-modal-content">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <input type="text" class="search-input" id="searchInput" placeholder="搜索文件...">
            <button class="search-close" id="searchClose">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
              </svg>
            </button>
          </div>
          <div class="search-results" id="searchResults">
            <div class="search-empty">输入关键词开始搜索</div>
          </div>
          <div class="search-footer">
            <span class="search-hint">↑↓ 选择</span>
            <span class="search-hint">Enter 打开</span>
            <span class="search-hint">Esc 关闭</span>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  attachEventListeners() {
    const modal = document.getElementById('searchModal');
    const input = document.getElementById('searchInput');
    const closeBtn = document.getElementById('searchClose');
    const overlay = modal.querySelector('.search-modal-overlay');

    // 输入事件
    input.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    // 键盘导航
    input.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });

    // 关闭按钮
    closeBtn.addEventListener('click', () => {
      this.hide();
    });

    // 点击遮罩关闭
    overlay.addEventListener('click', () => {
      this.hide();
    });

    // 点击结果项
    document.getElementById('searchResults').addEventListener('click', (e) => {
      const item = e.target.closest('.search-result-item');
      if (item) {
        const index = parseInt(item.dataset.index);
        this.selectResult(index);
      }
    });
  }

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Cmd+P / Ctrl+P - 快速搜索文件
      if ((e.metaKey || e.ctrlKey) && e.key === 'p' && !e.shiftKey) {
        e.preventDefault();
        this.show('quick');
      }

      // Cmd+E / Ctrl+E - 最近文件
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        this.show('recent');
      }

      // Cmd+Shift+F / Ctrl+Shift+F - 全文搜索
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault();
        this.show('content');
      }

      // Esc - 关闭
      if (e.key === 'Escape' && this.isVisible) {
        e.preventDefault();
        this.hide();
      }
    });
  }

  show(mode) {
    this.currentMode = mode;
    this.isVisible = true;
    this.selectedIndex = 0;

    const modal = document.getElementById('searchModal');
    const input = document.getElementById('searchInput');

    modal.classList.add('active');
    input.value = '';
    input.focus();

    // 设置占位符
    const placeholders = {
      quick: '搜索文件名...',
      recent: '最近打开的文件',
      content: '搜索文件内容...'
    };
    input.placeholder = placeholders[mode] || '搜索...';

    // 如果是最近文件模式，直接显示结果
    if (mode === 'recent') {
      this.showRecentFiles();
    } else {
      this.clearResults();
    }
  }

  hide() {
    this.isVisible = false;
    const modal = document.getElementById('searchModal');
    modal.classList.remove('active');
    this.clearResults();
  }

  async handleSearch(query) {
    if (!query.trim()) {
      if (this.currentMode === 'recent') {
        this.showRecentFiles();
      } else {
        this.clearResults();
      }
      return;
    }

    if (this.currentMode === 'quick') {
      await this.searchFiles(query);
    } else if (this.currentMode === 'content') {
      await this.searchContent(query);
    }
  }

  async searchFiles(query) {
    // 从侧边栏获取文件列表
    if (!window.sidebar || !window.sidebar.files) {
      this.showNoResults('请先打开一个文件夹');
      return;
    }

    const files = window.sidebar.files.filter(f => f.type === 'file');
    const lowerQuery = query.toLowerCase();

    // 模糊匹配
    this.results = files.filter(file =>
      file.name.toLowerCase().includes(lowerQuery)
    ).map(file => ({
      type: 'file',
      path: file.path,
      name: file.name,
      highlight: this.highlightMatch(file.name, query)
    }));

    this.selectedIndex = 0;
    this.renderResults();
  }

  async searchContent(query) {
    if (!window.sidebar || !window.sidebar.currentFolder) {
      this.showNoResults('请先打开一个文件夹');
      return;
    }

    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class="search-loading">搜索中...</div>';

    try {
      const result = await ipcRenderer.invoke('search-content', {
        folderPath: window.sidebar.currentFolder,
        query: query
      });

      this.results = result.map(item => ({
        type: 'content',
        path: item.path,
        name: item.name,
        line: item.line,
        lineNumber: item.lineNumber,
        highlight: this.highlightMatch(item.line, query)
      }));

      this.selectedIndex = 0;
      this.renderResults();
    } catch (error) {
      console.error('Search content error:', error);
      this.showNoResults('搜索失败');
    }
  }

  showRecentFiles() {
    if (!window.sidebar || !window.sidebar.recentFiles || window.sidebar.recentFiles.length === 0) {
      this.showNoResults('暂无最近文件');
      return;
    }

    this.results = window.sidebar.recentFiles.slice(0, 10).map(file => ({
      type: 'recent',
      path: file.path,
      name: require('path').basename(file.path)
    }));

    this.selectedIndex = 0;
    this.renderResults();
  }

  renderResults() {
    const resultsDiv = document.getElementById('searchResults');

    if (this.results.length === 0) {
      this.showNoResults('未找到匹配项');
      return;
    }

    resultsDiv.innerHTML = this.results.map((result, index) => {
      const isSelected = index === this.selectedIndex;
      const icon = result.type === 'content' ? '📝' : '📄';

      let subtitle = '';
      if (result.type === 'content') {
        subtitle = `<div class="result-subtitle">第 ${result.lineNumber} 行: ${result.highlight}</div>`;
      } else {
        subtitle = `<div class="result-path">${result.path}</div>`;
      }

      return `
        <div class="search-result-item ${isSelected ? 'selected' : ''}" data-index="${index}">
          <span class="result-icon">${icon}</span>
          <div class="result-content">
            <div class="result-title">${result.highlight || result.name}</div>
            ${subtitle}
          </div>
        </div>
      `;
    }).join('');

    // 滚动到选中项
    this.scrollToSelected();
  }

  showNoResults(message) {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = `<div class="search-empty">${message}</div>`;
    this.results = [];
  }

  clearResults() {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class="search-empty">输入关键词开始搜索</div>';
    this.results = [];
    this.selectedIndex = 0;
  }

  handleKeyDown(e) {
    if (this.results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.results.length - 1);
      this.renderResults();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      this.renderResults();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this.selectResult(this.selectedIndex);
    }
  }

  selectResult(index) {
    if (index < 0 || index >= this.results.length) return;

    const result = this.results[index];

    if (result.type === 'content') {
      // 打开文件并跳转到指定行
      ipcRenderer.send('open-file-from-sidebar', result.path);
      // TODO: 跳转到指定行
    } else {
      // 打开文件
      ipcRenderer.send('open-file-from-sidebar', result.path);
    }

    this.hide();
  }

  scrollToSelected() {
    const resultsDiv = document.getElementById('searchResults');
    const selectedItem = resultsDiv.querySelector('.search-result-item.selected');

    if (selectedItem) {
      selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  highlightMatch(text, query) {
    if (!query) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return text;

    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);

    return `${before}<mark>${match}</mark>${after}`;
  }
}

// 导出
module.exports = SearchModal;
