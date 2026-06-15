// renderer.js 消息辅助函数
// Message helper functions for renderer.js

const { t, getCurrentLanguage, setLanguage } = require('../i18n/locales');

// 显示本地化的 alert
function showAlert(key, params = {}) {
  const message = t(key, params);
  alert(message);
}

// 显示本地化的 confirm
function showConfirm(key, params = {}) {
  const message = t(key, params);
  return confirm(message);
}

// 获取本地化消息（不弹窗）
function getMessage(key, params = {}) {
  return t(key, params);
}

function markI18nReady() {
  if (typeof document === 'undefined' || !document.body) {
    return;
  }

  document.body.classList.remove('i18n-loading');
  document.body.classList.add('i18n-ready');
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { showAlert, showConfirm, getMessage, getCurrentLanguage, setLanguage, t, markI18nReady };
}

// 也挂载到 window 供其他脚本使用
if (typeof window !== 'undefined') {
  window.i18nHelpers = { showAlert, showConfirm, getMessage, getCurrentLanguage, setLanguage, t, markI18nReady };
}
