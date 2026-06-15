/**
 * Welcome Modal for First-time Users
 * Shows value proposition and quick start options
 */

let welcomeModalShown = false;

function createWelcomeModal() {
  const modal = document.createElement('div');
  modal.id = 'welcome-modal';
  modal.className = 'welcome-modal';

  modal.innerHTML = `
    <div class="welcome-modal-overlay"></div>
    <div class="welcome-modal-content">
      <button class="welcome-close-btn" id="closeWelcome">
        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
        </svg>
      </button>

      <div class="welcome-header">
        <div class="welcome-icon">✨</div>
        <h1 class="welcome-title" id="welcomeTitle">Welcome to MDskill</h1>
        <p class="welcome-subtitle" id="welcomeSubtitle">Professional Markdown Editor</p>
      </div>

      <div class="welcome-features">
        <div class="welcome-feature">
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title" id="feature1Title">Beautiful Themes</h3>
          <p class="feature-desc" id="feature1Desc">13+ professional themes for every platform</p>
        </div>
        <div class="welcome-feature">
          <div class="feature-icon">🚀</div>
          <h3 class="feature-title" id="feature2Title">One-Click Export</h3>
          <p class="feature-desc" id="feature2Desc">WeChat, Medium, Dev.to, and more</p>
        </div>
        <div class="welcome-feature">
          <div class="feature-icon">📄</div>
          <h3 class="feature-title" id="feature3Title">Professional PDF</h3>
          <p class="feature-desc" id="feature3Desc">High-quality PDF with auto table of contents</p>
        </div>
        <div class="welcome-feature">
          <div class="feature-icon">🤖</div>
          <h3 class="feature-title" id="feature4Title">AI Formatting</h3>
          <p class="feature-desc" id="feature4Desc">Transform messy text into beautiful Markdown</p>
        </div>
      </div>

      <div class="welcome-actions">
        <button class="welcome-btn welcome-btn-primary" id="loadSampleBtn">
          <span id="loadSampleText">Load Sample Document</span>
        </button>
        <button class="welcome-btn welcome-btn-secondary" id="startBlankBtn">
          <span id="startBlankText">Start from Blank</span>
        </button>
      </div>

      <div class="welcome-footer">
        <label class="welcome-checkbox">
          <input type="checkbox" id="dontShowAgain">
          <span id="dontShowAgainText">Don't show this again</span>
        </label>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Event handlers
  const closeBtn = modal.querySelector('#closeWelcome');
  const loadSampleBtn = modal.querySelector('#loadSampleBtn');
  const startBlankBtn = modal.querySelector('#startBlankBtn');
  const overlay = modal.querySelector('.welcome-modal-overlay');
  const dontShowCheckbox = modal.querySelector('#dontShowAgain');

  function closeModal() {
    if (dontShowCheckbox.checked) {
      localStorage.setItem('mdskill_welcome_shown', 'true');
    }
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  startBlankBtn.addEventListener('click', closeModal);

  loadSampleBtn.addEventListener('click', () => {
    loadSampleDocument();
    closeModal();
  });

  return modal;
}

function loadSampleDocument() {
  const t = window.i18nHelpers ? window.i18nHelpers.t : (key) => key;

  const sampleContent = t('welcome.sampleDocument');

  const editor = document.getElementById('editor');
  if (editor) {
    editor.value = sampleContent;
    // Trigger preview update
    if (window.updatePreview) {
      window.updatePreview();
    }
  }
}

function showWelcomeModal() {
  // Check if already shown
  const hasShown = localStorage.getItem('mdskill_welcome_shown');
  if (hasShown === 'true' || welcomeModalShown) {
    return;
  }

  welcomeModalShown = true;
  const modal = createWelcomeModal();

  // Initialize i18n
  refreshWelcomeI18n();

  // Show with slight delay for better UX
  setTimeout(() => {
    modal.classList.add('active');
  }, 500);
}

function refreshWelcomeI18n() {
  const t = window.i18nHelpers ? window.i18nHelpers.t : (key) => key;

  const modal = document.getElementById('welcome-modal');
  if (!modal) return;

  // Update text content
  const updates = {
    'welcomeTitle': 'welcome.title',
    'welcomeSubtitle': 'welcome.subtitle',
    'feature1Title': 'welcome.feature1Title',
    'feature1Desc': 'welcome.feature1Desc',
    'feature2Title': 'welcome.feature2Title',
    'feature2Desc': 'welcome.feature2Desc',
    'feature3Title': 'welcome.feature3Title',
    'feature3Desc': 'welcome.feature3Desc',
    'feature4Title': 'welcome.feature4Title',
    'feature4Desc': 'welcome.feature4Desc',
    'loadSampleText': 'welcome.loadSample',
    'startBlankText': 'welcome.startBlank',
    'dontShowAgainText': 'welcome.dontShowAgain'
  };

  for (const [id, key] of Object.entries(updates)) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = t(key);
    }
  }
}

// Export functions
window.welcomeModal = {
  show: showWelcomeModal,
  refresh: refreshWelcomeI18n
};

// Auto-show on first launch
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    // Wait for i18n to initialize
    setTimeout(showWelcomeModal, 1000);
  });
}
