// Command Palette Module
class CommandPalette {
  constructor() {
    this.isOpen = false;
    this.selectedIndex = 0;
    this.items = [];
    this.filteredItems = [];

    this.init();
  }

  t(key, params = {}) {
    if (window.i18nHelpers) {
      return window.i18nHelpers.t(`commandPalette.${key}`, params);
    }
    const fallback = {
      placeholder: 'Type to search files and commands...',
      noResults: 'No results found',
      commands: 'Commands',
      recentFiles: 'Recent Files',
      newWindowTitle: 'New Window',
      newWindowSubtitle: 'Create a new editor window',
      openFileTitle: 'Open File',
      openFileSubtitle: 'Open a Markdown file',
      saveFileTitle: 'Save File',
      saveFileSubtitle: 'Save current file',
      changeThemeTitle: 'Change Theme',
      changeThemeSubtitle: 'Open theme selector',
      searchTitle: 'Search in Document',
      searchSubtitle: 'Find text in current document',
      exportPdfTitle: 'Export to PDF',
      exportPdfSubtitle: 'Export current document as PDF',
      openFileFailed: 'Failed to open file: {error}'
    };
    let value = fallback[key] || key;
    Object.keys(params).forEach(paramKey => {
      value = value.replace(`{${paramKey}}`, params[paramKey]);
    });
    return value;
  }

  init() {
    // Create DOM structure
    this.createDOM();

    // Bind events
    this.bindEvents();

    // Load recent files
    this.loadRecentFiles();
  }

  createDOM() {
    const overlay = document.createElement('div');
    overlay.className = 'command-palette-overlay';
    overlay.id = 'commandPaletteOverlay';

    overlay.innerHTML = `
      <div class="command-palette">
        <div class="command-palette-input-container">
          <input
            type="text"
            class="command-palette-input"
            id="commandPaletteInput"
            placeholder="${this.t('placeholder')}"
            autocomplete="off"
          />
        </div>
        <div class="command-palette-results" id="commandPaletteResults">
          <div class="command-palette-empty">${this.t('noResults')}</div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    this.overlay = overlay;
    this.input = overlay.querySelector('#commandPaletteInput');
    this.results = overlay.querySelector('#commandPaletteResults');
  }

  bindEvents() {
    // Global keyboard shortcut: Ctrl+P
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        this.toggle();
      }

    // ESC to close
    if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
    });

    // Click overlay to close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Input event for filtering
    this.input.addEventListener('input', () => {
      this.filter(this.input.value);
    });

    // Keyboard navigation
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectPrevious();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.executeSelected();
      }
    });

    if (typeof require !== 'undefined') {
      require('electron').ipcRenderer.on('language-changed', () => {
        this.refreshI18n();
      });
    }
  }

  refreshI18n() {
    if (!this.input || !this.results) return;
    this.input.placeholder = this.t('placeholder');
    this.loadRecentFiles();
    this.filter(this.input.value);
  }

  loadRecentFiles() {
    // Get recent files from localStorage
    const recentFiles = this.getRecentFiles();

    // Build items list
    this.items = [];

    // Add commands
    this.items.push({
      type: 'command',
      icon: '📄',
      title: this.t('newWindowTitle'),
      subtitle: this.t('newWindowSubtitle'),
      action: () => {
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('new-window');
      }
    });

    this.items.push({
      type: 'command',
      icon: '📂',
      title: this.t('openFileTitle'),
      subtitle: this.t('openFileSubtitle'),
      shortcut: '⌘O',
      action: () => {
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('file-open');
      }
    });

    this.items.push({
      type: 'command',
      icon: '💾',
      title: this.t('saveFileTitle'),
      subtitle: this.t('saveFileSubtitle'),
      shortcut: '⌘S',
      action: () => {
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('file-save');
      }
    });

    this.items.push({
      type: 'command',
      icon: '🎨',
      title: this.t('changeThemeTitle'),
      subtitle: this.t('changeThemeSubtitle'),
      action: () => {
        document.getElementById('themeBtn')?.click();
      }
    });

    this.items.push({
      type: 'command',
      icon: '🔍',
      title: this.t('searchTitle'),
      subtitle: this.t('searchSubtitle'),
      shortcut: '⌘F',
      action: () => {
        document.getElementById('searchBtn')?.click();
      }
    });

    this.items.push({
      type: 'command',
      icon: '📤',
      title: this.t('exportPdfTitle'),
      subtitle: this.t('exportPdfSubtitle'),
      shortcut: '⌘E',
      action: () => {
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('export-pdf');
      }
    });

    // Add recent files
    recentFiles.forEach(file => {
      this.items.push({
        type: 'file',
        icon: '📝',
        title: file.name,
        subtitle: file.path,
        path: file.path,
        action: () => {
          this.openFile(file.path);
        }
      });
    });

    this.filteredItems = [...this.items];
  }

  getRecentFiles() {
    try {
      const Store = require('electron-store');
      const store = new Store();
      const recentPaths = store.get('recentDocuments', []);

      return recentPaths.map(path => {
        const pathModule = require('path');
        return {
          name: pathModule.basename(path),
          path: path
        };
      }).slice(0, 10); // Limit to 10 recent files
    } catch (error) {
      console.error('Failed to load recent files:', error);
      return [];
    }
  }

  openFile(filePath) {
    const { ipcRenderer } = require('electron');
    const fs = require('fs').promises;

    fs.readFile(filePath, 'utf-8')
      .then(content => {
        ipcRenderer.send('file-opened', { path: filePath, content });
        // Trigger the file-opened event for the renderer
        const editor = document.getElementById('editor');
        if (editor) {
          editor.value = content;
          window.currentFilePath = filePath;
          window.isModified = false;
          if (typeof window.updateFileStatus === 'function') {
            window.updateFileStatus();
          }
          if (typeof window.updatePreview === 'function') {
            window.updatePreview();
          }
        }
      })
      .catch(error => {
        console.error('Failed to open file:', error);
        if (window.toast) {
          window.toast.error(this.t('openFileFailed', { error: error.message }));
        }
      });
  }

  filter(query) {
    if (!query.trim()) {
      this.filteredItems = [...this.items];
    } else {
      const lowerQuery = query.toLowerCase();
      this.filteredItems = this.items.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
        const subtitleMatch = item.subtitle?.toLowerCase().includes(lowerQuery);
        return titleMatch || subtitleMatch;
      });
    }

    this.selectedIndex = 0;
    this.render();
  }

  render() {
    if (this.filteredItems.length === 0) {
      this.results.innerHTML = `<div class="command-palette-empty">${this.t('noResults')}</div>`;
      return;
    }

    let html = '';
    let currentType = null;

    this.filteredItems.forEach((item, index) => {
      // Add category header
      if (item.type !== currentType) {
        currentType = item.type;
        const categoryName = item.type === 'command' ? this.t('commands') : this.t('recentFiles');
        html += `<div class="command-palette-category">${categoryName}</div>`;
      }

      const selectedClass = index === this.selectedIndex ? 'selected' : '';
      const shortcut = item.shortcut ? `<span class="command-palette-item-shortcut">${item.shortcut}</span>` : '';

      // Highlight matched text
      const query = this.input.value.toLowerCase();
      let title = item.title;
      if (query) {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        title = title.replace(regex, '<mark>$1</mark>');
      }

      html += `
        <div class="command-palette-item ${selectedClass}" data-index="${index}">
          <div class="command-palette-item-icon">${item.icon}</div>
          <div class="command-palette-item-content">
            <div class="command-palette-item-title">${title}</div>
            ${item.subtitle ? `<div class="command-palette-item-subtitle">${item.subtitle}</div>` : ''}
          </div>
          ${shortcut}
        </div>
      `;
    });

    this.results.innerHTML = html;

    // Bind click events
    this.results.querySelectorAll('.command-palette-item').forEach(el => {
      el.addEventListener('click', () => {
        const index = parseInt(el.getAttribute('data-index'));
        this.selectedIndex = index;
        this.executeSelected();
      });
    });

    // Scroll selected item into view
    this.scrollToSelected();
  }

  selectNext() {
    if (this.filteredItems.length === 0) return;
    this.selectedIndex = (this.selectedIndex + 1) % this.filteredItems.length;
    this.updateSelection();
  }

  selectPrevious() {
    if (this.filteredItems.length === 0) return;
    this.selectedIndex = (this.selectedIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
    this.updateSelection();
  }

  updateSelection() {
    const items = this.results.querySelectorAll('.command-palette-item');
    items.forEach((el, index) => {
      if (index === this.selectedIndex) {
        el.classList.add('selected');
      } else {
        el.classList.remove('selected');
      }
    });
    this.scrollToSelected();
  }

  scrollToSelected() {
    const selectedEl = this.results.querySelector('.command-palette-item.selected');
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  executeSelected() {
    if (this.filteredItems.length === 0) return;

    const item = this.filteredItems[this.selectedIndex];
    if (item && item.action) {
      item.action();
      this.close();
    }
  }

  open() {
    this.isOpen = true;
    this.overlay.classList.add('active');
    this.input.value = '';
    this.loadRecentFiles(); // Refresh recent files
    this.filter('');

    // Focus input after a short delay to ensure animation
    setTimeout(() => {
      this.input.focus();
    }, 100);
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.remove('active');
    this.input.value = '';
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

// Initialize on DOM ready
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CommandPalette;
}
