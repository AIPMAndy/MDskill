// Find and Replace functionality
class FindReplace {
  constructor(editor) {
    this.editor = editor;
    this.isOpen = false;
    this.matches = [];
    this.currentMatchIndex = -1;
    this.lastSearchQuery = '';

    this.init();
  }

  init() {
    this.createModal();
    this.attachEventListeners();
  }

  t(key, params = {}) {
    if (window.i18nHelpers) {
      return window.i18nHelpers.t(`findReplaceModal.${key}`, params);
    }
    const fallback = {
      title: 'Find and Replace',
      findLabel: 'Find',
      findPlaceholder: 'Enter text to find',
      previous: 'Previous (Shift+Enter)',
      next: 'Next (Enter)',
      caseSensitive: 'Case sensitive',
      wholeWord: 'Whole word',
      regex: 'Regular expression',
      replaceLabel: 'Replace with',
      replacePlaceholder: 'Enter replacement',
      replace: 'Replace',
      replaceAll: 'Replace All',
      noMatches: 'No matches',
      replacedOne: 'Replaced 1 match',
      replacedMany: 'Replaced {count} matches',
      close: 'Close'
    };
    let value = fallback[key] || key;
    Object.keys(params).forEach(paramKey => {
      value = value.replace(`{${paramKey}}`, params[paramKey]);
    });
    return value;
  }

  createModal() {
    const modal = document.createElement('div');
    modal.className = 'find-replace-modal';
    modal.innerHTML = `
      <div class="find-replace-header">
        <div class="find-replace-title" data-i18n="title">${this.t('title')}</div>
        <button class="find-replace-close" id="findReplaceClose" title="${this.t('close')}">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
      <div class="find-replace-body">
        <div class="find-replace-row">
          <div class="find-replace-label" data-i18n="findLabel">${this.t('findLabel')}</div>
          <div class="find-replace-input-wrapper">
            <input type="text" class="find-replace-input" id="findInput" placeholder="${this.t('findPlaceholder')}">
            <div class="find-nav-buttons">
              <button class="find-nav-btn" id="findPrevBtn" title="${this.t('previous')}">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
                </svg>
              </button>
              <button class="find-nav-btn" id="findNextBtn" title="${this.t('next')}">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                </svg>
              </button>
            </div>
            <div class="find-replace-counter" id="findCounter"></div>
          </div>
        </div>
        <div class="find-replace-options">
          <div class="find-replace-checkbox">
            <input type="checkbox" id="caseSensitiveCheckbox">
            <label for="caseSensitiveCheckbox" data-i18n="caseSensitive">${this.t('caseSensitive')}</label>
          </div>
          <div class="find-replace-checkbox">
            <input type="checkbox" id="wholeWordCheckbox">
            <label for="wholeWordCheckbox" data-i18n="wholeWord">${this.t('wholeWord')}</label>
          </div>
          <div class="find-replace-checkbox">
            <input type="checkbox" id="regexCheckbox">
            <label for="regexCheckbox" data-i18n="regex">${this.t('regex')}</label>
          </div>
        </div>
        <div class="find-replace-row" style="margin-top: 16px;">
          <div class="find-replace-label" data-i18n="replaceLabel">${this.t('replaceLabel')}</div>
          <div class="find-replace-input-wrapper">
            <input type="text" class="find-replace-input" id="replaceInput" placeholder="${this.t('replacePlaceholder')}">
          </div>
        </div>
      </div>
      <div class="find-replace-actions">
        <button class="find-replace-btn find-replace-btn-secondary" id="replaceBtn" data-i18n="replace">${this.t('replace')}</button>
        <button class="find-replace-btn find-replace-btn-danger" id="replaceAllBtn" data-i18n="replaceAll">${this.t('replaceAll')}</button>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;

    // Get references to elements
    this.findInput = modal.querySelector('#findInput');
    this.replaceInput = modal.querySelector('#replaceInput');
    this.findCounter = modal.querySelector('#findCounter');
    this.caseSensitiveCheckbox = modal.querySelector('#caseSensitiveCheckbox');
    this.wholeWordCheckbox = modal.querySelector('#wholeWordCheckbox');
    this.regexCheckbox = modal.querySelector('#regexCheckbox');
    this.replaceBtn = modal.querySelector('#replaceBtn');
    this.replaceAllBtn = modal.querySelector('#replaceAllBtn');
    this.findPrevBtn = modal.querySelector('#findPrevBtn');
    this.findNextBtn = modal.querySelector('#findNextBtn');
  }

  refreshI18n() {
    if (!this.modal) return;

    this.modal.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = this.t(element.dataset.i18n);
    });
    this.modal.querySelector('#findInput').placeholder = this.t('findPlaceholder');
    this.modal.querySelector('#replaceInput').placeholder = this.t('replacePlaceholder');
    this.findPrevBtn.title = this.t('previous');
    this.findNextBtn.title = this.t('next');
    this.modal.querySelector('#findReplaceClose').title = this.t('close');
    this.updateCounter(
      this.matches.length > 0 ? this.currentMatchIndex + 1 : 0,
      this.matches.length
    );
  }

  attachEventListeners() {
    // Close button
    this.modal.querySelector('#findReplaceClose').addEventListener('click', () => {
      this.close();
    });

    // Find input
    this.findInput.addEventListener('input', () => {
      this.search();
    });

    this.findInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          this.findPrevious();
        } else {
          this.findNext();
        }
      } else if (e.key === 'Escape') {
        this.close();
      }
    });

    // Replace input
    this.replaceInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.replaceCurrent();
      } else if (e.key === 'Escape') {
        this.close();
      }
    });

    // Checkboxes
    [this.caseSensitiveCheckbox, this.wholeWordCheckbox, this.regexCheckbox].forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.search();
      });
    });

    // Navigation buttons
    this.findPrevBtn.addEventListener('click', () => this.findPrevious());
    this.findNextBtn.addEventListener('click', () => this.findNext());

    // Replace buttons
    this.replaceBtn.addEventListener('click', () => this.replaceCurrent());
    this.replaceAllBtn.addEventListener('click', () => this.replaceAll());

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.modal.contains(e.target) && e.target.id !== 'searchBtn') {
        this.close();
      }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    if (typeof require !== 'undefined') {
      require('electron').ipcRenderer.on('language-changed', () => {
        this.refreshI18n();
      });
    }
  }

  open(mode = 'find') {
    this.isOpen = true;
    this.modal.classList.add('visible');

    // Focus appropriate input
    if (mode === 'replace') {
      this.findInput.focus();
    } else {
      this.findInput.focus();
    }

    // Select any existing text
    this.findInput.select();

    // If there's selected text in editor, use it as search query
    const selectedText = this.getSelectedText();
    if (selectedText) {
      this.findInput.value = selectedText;
      this.search();
    }
  }

  close() {
    this.isOpen = false;
    this.modal.classList.remove('visible');
    this.clearHighlights();
    this.editor.focus();
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  getSelectedText() {
    const selection = window.getSelection();
    return selection.toString().trim();
  }

  search() {
    const query = this.findInput.value;

    if (!query) {
      this.clearHighlights();
      this.updateCounter(0, 0);
      this.updateButtonStates();
      return;
    }

    this.lastSearchQuery = query;
    this.matches = [];
    this.currentMatchIndex = -1;

    const content = this.editor.value;
    const options = this.getSearchOptions();

    try {
      let regex;
      if (options.regex) {
        regex = new RegExp(query, options.caseSensitive ? 'g' : 'gi');
      } else {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = options.wholeWord ? `\\b${escapedQuery}\\b` : escapedQuery;
        regex = new RegExp(pattern, options.caseSensitive ? 'g' : 'gi');
      }

      let match;
      while ((match = regex.exec(content)) !== null) {
        this.matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0]
        });
      }

      if (this.matches.length > 0) {
        this.currentMatchIndex = 0;
        this.highlightMatches();
        this.scrollToMatch(0);
      } else {
        this.clearHighlights();
      }

      this.updateCounter(this.matches.length > 0 ? 1 : 0, this.matches.length);
      this.updateButtonStates();

    } catch (error) {
      // Invalid regex
      this.clearHighlights();
      this.updateCounter(0, 0);
      this.updateButtonStates();
    }
  }

  getSearchOptions() {
    return {
      caseSensitive: this.caseSensitiveCheckbox.checked,
      wholeWord: this.wholeWordCheckbox.checked,
      regex: this.regexCheckbox.checked
    };
  }

  highlightMatches() {
    // Clear existing highlights
    this.clearHighlights();

    if (this.matches.length === 0) return;

    // Add highlight class to editor (we'll use a wrapper div for highlights)
    // Since we can't directly manipulate textarea content, we'll scroll to matches
    // and update the visual feedback through the counter
  }

  clearHighlights() {
    // Remove all highlight elements
    // In a textarea, we can't add HTML highlights, so we rely on selection
  }

  scrollToMatch(index) {
    if (index < 0 || index >= this.matches.length) return;

    const match = this.matches[index];

    // Set selection to the match
    this.editor.setSelectionRange(match.start, match.end);

    // Scroll into view
    this.editor.focus();

    // Calculate line number to scroll to
    const textBeforeMatch = this.editor.value.substring(0, match.start);
    const lineNumber = textBeforeMatch.split('\n').length;

    // Scroll editor (approximate)
    const lineHeight = 22; // Approximate line height
    const scrollTop = (lineNumber - 3) * lineHeight; // -3 to show context
    this.editor.scrollTop = Math.max(0, scrollTop);
  }

  findNext() {
    if (this.matches.length === 0) return;

    this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matches.length;
    this.scrollToMatch(this.currentMatchIndex);
    this.updateCounter(this.currentMatchIndex + 1, this.matches.length);
  }

  findPrevious() {
    if (this.matches.length === 0) return;

    this.currentMatchIndex = (this.currentMatchIndex - 1 + this.matches.length) % this.matches.length;
    this.scrollToMatch(this.currentMatchIndex);
    this.updateCounter(this.currentMatchIndex + 1, this.matches.length);
  }

  replaceCurrent() {
    if (this.currentMatchIndex < 0 || this.matches.length === 0) return;

    const match = this.matches[this.currentMatchIndex];
    const replaceText = this.replaceInput.value;

    // Get current content
    const content = this.editor.value;

    // Replace the match
    const newContent = content.substring(0, match.start) +
                      replaceText +
                      content.substring(match.end);

    // Update editor
    this.editor.value = newContent;

    // Trigger input event for autosave
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));

    // Adjust cursor position
    const newCursorPos = match.start + replaceText.length;
    this.editor.setSelectionRange(newCursorPos, newCursorPos);

    // Re-search to update matches
    this.search();

    // Show toast
    if (window.showToast) {
      window.showToast(this.t('replacedOne'), 'success');
    }
  }

  replaceAll() {
    if (this.matches.length === 0) return;

    const replaceText = this.replaceInput.value;
    const count = this.matches.length;

    // Replace from end to start to maintain positions
    let content = this.editor.value;

    for (let i = this.matches.length - 1; i >= 0; i--) {
      const match = this.matches[i];
      content = content.substring(0, match.start) +
               replaceText +
               content.substring(match.end);
    }

    // Update editor
    this.editor.value = content;

    // Trigger input event for autosave
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));

    // Clear and re-search
    this.search();

    // Show toast
    if (window.showToast) {
      window.showToast(this.t('replacedMany', { count }), 'success');
    }
  }

  updateCounter(current, total) {
    if (total === 0) {
      this.findCounter.textContent = this.t('noMatches');
      this.findCounter.style.color = '#858585';
    } else {
      this.findCounter.textContent = `${current}/${total}`;
      this.findCounter.style.color = '#cccccc';
    }
  }

  updateButtonStates() {
    const hasMatches = this.matches.length > 0;
    this.findPrevBtn.disabled = !hasMatches;
    this.findNextBtn.disabled = !hasMatches;
    this.replaceBtn.disabled = !hasMatches || this.currentMatchIndex < 0;
    this.replaceAllBtn.disabled = !hasMatches;
  }
}

// Export for use in renderer.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FindReplace;
}
