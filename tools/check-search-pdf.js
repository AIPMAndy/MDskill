const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {
  extractMarkdownSourceBlocks,
} = require('../renderer/markdown-source-map');
const {
  buildPDFExportHTML,
  rewriteCssUrls,
} = require('../renderer/pdf-export-builder');

function testMarkdownSourceBlocks() {
  const markdown = [
    '# Title',
    '',
    'Intro repeat',
    '',
    '- first repeat',
    '- second repeat',
    '',
    '```js',
    "console.log('repeat');",
    '```',
    '',
    'Final repeat',
  ].join('\n');

  const blocks = extractMarkdownSourceBlocks(markdown);

  assert.deepStrictEqual(
    blocks.map((block) => [block.type, block.startLine, block.endLine]),
    [
      ['heading', 0, 0],
      ['paragraph', 2, 2],
      ['list', 4, 5],
      ['code', 7, 9],
      ['paragraph', 11, 11],
    ],
  );
}

function testPDFExportHTMLPreservesTheme() {
  const html = buildPDFExportHTML({
    title: 'Styled Doc',
    contentHTML: '<h1>Styled Doc</h1><pre><code>const x = 1;</code></pre>',
    assetCSS: '.markdown-body h1 { font-weight: 700; }',
    themeCSS: '.markdown-body { background: #0a0e27 !important; color: #e0e0e0 !important; max-width: 760px; padding: 48px; }',
    baseHref: 'file:///Users/andy/Documents/AICode/02%20产品网站与服务端/MDSKILL/renderer/index.html',
    templateStyles: {
      backgroundColor: '#0a0e27',
      bodyColor: '#e0e0e0',
    },
  });

  assert.match(html, /<base href="file:\/\/\/Users\/andy\/Documents\/AICode/);
  assert.match(html, /background: #0a0e27 !important/);
  assert.match(html, /color: #e0e0e0 !important/);
  assert.match(html, /max-width: 760px/);
  assert.doesNotMatch(html, /background:\s*white\s*!important/);
  assert.doesNotMatch(html, /padding:\s*40px/);
  assert.match(html, /const x = 1/);
}

function testCssUrlRewriting() {
  const css = '@font-face { src: url(fonts/KaTeX_Main-Regular.woff2); }';
  const rewritten = rewriteCssUrls(
    css,
    'file:///app/node_modules/katex/dist/katex.min.css',
  );

  assert.match(
    rewritten,
    /url\("file:\/\/\/app\/node_modules\/katex\/dist\/fonts\/KaTeX_Main-Regular\.woff2"\)/,
  );
}

function testBrowserGlobalsAreRegistered() {
  assert.strictEqual(globalThis.MarkdownSourceMap.extractMarkdownSourceBlocks, extractMarkdownSourceBlocks);
  assert.strictEqual(globalThis.PDFExportBuilder.buildPDFExportHTML, buildPDFExportHTML);
}

function testRendererPDFIntegration() {
  const rendererSource = fs.readFileSync(
    path.join(__dirname, '..', 'renderer', 'renderer.js'),
    'utf8',
  );
  const mainSource = fs.readFileSync(
    path.join(__dirname, '..', 'main.js'),
    'utf8',
  );

  assert.match(rendererSource, /getElementById\('dynamicStyles'\)/);
  assert.match(rendererSource, /PDFExportBuilder\.buildPDFExportHTML/);
  assert.doesNotMatch(rendererSource, /save-debug-html/);
  assert.doesNotMatch(mainSource, /save-debug-html/);
}

testMarkdownSourceBlocks();
testPDFExportHTMLPreservesTheme();
testCssUrlRewriting();
testBrowserGlobalsAreRegistered();
testRendererPDFIntegration();

console.log('Search/PDF checks passed');
