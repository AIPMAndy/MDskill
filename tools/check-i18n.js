#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { t } = require('../i18n/locales');

const rootDir = path.resolve(__dirname, '..');
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const packageLock = JSON.parse(fs.readFileSync(path.join(rootDir, 'package-lock.json'), 'utf8'));

const requiredMenuKeys = [
  'file',
  'newWindow',
  'open',
  'recentDocuments',
  'noRecentDocuments',
  'clearRecentDocuments',
  'save',
  'saveAs',
  'export',
  'copyForWeChat',
  'copyForBlog',
  'copyHTMLSource',
  'exportAsPDF',
  'close',
  'quit',
  'edit',
  'undo',
  'redo',
  'cut',
  'copy',
  'paste',
  'selectAll',
  'find',
  'findReplace',
  'view',
  'togglePreview',
  'reload',
  'toggleDevTools',
  'codeBlockLineNumbers',
  'resetZoom',
  'zoomIn',
  'zoomOut',
  'toggleFullscreen',
  'window',
  'minimize',
  'zoom',
  'front',
  'help',
  'about',
  'aiConfig',
  'activatePro',
  'getDeviceFingerprint',
  'contactDeveloper',
  'deviceFingerprintTitle',
  'deviceFingerprintMessage',
  'copyButton',
  'contactDeveloperTitle',
  'contactDeveloperMessage',
  'contactDeveloperDetail',
  'openFileFailedTitle',
  'openFileFailedMessage',
  'language',
  'switchToEnglish',
  'switchToChinese'
];

const requiredRendererKeys = [
  'editor.placeholder',
  'branding.madeBy',
  'status.wordsChars',
  'status.savedSecondsAgo',
  'status.savedMinutesAgo',
  'status.notSaved',
  'aiProgress.formatting',
  'aiProgress.cancel',
  'subscriptionMessages.expiring',
  'subscriptionMessages.expired',
  'subscriptionMessages.featureLocked',
  'featureNames.themes',
  'featureNames.premiumThemes',
  'featureNames.pdfExport',
  'featureNames.wechatCopy',
  'featureNames.blogCopy',
  'featureNames.htmlExport',
  'activationPrompt.message'
];

const requiredHelpKeys = [
  'helpPage.title',
  'helpPage.appName',
  'helpPage.appTagline',
  'helpPage.tabFeatures',
  'helpPage.tabShortcuts',
  'helpPage.tabFaq',
  'helpPage.tabAbout',
  'helpPage.featureWechatTitle',
  'helpPage.featureWechatDesc',
  'helpPage.featureBlogTitle',
  'helpPage.featureBlogDesc',
  'helpPage.featureThemesTitle',
  'helpPage.featureThemesDesc',
  'helpPage.featurePdfTitle',
  'helpPage.featurePdfDesc',
  'helpPage.featureHtmlTitle',
  'helpPage.featureHtmlDesc',
  'helpPage.featurePreviewTitle',
  'helpPage.featurePreviewDesc',
  'helpPage.aboutFooter'
];

const requiredAiConfigPageKeys = [
  'aiConfigPage.title',
  'aiConfigPage.description',
  'aiConfigPage.warningTitle',
  'aiConfigPage.warningText',
  'aiConfigPage.getDeepSeekKey',
  'aiConfigPage.tabUI',
  'aiConfigPage.tabJSON',
  'aiConfigPage.providerLabel',
  'aiConfigPage.providerPlaceholder',
  'aiConfigPage.providerDeepSeek',
  'aiConfigPage.apiKeyHint',
  'aiConfigPage.modelHint',
  'aiConfigPage.providerInfoOpenAI',
  'aiConfigPage.providerInfoAnthropic',
  'aiConfigPage.providerInfoDeepSeek',
  'aiConfigPage.providerInfoZhipu',
  'aiConfigPage.providerInfoMoonshot',
  'aiConfigPage.modelPlaceholderOpenAI',
  'aiConfigPage.modelHintOpenAI',
  'aiConfigPage.modelPlaceholderAnthropic',
  'aiConfigPage.modelHintAnthropic',
  'aiConfigPage.modelPlaceholderDeepSeek',
  'aiConfigPage.modelHintDeepSeek',
  'aiConfigPage.modelPlaceholderZhipu',
  'aiConfigPage.modelHintZhipu',
  'aiConfigPage.modelPlaceholderMoonshot',
  'aiConfigPage.modelHintMoonshot',
  'aiConfigPage.modelPlaceholderCustom',
  'aiConfigPage.modelHintCustom',
  'aiConfigPage.defaultSystemPrompt',
  'aiConfigPage.alertFillApiKey',
  'aiConfigPage.alertFillModel',
  'aiConfigPage.alertJsonError',
  'aiConfigPage.alertJsonMissingApiKey'
];

const requiredSubscriptionPageKeys = [
  'subscriptionPage.title',
  'subscriptionPage.subtitle',
  'subscriptionPage.userIdLabel',
  'subscriptionPage.statusLabel',
  'subscriptionPage.daysLeftLabel',
  'subscriptionPage.expiryDateLabel',
  'subscriptionPage.statusTrial',
  'subscriptionPage.statusActive',
  'subscriptionPage.statusExpired',
  'subscriptionPage.daysUnit',
  'subscriptionPage.featuresTitle',
  'subscriptionPage.featureWechat',
  'subscriptionPage.featureBlog',
  'subscriptionPage.featureHTML',
  'subscriptionPage.featurePDF',
  'subscriptionPage.featureThemes',
  'subscriptionPage.pricePeriod',
  'subscriptionPage.pricingNote',
  'subscriptionPage.pricingHighlight',
  'subscriptionPage.paymentNote',
  'subscriptionPage.wechatLabel',
  'subscriptionPage.emailLabel',
  'subscriptionPage.btnActivateCode',
  'subscriptionPage.btnLater',
  'subscriptionPage.deviceIdLabel',
  'subscriptionPage.lastVerifiedLabel',
  'subscriptionPage.btnReset',
  'subscriptionPage.modalTitle',
  'subscriptionPage.modalCancel',
  'subscriptionPage.modalActivate',
  'subscriptionPage.alertEnterCode',
  'subscriptionPage.alertActivateSuccess',
  'subscriptionPage.alertActivateFailed',
  'subscriptionPage.confirmReset',
  'subscriptionPage.alertResetSuccess',
  'subscriptionPage.alertResetFailed',
  'subscriptionPage.unknownError',
  'subscriptionPage.ipcUnavailableRequire',
  'subscriptionPage.ipcUnavailableUndefined',
  'subscriptionPage.loading'
];

const requiredFindReplaceKeys = [
  'findReplaceModal.title',
  'findReplaceModal.findLabel',
  'findReplaceModal.findPlaceholder',
  'findReplaceModal.previous',
  'findReplaceModal.next',
  'findReplaceModal.caseSensitive',
  'findReplaceModal.wholeWord',
  'findReplaceModal.regex',
  'findReplaceModal.replaceLabel',
  'findReplaceModal.replacePlaceholder',
  'findReplaceModal.replace',
  'findReplaceModal.replaceAll',
  'findReplaceModal.noMatches',
  'findReplaceModal.replacedOne',
  'findReplaceModal.replacedMany',
  'findReplaceModal.close'
];

const requiredCommandPaletteKeys = [
  'commandPalette.placeholder',
  'commandPalette.noResults',
  'commandPalette.commands',
  'commandPalette.recentFiles',
  'commandPalette.newWindowTitle',
  'commandPalette.newWindowSubtitle',
  'commandPalette.openFileTitle',
  'commandPalette.openFileSubtitle',
  'commandPalette.saveFileTitle',
  'commandPalette.saveFileSubtitle',
  'commandPalette.changeThemeTitle',
  'commandPalette.changeThemeSubtitle',
  'commandPalette.searchTitle',
  'commandPalette.searchSubtitle',
  'commandPalette.exportPdfTitle',
  'commandPalette.exportPdfSubtitle',
  'commandPalette.openFileFailed'
];

const requiredSidebarKeys = [
  'sidebar.openFolder',
  'sidebar.searchPlaceholder',
  'sidebar.recentOpen',
  'sidebar.noRecentFiles',
  'sidebar.currentFolder',
  'sidebar.noFolder',
  'sidebar.openFolderFirst',
  'sidebar.noMarkdownFiles',
  'sidebar.noMatchingFiles'
];

const requiredActivationPageKeys = [
  'activationPage.title',
  'activationPage.headerTitle',
  'activationPage.headerSubtitle',
  'activationPage.activatedTitle',
  'activationPage.activatedSubtitle',
  'activationPage.activatedDesc',
  'activationPage.activatedDeviceLabel',
  'activationPage.activatedTimeLabel',
  'activationPage.licenseTypeLabel',
  'activationPage.lifetimeLicense',
  'activationPage.unlockedFeaturesTitle',
  'activationPage.benefitsTitle',
  'activationPage.benefitAiTitle',
  'activationPage.benefitAiDesc',
  'activationPage.benefitThemeTitle',
  'activationPage.benefitThemeDesc',
  'activationPage.benefitWechatTitle',
  'activationPage.benefitWechatDesc',
  'activationPage.benefitBlogTitle',
  'activationPage.benefitBlogDesc',
  'activationPage.benefitPdfTitle',
  'activationPage.benefitPdfDesc',
  'activationPage.priceDesc',
  'activationPage.priceBadge',
  'activationPage.freeMember',
  'activationPage.deviceLabel',
  'activationPage.licenseLabel',
  'activationPage.licensePlaceholder',
  'activationPage.cancel',
  'activationPage.activate',
  'activationPage.activating',
  'activationPage.close',
  'activationPage.noLicense',
  'activationPage.activateSuccess',
  'activationPage.activateFailed',
  'activationPage.activateError',
  'activationPage.copied',
  'activationPage.copiedDefault',
  'activationPage.loading',
  'activationPage.loadFailed',
  'activationPage.activatedFallback',
  'activationPage.noLicenseQuestion',
  'activationPage.contactWechat',
  'activationPage.contactInstruction'
];

const failures = [];

function assertTranslated(lang, key) {
  const value = t(key, lang);
  if (typeof value !== 'string' || value === key || value === '') {
    failures.push(`${lang}: missing translation for ${key}`);
  }
}

for (const lang of ['en', 'zh']) {
  for (const key of [
    ...requiredMenuKeys,
    ...requiredRendererKeys,
    ...requiredHelpKeys,
    ...requiredAiConfigPageKeys,
    ...requiredSubscriptionPageKeys,
    ...requiredFindReplaceKeys,
    ...requiredCommandPaletteKeys,
    ...requiredSidebarKeys,
    ...requiredActivationPageKeys
  ]) {
    assertTranslated(lang, key);
  }
}

const helpHtml = fs.readFileSync(path.join(rootDir, 'renderer/help.html'), 'utf8');
const helpI18n = fs.readFileSync(path.join(rootDir, 'renderer/help-i18n.js'), 'utf8');
const i18nHelpers = fs.readFileSync(path.join(rootDir, 'renderer/i18n-helpers.js'), 'utf8');

function assertPageWaitsForI18n(pageName, html, script) {
  if (!/<body[^>]*class="[^"]*\bi18n-loading\b/.test(html)) {
    failures.push(`${pageName} must start with body.i18n-loading to avoid showing hardcoded fallback text before localization`);
  }
  if (!html.includes('body.i18n-loading')) {
    failures.push(`${pageName} must hide body.i18n-loading until localization is applied`);
  }
  if (!script.includes('markI18nReady')) {
    failures.push(`${pageName} localization script must mark the page ready after applying translations`);
  }
}

if (!i18nHelpers.includes('function markI18nReady')) {
  failures.push('renderer/i18n-helpers.js must provide markI18nReady() for localized page readiness');
}

if (!helpHtml.includes('<script src="i18n-helpers.js"></script>')) {
  failures.push('renderer/help.html must load renderer/i18n-helpers.js');
}
if (helpHtml.includes('../i18n/locales.js')) {
  failures.push('renderer/help.html must not load ../i18n/locales.js directly; i18n-helpers.js requires it');
}
if (helpHtml.includes('../i18n/i18n-helpers.js')) {
  failures.push('renderer/help.html references a non-existent ../i18n/i18n-helpers.js path');
}
if (!helpI18n.includes("set-window-title")) {
  failures.push('renderer/help-i18n.js must sync BrowserWindow title after localization');
}
if (!helpI18n.includes("language-changed")) {
  failures.push('renderer/help-i18n.js must refresh when language changes');
}
if (helpI18n.includes("1.6.0") || helpI18n.includes("1.7.0")) {
  failures.push('renderer/help-i18n.js must not hardcode stale app versions');
}
if (!helpI18n.includes('getAppVersion')) {
  failures.push('renderer/help-i18n.js must read the current app version from package metadata');
}
assertPageWaitsForI18n('renderer/help.html', helpHtml, helpI18n);

if (packageLock.version !== packageJson.version || packageLock.packages[''].version !== packageJson.version) {
  failures.push('package-lock.json version must match package.json version before packaging');
}

const aiConfigHtml = fs.readFileSync(path.join(rootDir, 'renderer/ai-config.html'), 'utf8');
const aiConfigI18n = fs.readFileSync(path.join(rootDir, 'renderer/ai-config-i18n.js'), 'utf8');
if (!aiConfigHtml.includes('<script src="i18n-helpers.js"></script>')) {
  failures.push('renderer/ai-config.html must load renderer/i18n-helpers.js');
}
if (!aiConfigHtml.includes('<script src="ai-config-i18n.js"></script>')) {
  failures.push('renderer/ai-config.html must load ai-config-i18n.js');
}
if (aiConfigHtml.includes('../i18n/locales.js')) {
  failures.push('renderer/ai-config.html must not load ../i18n/locales.js directly');
}
if (!aiConfigI18n.includes("set-window-title")) {
  failures.push('renderer/ai-config-i18n.js must sync BrowserWindow title after localization');
}
if (!aiConfigI18n.includes("language-changed")) {
  failures.push('renderer/ai-config-i18n.js must refresh when language changes');
}
assertPageWaitsForI18n('renderer/ai-config.html', aiConfigHtml, aiConfigI18n);

const subscriptionHtml = fs.readFileSync(path.join(rootDir, 'renderer/subscription.html'), 'utf8');
const subscriptionI18n = fs.readFileSync(path.join(rootDir, 'renderer/subscription-i18n.js'), 'utf8');
if (!subscriptionHtml.includes('<script src="i18n-helpers.js"></script>')) {
  failures.push('renderer/subscription.html must load renderer/i18n-helpers.js');
}
if (!subscriptionHtml.includes('<script src="subscription-i18n.js"></script>')) {
  failures.push('renderer/subscription.html must load subscription-i18n.js');
}
if (subscriptionHtml.includes('../i18n/locales.js')) {
  failures.push('renderer/subscription.html must not load ../i18n/locales.js directly');
}
if (!subscriptionI18n.includes("set-window-title")) {
  failures.push('renderer/subscription-i18n.js must sync BrowserWindow title after localization');
}
if (!subscriptionI18n.includes("language-changed")) {
  failures.push('renderer/subscription-i18n.js must refresh when language changes');
}
assertPageWaitsForI18n('renderer/subscription.html', subscriptionHtml, subscriptionI18n);

const activationPremiumHtml = fs.readFileSync(path.join(rootDir, 'renderer/activation-premium.html'), 'utf8');
if (!activationPremiumHtml.includes('<script src="i18n-helpers.js"></script>')) {
  failures.push('renderer/activation-premium.html must load renderer/i18n-helpers.js');
}
if (!activationPremiumHtml.includes("activationPage.")) {
  failures.push('renderer/activation-premium.html must use activationPage translations');
}
if (!activationPremiumHtml.includes("set-window-title")) {
  failures.push('renderer/activation-premium.html must sync BrowserWindow title after localization');
}
assertPageWaitsForI18n('renderer/activation-premium.html', activationPremiumHtml, activationPremiumHtml);

const findReplaceJs = fs.readFileSync(path.join(rootDir, 'renderer/find-replace.js'), 'utf8');
if (!findReplaceJs.includes('findReplaceModal.')) {
  failures.push('renderer/find-replace.js must use findReplaceModal translations');
}

const commandPaletteJs = fs.readFileSync(path.join(rootDir, 'renderer/command-palette.js'), 'utf8');
if (!commandPaletteJs.includes('commandPalette.')) {
  failures.push('renderer/command-palette.js must use commandPalette translations');
}

for (const lang of ['en', 'zh']) {
  for (const objectKey of ['aiConfig', 'subscription']) {
    if (typeof t(objectKey, lang) !== 'string') {
      failures.push(`${lang}: ${objectKey} must remain a string menu/common key, not a page translation object`);
    }
  }
}

if (failures.length > 0) {
  console.error('i18n check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('i18n check passed');
