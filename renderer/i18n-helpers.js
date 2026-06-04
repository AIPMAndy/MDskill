// renderer.js 消息辅助函数
// Message helper functions for renderer.js

const { t, getCurrentLanguage } = require('../i18n/locales');

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

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { showAlert, showConfirm, getMessage };
}

// 也挂载到 window 供其他脚本使用
if (typeof window !== 'undefined') {
  window.i18nHelpers = { showAlert, showConfirm, getMessage, t };
}
