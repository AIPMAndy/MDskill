/**
 * WeChat Preview Modal
 * Shows a preview before copying to WeChat
 */

class WeChatPreviewModal {
  constructor() {
    this.modal = null;
    this.onConfirm = null;
  }

  show(htmlContent, themeName) {
    return new Promise((resolve) => {
      this.onConfirm = resolve;
      this.createModal(htmlContent, themeName);

      // Show modal with slight delay for animation
      setTimeout(() => {
        this.modal.classList.add('active');
      }, 10);
    });
  }

  createModal(htmlContent, themeName) {
    // Remove existing modal if any
    this.remove();

    const t = window.i18nHelpers ? window.i18nHelpers.t : (key) => key;

    const modal = document.createElement('div');
    modal.className = 'wechat-preview-modal';
    modal.id = 'wechatPreviewModal';

    modal.innerHTML = `
      <div class="wechat-preview-overlay"></div>
      <div class="wechat-preview-content">
        <div class="wechat-preview-header">
          <h2>
            <span>${t('wechatPreview.title')}</span>
            <span class="wechat-preview-theme-badge">${themeName}</span>
          </h2>
          <button class="wechat-preview-close-btn" id="wechatPreviewClose">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
            </svg>
          </button>
        </div>
        <div class="wechat-preview-body" id="wechatPreviewBody">
          ${htmlContent}
        </div>
        <div class="wechat-preview-footer">
          <button class="wechat-preview-btn wechat-preview-btn-secondary" id="wechatPreviewCancel">
            ${t('wechatPreview.cancel')}
          </button>
          <button class="wechat-preview-btn wechat-preview-btn-primary" id="wechatPreviewConfirm">
            <svg width="16" height="16" viewBox="0 0 1024 1024" fill="currentColor">
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"/>
            </svg>
            ${t('wechatPreview.copyToWechat')}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;

    // Event listeners
    const closeBtn = modal.querySelector('#wechatPreviewClose');
    const overlay = modal.querySelector('.wechat-preview-overlay');
    const cancelBtn = modal.querySelector('#wechatPreviewCancel');
    const confirmBtn = modal.querySelector('#wechatPreviewConfirm');

    closeBtn.addEventListener('click', () => this.close(false));
    overlay.addEventListener('click', () => this.close(false));
    cancelBtn.addEventListener('click', () => this.close(false));
    confirmBtn.addEventListener('click', () => this.close(true));

    // ESC key to close
    this.escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.close(false);
      }
    };
    document.addEventListener('keydown', this.escapeHandler);
  }

  close(confirmed) {
    if (this.modal) {
      this.modal.classList.remove('active');

      setTimeout(() => {
        this.remove();
        if (this.onConfirm) {
          this.onConfirm(confirmed);
          this.onConfirm = null;
        }
      }, 200);
    }
  }

  remove() {
    const existing = document.getElementById('wechatPreviewModal');
    if (existing) {
      existing.remove();
    }

    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
      this.escapeHandler = null;
    }

    this.modal = null;
  }
}

// Export to window
if (typeof window !== 'undefined') {
  window.WeChatPreviewModal = WeChatPreviewModal;
}
