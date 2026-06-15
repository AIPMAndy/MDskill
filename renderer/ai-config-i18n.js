// AI Config page internationalization

function initAiConfigI18n() {
  const t = window.i18nHelpers ? window.i18nHelpers.t : (key) => key;
  const lang = window.i18nHelpers ? window.i18nHelpers.getCurrentLanguage() : 'en';

  // Update page title
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = t('aiConfigPage.title');
  if (window.i18nHelpers && typeof require !== 'undefined') {
    require('electron').ipcRenderer.send('set-window-title', document.title);
  }

  // Update header
  document.querySelector('h2').textContent = t('aiConfigPage.title');
  document.querySelector('.description').textContent = t('aiConfigPage.description');

  // Update warning box
  document.querySelector('.warning-title').textContent = t('aiConfigPage.warningTitle');
  const warningTextLines = t('aiConfigPage.warningText').split('\n\n');
  const warningTextElement = document.querySelector('.warning-text');
  warningTextElement.innerHTML = warningTextLines
    .map((line) => line.replace(/\n/g, '<br>'))
    .join('<br><br>') +
    '<br><a href="https://platform.deepseek.com/api_keys" target="_blank">' +
    t('aiConfigPage.getDeepSeekKey') + '</a>';

  // Update tabs
  const tabs = document.querySelectorAll('.tab-btn');
  tabs[0].textContent = t('aiConfigPage.tabUI');
  tabs[1].textContent = t('aiConfigPage.tabJSON');

  // Update form labels
  document.querySelector('label[for="provider"]').textContent = t('aiConfigPage.providerLabel');
  document.querySelector('label[for="apiKey"]').textContent = t('aiConfigPage.apiKeyLabel');
  document.querySelector('label[for="model"]').textContent = t('aiConfigPage.modelLabel');
  document.querySelector('label[for="endpoint"]').textContent = t('aiConfigPage.endpointLabel');

  // Update select options
  const providerSelect = document.getElementById('provider');
  providerSelect.querySelector('option[value=""]').textContent = t('aiConfigPage.providerPlaceholder');
  providerSelect.querySelector('option[value="openai"]').textContent = t('aiConfigPage.providerOpenAI');
  providerSelect.querySelector('option[value="anthropic"]').textContent = t('aiConfigPage.providerAnthropic');
  providerSelect.querySelector('option[value="deepseek"]').textContent = t('aiConfigPage.providerDeepSeek');
  providerSelect.querySelector('option[value="zhipu"]').textContent = t('aiConfigPage.providerZhipu');
  providerSelect.querySelector('option[value="moonshot"]').textContent = t('aiConfigPage.providerMoonshot');
  providerSelect.querySelector('option[value="custom"]').textContent = t('aiConfigPage.providerCustom');

  // Update input placeholders
  document.getElementById('apiKey').placeholder = t('aiConfigPage.apiKeyPlaceholder');
  document.getElementById('model').placeholder = t('aiConfigPage.modelPlaceholder');
  document.getElementById('endpoint').placeholder = t('aiConfigPage.endpointPlaceholder');

  // Update hints
  document.querySelector('#apiKey + .hint').textContent = t('aiConfigPage.apiKeyHint');
  document.getElementById('modelHint').textContent = t('aiConfigPage.modelHint');

  // Update buttons
  document.getElementById('cancelBtn').textContent = t('aiConfigPage.cancel');
  document.querySelector('button[type="submit"]').textContent = t('aiConfigPage.saveAndConvert');
  document.getElementById('cancelJsonBtn').textContent = t('aiConfigPage.cancelJSON');
  document.getElementById('saveJsonBtn').textContent = t('aiConfigPage.saveJSON');

  // Update JSON config
  document.querySelector('label[for="jsonConfig"]').textContent = t('aiConfigPage.jsonConfigLabel');
  document.getElementById('jsonConfig').placeholder = t('aiConfigPage.jsonConfigPlaceholder');
  document.querySelector('#jsonConfig + .hint').textContent = t('aiConfigPage.jsonConfigHint');

  if (typeof window.updateProviderUI === 'function') {
    window.updateProviderUI(document.getElementById('provider').value);
  }

  if (window.i18nHelpers && window.i18nHelpers.markI18nReady) {
    window.i18nHelpers.markI18nReady();
  }
}

// Override alert messages in the script
if (typeof window !== 'undefined') {
  window.aiConfigAlerts = {
    fillApiKey: () => window.i18nHelpers ? window.i18nHelpers.t('aiConfigPage.alertFillApiKey') : 'Please enter API Key',
    fillModel: () => window.i18nHelpers ? window.i18nHelpers.t('aiConfigPage.alertFillModel') : 'Please enter model name',
    jsonError: (error) => {
      const msg = window.i18nHelpers ? window.i18nHelpers.t('aiConfigPage.alertJsonError') : 'JSON format error: {error}';
      return msg.replace('{error}', error);
    },
    jsonMissingApiKey: () => window.i18nHelpers ? window.i18nHelpers.t('aiConfigPage.alertJsonMissingApiKey') : 'Config error: missing apiKey field'
  };
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAiConfigI18n);
} else {
  initAiConfigI18n();
}

if (typeof require !== 'undefined') {
  require('electron').ipcRenderer.on('language-changed', (event, lang) => {
    if (window.i18nHelpers && window.i18nHelpers.setLanguage) {
      window.i18nHelpers.setLanguage(lang);
    }
    initAiConfigI18n();
  });
}
