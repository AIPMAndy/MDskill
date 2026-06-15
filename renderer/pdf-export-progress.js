// PDF Export Progress Manager

class PDFExportProgress {
  constructor() {
    this.overlay = null;
    this.progressBar = null;
    this.statusText = null;
    this.onCancel = null;
  }

  show(fileName = 'document.pdf') {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'pdf-export-overlay';

    this.overlay.innerHTML = `
      <div class="pdf-export-content">
        <div class="pdf-export-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        </div>
        <div class="pdf-export-spinner"></div>
        <div class="pdf-export-title">Exporting PDF...</div>
        <div class="pdf-export-message">${this.escapeHtml(fileName)}</div>
        <div class="pdf-export-progress">
          <div class="pdf-export-progress-bar" style="width: 30%"></div>
        </div>
        <div class="pdf-export-status">Preparing document...</div>
        <button class="pdf-export-cancel">Cancel</button>
      </div>
    `;

    document.body.appendChild(this.overlay);

    // Get references
    this.progressBar = this.overlay.querySelector('.pdf-export-progress-bar');
    this.statusText = this.overlay.querySelector('.pdf-export-status');

    // Bind cancel button
    const cancelBtn = this.overlay.querySelector('.pdf-export-cancel');
    cancelBtn.addEventListener('click', () => {
      if (this.onCancel) {
        this.onCancel();
      }
      this.hide();
    });

    // Simulate progress
    this.simulateProgress();
  }

  simulateProgress() {
    const steps = [
      { progress: 30, status: 'Preparing document...', delay: 100 },
      { progress: 50, status: 'Rendering content...', delay: 300 },
      { progress: 70, status: 'Applying styles...', delay: 500 },
      { progress: 85, status: 'Generating PDF...', delay: 700 },
      { progress: 95, status: 'Finalizing...', delay: 900 }
    ];

    steps.forEach(step => {
      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          this.updateProgress(step.progress, step.status);
        }
      }, step.delay);
    });
  }

  updateProgress(percent, status) {
    if (this.progressBar) {
      this.progressBar.style.width = `${percent}%`;
    }
    if (this.statusText && status) {
      this.statusText.textContent = status;
    }
  }

  hide() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.remove();
    }
    this.overlay = null;
    this.progressBar = null;
    this.statusText = null;
    this.onCancel = null;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export for use in renderer.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PDFExportProgress;
}
