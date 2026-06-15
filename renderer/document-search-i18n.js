function getDocSearchTexts() {
  const lang = window.i18nHelpers ? window.i18nHelpers.getCurrentLanguage() : 'en';
  const t = window.i18nHelpers ? window.i18nHelpers.t : (key) => key;

  return {
    tabSearch: t('docSearch.tabSearch'),
    tabOutline: t('docSearch.tabOutline'),
    placeholder: t('docSearch.placeholder'),
    emptyHint: t('docSearch.emptyHint'),
    emptyHintWithTip: t('docSearch.emptyHintWithTip'),
    noResults: t('docSearch.noResults'),
    prevMatch: t('docSearch.prevMatch'),
    nextMatch: t('docSearch.nextMatch'),
    caseSensitive: t('docSearch.caseSensitive'),
    regex: t('docSearch.regex'),
    resultsCount: t('docSearch.resultsCount'),
    closeTooltip: t('docSearch.closeTooltip')
  };
}

// Initialize i18n for document search panel when language changes
function refreshDocSearchI18n() {
  const panel = document.getElementById('docSearchPanel');
  if (!panel) return;

  const texts = getDocSearchTexts();

  // Update tabs
  const tabs = panel.querySelectorAll('.doc-search-tab');
  if (tabs[0]) tabs[0].textContent = texts.tabSearch;
  if (tabs[1]) tabs[1].textContent = texts.tabOutline;

  // Update close button
  const closeBtn = document.getElementById('docSearchClose');
  if (closeBtn) closeBtn.setAttribute('title', texts.closeTooltip);

  // Update input placeholder
  const input = document.getElementById('docSearchInput');
  if (input) input.setAttribute('placeholder', texts.placeholder);

  // Update navigation buttons
  const prevBtn = document.getElementById('docSearchPrev');
  const nextBtn = document.getElementById('docSearchNext');
  if (prevBtn) prevBtn.setAttribute('title', texts.prevMatch);
  if (nextBtn) nextBtn.setAttribute('title', texts.nextMatch);

  // Update option buttons
  const caseSensitiveBtn = document.getElementById('docSearchCaseSensitive');
  const regexBtn = document.getElementById('docSearchRegex');
  if (caseSensitiveBtn) caseSensitiveBtn.setAttribute('title', texts.caseSensitive);
  if (regexBtn) regexBtn.setAttribute('title', texts.regex);

  // Update empty state if visible
  const emptyDiv = panel.querySelector('.doc-search-empty');
  if (emptyDiv && emptyDiv.parentElement.style.display !== 'none') {
    emptyDiv.textContent = texts.emptyHint;
  }
}
