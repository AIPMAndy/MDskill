// Subscription page internationalization

function initSubscriptionI18n() {
  const t = window.i18nHelpers ? window.i18nHelpers.t : (key) => key;
  const lang = window.i18nHelpers ? window.i18nHelpers.getCurrentLanguage() : 'en';

  // Update page title
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = t('subscriptionPage.title') + ' - MDSKILL';
  if (window.i18nHelpers && typeof require !== 'undefined') {
    require('electron').ipcRenderer.send('set-window-title', document.title);
  }

  // Update header
  document.querySelector('.header-title').textContent = t('subscriptionPage.title');
  document.querySelector('.header-subtitle').textContent = t('subscriptionPage.subtitle');

  // Update status section labels
  const statusLabels = document.querySelectorAll('.status-label');
  statusLabels[0].textContent = t('subscriptionPage.userIdLabel');
  statusLabels[1].textContent = t('subscriptionPage.statusLabel');
  statusLabels[2].textContent = t('subscriptionPage.daysLeftLabel');
  statusLabels[3].textContent = t('subscriptionPage.expiryDateLabel');

  // Update features section
  document.querySelector('.features-section .section-title').textContent = t('subscriptionPage.featuresTitle');
  const featureTexts = document.querySelectorAll('.feature-text');
  featureTexts[0].textContent = t('subscriptionPage.featureWechat');
  featureTexts[1].textContent = t('subscriptionPage.featureBlog');
  featureTexts[2].textContent = t('subscriptionPage.featureHTML');
  featureTexts[3].textContent = t('subscriptionPage.featurePDF');
  featureTexts[4].textContent = t('subscriptionPage.featureThemes');

  // Update pricing section
  document.querySelector('.price-period').textContent = t('subscriptionPage.pricePeriod');
  document.querySelector('.pricing-note').textContent = t('subscriptionPage.pricingNote');
  document.querySelector('.pricing-highlight').textContent = t('subscriptionPage.pricingHighlight');

  // Update payment info
  document.querySelector('.payment-note').textContent = t('subscriptionPage.paymentNote');
  const contactLabels = document.querySelectorAll('.payment-info strong');
  if (contactLabels.length >= 2) {
    contactLabels[0].textContent = t('subscriptionPage.wechatLabel');
    contactLabels[1].textContent = t('subscriptionPage.emailLabel');
  }

  // Update buttons
  document.getElementById('activateCodeBtn').textContent = t('subscriptionPage.btnActivateCode');
  document.getElementById('laterBtn').textContent = t('subscriptionPage.btnLater');
  document.getElementById('resetBtn').textContent = t('subscriptionPage.btnReset');

  // Update user info section
  const infoLabels = document.querySelectorAll('.info-label');
  infoLabels[0].textContent = t('subscriptionPage.deviceIdLabel');
  infoLabels[1].textContent = t('subscriptionPage.lastVerifiedLabel');

  // Update modal
  document.querySelector('.modal-title').textContent = t('subscriptionPage.modalTitle');
  document.getElementById('activationCodeInput').placeholder = t('subscriptionPage.modalPlaceholder');
  document.getElementById('cancelBtn').textContent = t('subscriptionPage.modalCancel');
  document.getElementById('confirmActivateBtn').textContent = t('subscriptionPage.modalActivate');

  // Store alert messages for runtime use
  if (typeof window !== 'undefined') {
    window.subscriptionAlerts = {
      enterCode: () => t('subscriptionPage.alertEnterCode'),
      activateSuccess: (months, date) => t('subscriptionPage.alertActivateSuccess', { months, date }),
      activateFailed: (error) => t('subscriptionPage.alertActivateFailed', { error }),
      confirmReset: () => t('subscriptionPage.confirmReset'),
      resetSuccess: () => t('subscriptionPage.alertResetSuccess'),
      resetFailed: (error) => t('subscriptionPage.alertResetFailed', { error }),
      statusTrial: () => t('subscriptionPage.statusTrial'),
      statusActive: () => t('subscriptionPage.statusActive'),
      statusExpired: () => t('subscriptionPage.statusExpired'),
      daysUnit: () => t('subscriptionPage.daysUnit'),
      loading: () => t('subscriptionPage.loading'),
      unknownError: () => t('subscriptionPage.unknownError'),
      ipcUnavailableRequire: () => t('subscriptionPage.ipcUnavailableRequire'),
      ipcUnavailableUndefined: () => t('subscriptionPage.ipcUnavailableUndefined')
    };
  }

  const daysUnit = document.getElementById('daysUnit');
  if (daysUnit) {
    daysUnit.textContent = t('subscriptionPage.daysUnit');
  }

  if (window.i18nHelpers && window.i18nHelpers.markI18nReady) {
    window.i18nHelpers.markI18nReady();
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSubscriptionI18n);
} else {
  initSubscriptionI18n();
}

if (typeof require !== 'undefined') {
  require('electron').ipcRenderer.on('language-changed', (event, lang) => {
    if (window.i18nHelpers && window.i18nHelpers.setLanguage) {
      window.i18nHelpers.setLanguage(lang);
    }
    initSubscriptionI18n();
    if (typeof window.loadSubscriptionInfo === 'function') {
      window.loadSubscriptionInfo();
    }
  });
}
