#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {
  templates,
  getAllTemplates,
  getTemplateById,
  generateTemplateCSS,
} = require('../renderer/templates');

const rootDir = path.resolve(__dirname, '..');

const requiredStyleKeys = [
  'backgroundColor',
  'titleColor',
  'h2Color',
  'bodyColor',
  'linkColor',
  'blockquoteBorderColor',
  'codeBg',
  'codeBlockColor',
  'strongColor',
];

function fail(message) {
  console.error(`Theme check failed: ${message}`);
  process.exitCode = 1;
}

function expandHexColor(color) {
  if (!color || typeof color !== 'string') {
    return null;
  }

  const hex = color.trim().replace('#', '');
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    return hex.split('').map(char => char + char).join('');
  }
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return hex;
  }
  return null;
}

function relativeLuminance(color) {
  const hex = expandHexColor(color);
  if (!hex) {
    return null;
  }

  const rgb = [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];

  return rgb
    .map(value => {
      const channel = value / 255;
      return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    })
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  if (foregroundLuminance == null || backgroundLuminance == null) {
    return null;
  }

  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

const allThemes = getAllTemplates();
const ids = new Map();
const names = new Map();

for (const [key, theme] of Object.entries(templates)) {
  if (!theme || typeof theme !== 'object') {
    fail(`${key} is not a theme object`);
    continue;
  }

  if (!theme.id || typeof theme.id !== 'string') {
    fail(`${key} has no string id`);
    continue;
  }

  if (theme.isPremium !== theme.isPro) {
    fail(`${theme.name} has inconsistent isPremium/isPro flags`);
  }

  if (ids.has(theme.id)) {
    fail(`duplicate theme id "${theme.id}" for "${ids.get(theme.id)}" and "${theme.name}"`);
  } else {
    ids.set(theme.id, theme.name);
  }

  if (names.has(theme.name)) {
    fail(`duplicate theme name "${theme.name}" for "${names.get(theme.name)}" and "${theme.id}"`);
  } else {
    names.set(theme.name, theme.id);
  }

  const lookedUp = getTemplateById(theme.id);
  if (lookedUp !== theme) {
    fail(`getTemplateById("${theme.id}") did not return "${theme.name}"`);
  }

  if (!theme.styles || typeof theme.styles !== 'object') {
    fail(`${theme.name} has no styles object`);
    continue;
  }

  const missingStyles = requiredStyleKeys.filter(styleKey => !(styleKey in theme.styles));
  if (missingStyles.length > 0) {
    fail(`${theme.name} is missing style keys: ${missingStyles.join(', ')}`);
  }

  const codeBlockContrast = contrastRatio(theme.styles.codeBlockColor, theme.styles.codeBlockBg);
  if (codeBlockContrast != null && codeBlockContrast < 4.5) {
    fail(`${theme.name} code block text contrast is too low: ${codeBlockContrast.toFixed(2)}`);
  }
}

const defaultTheme = getTemplateById('default');
if (!defaultTheme || defaultTheme.name !== 'GitHub Dark') {
  fail('default theme lookup does not return GitHub Dark');
}

const legacyDefaultTheme = getTemplateById('github-dark');
if (legacyDefaultTheme !== defaultTheme) {
  fail('legacy github-dark lookup does not resolve to the default theme');
}

if (typeof generateTemplateCSS !== 'function') {
  fail('templates.js does not export generateTemplateCSS required by renderer.js');
} else {
  const generatedCSS = generateTemplateCSS(defaultTheme.styles);
  if (!generatedCSS.includes('.markdown-body') || !generatedCSS.includes(defaultTheme.styles.backgroundColor)) {
    fail('generateTemplateCSS does not generate markdown theme CSS');
  }
}

if (allThemes.length !== Object.keys(templates).length) {
  fail('getAllTemplates does not return every registered theme');
}

const rendererSource = fs.readFileSync(path.join(rootDir, 'renderer/renderer.js'), 'utf8');
const forbiddenGlobalHelpers = ['getAllTemplates', 'getTemplateById'];
for (const helperName of forbiddenGlobalHelpers) {
  if (new RegExp(`^function\\s+${helperName}\\s*\\(`, 'm').test(rendererSource)) {
    fail(`renderer.js declares global ${helperName} and shadows templates.js`);
  }
}

const wechatRendererSource = fs.readFileSync(path.join(rootDir, 'renderer/wechat-renderer.js'), 'utf8');
if (!wechatRendererSource.includes('styles.codeBlockColor || styles.codeColor')) {
  fail('wechat-renderer.js code blocks do not use codeBlockColor fallback');
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log(`Theme check passed: ${allThemes.length} themes`);
