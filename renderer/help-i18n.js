// Help page internationalization

function initHelpI18n() {
  const t = window.i18nHelpers ? window.i18nHelpers.t : (key) => key;
  const lang = window.i18nHelpers ? window.i18nHelpers.getCurrentLanguage() : 'en';
  const appVersion = getAppVersion();

  // Update page title
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = t('helpPage.title');
  if (window.i18nHelpers && typeof require !== 'undefined') {
    require('electron').ipcRenderer.send('set-window-title', document.title);
  }

  // Update header
  document.querySelector('.app-name').textContent = t('helpPage.appName');
  document.querySelector('.app-version').textContent = t('helpPage.appTagline');

  // Update tabs
  const tabs = document.querySelectorAll('.tab');
  tabs[0].textContent = t('helpPage.tabFeatures');
  tabs[1].textContent = t('helpPage.tabShortcuts');
  tabs[2].textContent = t('helpPage.tabFaq');
  tabs[3].textContent = t('helpPage.tabAbout');

  // Update features tab
  const featureCards = document.querySelectorAll('.feature-card');
  const featureData = [
    { title: 'featureWechatTitle', desc: 'featureWechatDesc' },
    { title: 'featureBlogTitle', desc: 'featureBlogDesc' },
    { title: 'featureThemesTitle', desc: 'featureThemesDesc' },
    { title: 'featurePdfTitle', desc: 'featurePdfDesc' },
    { title: 'featureHtmlTitle', desc: 'featureHtmlDesc' },
    { title: 'featurePreviewTitle', desc: 'featurePreviewDesc' }
  ];

  featureCards.forEach((card, i) => {
    if (featureData[i]) {
      card.querySelector('.feature-card-title').textContent = t(`helpPage.${featureData[i].title}`);
      card.querySelector('.feature-card-desc').textContent = t(`helpPage.${featureData[i].desc}`);
    }
  });

  // Update section titles in features tab
  const sectionTitles = document.querySelectorAll('#features .section-title');
  if (sectionTitles[0]) sectionTitles[0].textContent = t('helpPage.sectionEditingTitle');
  if (sectionTitles[1]) sectionTitles[1].textContent = t('helpPage.sectionExportTitle');

  // Update editing features
  const editItems = document.querySelectorAll('#features .list-section:first-of-type .list-item');
  const editData = [
    { title: 'editMarkdownTitle', desc: 'editMarkdownDesc' },
    { title: 'editPreviewTitle', desc: 'editPreviewDesc' },
    { title: 'editHighlightTitle', desc: 'editHighlightDesc' }
  ];

  editItems.forEach((item, i) => {
    if (editData[i]) {
      item.querySelector('.item-title').textContent = t(`helpPage.${editData[i].title}`);
      item.querySelector('.item-description').textContent = t(`helpPage.${editData[i].desc}`);
    }
  });

  // Update export features
  const exportItems = document.querySelectorAll('#features .list-section:last-of-type .list-item');
  const exportData = [
    { title: 'exportWechatTitle', desc: 'exportWechatDesc' },
    { title: 'exportBlogTitle', desc: 'exportBlogDesc' },
    { title: 'exportPdfTitle', desc: 'exportPdfDesc' }
  ];

  exportItems.forEach((item, i) => {
    if (exportData[i]) {
      item.querySelector('.item-title').textContent = t(`helpPage.${exportData[i].title}`);
      item.querySelector('.item-description').textContent = t(`helpPage.${exportData[i].desc}`);
    }
  });

  // Update shortcuts tab
  const shortcutSections = document.querySelectorAll('#shortcuts .section-title');
  if (shortcutSections[0]) shortcutSections[0].textContent = t('helpPage.sectionFileTitle');
  if (shortcutSections[1]) shortcutSections[1].textContent = t('helpPage.sectionEditTitle');
  if (shortcutSections[2]) shortcutSections[2].textContent = t('helpPage.sectionFormatTitle');

  const shortcutLabels = document.querySelectorAll('.shortcut-label');
  const shortcuts = [
    'shortcutNew', 'shortcutOpen', 'shortcutSave',
    'shortcutUndo', 'shortcutRedo', 'shortcutFind', 'shortcutReplace',
    'shortcutBold', 'shortcutItalic', 'shortcutLink'
  ];

  shortcutLabels.forEach((label, i) => {
    if (shortcuts[i]) {
      label.textContent = t(`helpPage.${shortcuts[i]}`);
    }
  });

  // Update FAQ tab
  const faqItems = document.querySelectorAll('#faq .list-item');
  const faqData = [
    { q: 'faqCopyWechatQ', a: 'faqCopyWechatA' },
    { q: 'faqThemeQ', a: 'faqThemeA' },
    { q: 'faqPdfQ', a: 'faqPdfA' },
    { q: 'faqBlogQ', a: 'faqBlogA' },
    { q: 'faqActivateQ', a: 'faqActivateA' },
    { q: 'faqTrialQ', a: 'faqTrialA' }
  ];

  faqItems.forEach((item, i) => {
    if (faqData[i]) {
      item.querySelector('.item-title').textContent = t(`helpPage.${faqData[i].q}`);
      item.querySelector('.item-description').textContent = t(`helpPage.${faqData[i].a}`);
    }
  });

  // Update About tab
  document.querySelector('.about-title').textContent = t('helpPage.appName');
  document.querySelector('.about-version').textContent = `${t('helpPage.aboutVersion')} ${appVersion}`;
  document.querySelector('.about-description').innerHTML = t('helpPage.aboutDescription').replace(/\n/g, '<br>');

  const aboutButtons = document.querySelectorAll('.link-btn');
  if (aboutButtons[0]) aboutButtons[0].textContent = t('helpPage.aboutWebsite');
  if (aboutButtons[1]) aboutButtons[1].textContent = t('helpPage.aboutGithub');
  if (aboutButtons[2]) aboutButtons[2].textContent = t('helpPage.aboutFeedback');

  document.querySelector('.about-footer').innerHTML = t('helpPage.aboutFooter').replace(/\n/g, '<br>');

  if (window.i18nHelpers && window.i18nHelpers.markI18nReady) {
    window.i18nHelpers.markI18nReady();
  }
}

function getAppVersion() {
  if (typeof require === 'undefined') {
    return '';
  }

  try {
    return require('../package.json').version;
  } catch (error) {
    return '';
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHelpI18n);
} else {
  initHelpI18n();
}

if (typeof require !== 'undefined') {
  require('electron').ipcRenderer.on('language-changed', (event, lang) => {
    if (window.i18nHelpers && window.i18nHelpers.setLanguage) {
      window.i18nHelpers.setLanguage(lang);
    }
    initHelpI18n();
  });
}
