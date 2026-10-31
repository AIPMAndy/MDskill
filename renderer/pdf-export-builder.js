(function(root, factory) {
  const api = factory();
  if (root) {
    root.PDFExportBuilder = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function() {
  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeCssValue(value, fallback) {
    const text = String(value || fallback || '').trim();
    return /^[#(),.%\w\s-]+$/.test(text) ? text : fallback;
  }

  function isAbsoluteCssUrl(url) {
    return /^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(url);
  }

  function rewriteCssUrls(css, stylesheetHref) {
    if (!css || !stylesheetHref) return css || '';

    return String(css).replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (match, quote, rawUrl) => {
      const url = rawUrl.trim();
      if (!url || isAbsoluteCssUrl(url)) {
        return match;
      }

      try {
        const absoluteUrl = new URL(url, stylesheetHref).href;
        return `url("${absoluteUrl.replace(/"/g, '\\"')}")`;
      } catch (error) {
        return match;
      }
    });
  }

  async function collectStylesheetText(items, doc) {
    const documentRef = doc || (typeof document !== 'undefined' ? document : null);
    if (!documentRef) return '';

    const chunks = [];

    for (const item of items) {
      const link = documentRef.querySelector(item.selector);
      if (!link || !link.href) continue;

      try {
        const response = await fetch(link.href);
        const css = await response.text();
        chunks.push(`/* ${item.name} */\n${rewriteCssUrls(css, link.href)}`);
      } catch (error) {
        console.warn(`Failed to load ${item.name} CSS:`, error);
      }
    }

    return chunks.join('\n\n');
  }

  function buildPDFExportHTML({
    title,
    contentHTML,
    assetCSS,
    themeCSS,
    baseHref,
    templateStyles,
  }) {
    const backgroundColor = escapeCssValue(templateStyles && templateStyles.backgroundColor, '#ffffff');
    const bodyColor = escapeCssValue(templateStyles && templateStyles.bodyColor, '#24292f');
    const baseTag = baseHref ? `<base href="${escapeHtml(baseHref)}">` : '';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  ${baseTag}
  <title>${escapeHtml(title || 'document')}</title>
  <style>
    ${assetCSS || ''}

    ${themeCSS || ''}

    @page {
      size: A4;
      margin: 12mm 14mm;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      background: ${backgroundColor} !important;
      color: ${bodyColor} !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    .markdown-body {
      min-height: 100%;
      overflow: visible !important;
    }

    .markdown-body h1,
    .markdown-body h2,
    .markdown-body h3,
    .markdown-body h4,
    .markdown-body h5,
    .markdown-body h6 {
      page-break-after: avoid;
      break-after: avoid;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .markdown-body pre,
    .markdown-body table,
    .markdown-body img,
    .markdown-body blockquote,
    .markdown-body .math-block {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .markdown-body p {
      orphans: 3;
      widows: 3;
    }

    .markdown-body li {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .markdown-body pre,
    .markdown-body pre code {
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: anywhere;
    }

    .markdown-body img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <div class="markdown-body">
    ${contentHTML || ''}
  </div>
</body>
</html>`;
  }

  return {
    buildPDFExportHTML,
    collectStylesheetText,
    rewriteCssUrls,
  };
});
