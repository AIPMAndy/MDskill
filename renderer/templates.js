// MDSKILL 模板配置系统
// 参考 pageSKILL 的模板架构

const baseStyles = {
  backgroundColor: '#252526',
  maxWidth: '900px',
  padding: '40px',

  // 标题
  titleFont: '"Noto Sans SC", -apple-system, sans-serif',
  titleSize: '32px',
  titleWeight: '700',
  titleColor: '#ffffff',
  titleMarginBottom: '24px',

  // 二级标题
  h2Font: '"Noto Sans SC", -apple-system, sans-serif',
  h2Size: '24px',
  h2Weight: '600',
  h2Color: '#e2e8f0',
  h2MarginTop: '36px',
  h2MarginBottom: '16px',
  h2BorderColor: '#3e3e42',

  // 三级标题
  h3Size: '20px',
  h3Weight: '600',
  h3Color: '#cbd5e1',

  // 正文
  bodyFont: '"Noto Sans SC", -apple-system, sans-serif',
  bodySize: '16px',
  bodyColor: '#d4d4d4',
  bodyLineHeight: '1.8',
  paragraphSpacing: '16px',

  // 链接
  linkColor: '#4fc3f7',
  linkHoverColor: '#81d4fa',

  // 引用块
  blockquoteBorderColor: '#4fc3f7',
  blockquoteBg: '#1e293b',
  blockquoteColor: '#94a3b8',

  // 代码
  codeBg: '#1e1e1e',
  codeColor: '#ce9178',
  codeBlockBg: '#1e1e1e',
  codeBlockBorder: '#3e3e42',

  // 表格
  tableBorderColor: '#3e3e42',
  tableHeaderBg: '#1e1e1e',
  tableHeaderColor: '#ffffff',
  tableStripeBg: '#2d2d30',

  // 分割线
  hrColor: '#3e3e42',

  // 强调
  strongColor: '#ffffff',
  emColor: '#4fc3f7',

  // 列表
  listMarkerColor: '#4fc3f7',
};

// ============== 模板定义 ==============

const templates = {
  // GitHub Dark - 默认主题
  githubDark: {
    id: 'github-dark',
    name: 'GitHub Dark',
    description: '经典 GitHub 暗色主题，适合代码文档',
    category: 'tech',
    icon: '🌙',
    styles: {
      ...baseStyles,
    }
  },

  // GitHub Light - 亮色主题
  githubLight: {
    id: 'github-light',
    name: 'GitHub Light',
    description: '清爽的亮色主题，护眼舒适',
    category: 'minimal',
    icon: '☀️',
    styles: {
      ...baseStyles,
      backgroundColor: '#ffffff',
      titleColor: '#1a1a1a',
      h2Color: '#1a1a1a',
      h2BorderColor: '#e2e8f0',
      h3Color: '#333333',
      bodyColor: '#333333',
      linkColor: '#2563eb',
      linkHoverColor: '#1d4ed8',
      blockquoteBorderColor: '#2563eb',
      blockquoteBg: '#f0f7ff',
      blockquoteColor: '#4b5563',
      codeBg: '#f1f5f9',
      codeColor: '#e11d48',
      codeBlockBg: '#f8fafc',
      codeBlockBorder: '#e2e8f0',
      tableBorderColor: '#e2e8f0',
      tableHeaderBg: '#f8fafc',
      tableHeaderColor: '#1a1a1a',
      tableStripeBg: '#fafbfc',
      hrColor: '#e2e8f0',
      strongColor: '#1a1a1a',
      emColor: '#6b7280',
      listMarkerColor: '#2563eb',
    }
  },

  // 极简主义
  minimal: {
    id: 'minimal',
    name: '极简现代',
    description: '极简设计，专注内容',
    category: 'minimal',
    icon: '✨',
    styles: {
      ...baseStyles,
      backgroundColor: '#fafafa',
      maxWidth: '680px',
      padding: '48px 32px',
      titleSize: '36px',
      titleWeight: '800',
      titleColor: '#111827',
      h2Color: '#111827',
      h2Size: '22px',
      h2BorderColor: 'transparent',
      h3Color: '#374151',
      bodyColor: '#374151',
      bodyLineHeight: '1.9',
      linkColor: '#111827',
      linkHoverColor: '#374151',
      blockquoteBorderColor: '#111827',
      blockquoteBg: '#f9fafb',
      blockquoteColor: '#6b7280',
      codeBg: '#f3f4f6',
      codeColor: '#111827',
      codeBlockBg: '#f9fafb',
      codeBlockBorder: '#e5e7eb',
      strongColor: '#111827',
      emColor: '#6b7280',
      listMarkerColor: '#111827',
      hrColor: '#e5e7eb',
    }
  },

  // 文艺清新
  literary: {
    id: 'literary',
    name: '文艺清新',
    description: '优雅字体，适合随笔写作',
    category: 'creative',
    icon: '🌿',
    styles: {
      ...baseStyles,
      backgroundColor: '#fefdf8',
      titleFont: '"Noto Serif SC", serif',
      titleSize: '32px',
      titleColor: '#44403c',
      h2Font: '"Noto Serif SC", serif',
      h2Size: '22px',
      h2Color: '#57534e',
      h2BorderColor: 'transparent',
      h3Color: '#78716c',
      bodyFont: '"Noto Serif SC", serif',
      bodyColor: '#57534e',
      bodyLineHeight: '2',
      linkColor: '#92400e',
      linkHoverColor: '#78350f',
      blockquoteBorderColor: '#d6d3d1',
      blockquoteBg: 'transparent',
      blockquoteColor: '#78716c',
      codeBg: '#f5f5f4',
      codeColor: '#92400e',
      strongColor: '#44403c',
      emColor: '#92400e',
      listMarkerColor: '#a8a29e',
      hrColor: '#d6d3d1',
    }
  },

  // 科技蓝
  techBlue: {
    id: 'tech-blue',
    name: '科技蓝',
    description: '深蓝配色，科技感十足',
    category: 'tech',
    icon: '🔷',
    styles: {
      ...baseStyles,
      backgroundColor: '#0f172a',
      titleColor: '#e2e8f0',
      h2Color: '#38bdf8',
      h2BorderColor: '#38bdf8',
      h3Color: '#7dd3fc',
      bodyColor: '#cbd5e1',
      linkColor: '#38bdf8',
      linkHoverColor: '#7dd3fc',
      blockquoteBorderColor: '#38bdf8',
      blockquoteBg: '#1e293b',
      blockquoteColor: '#94a3b8',
      codeBg: '#1e293b',
      codeColor: '#f472b6',
      codeBlockBg: '#020617',
      codeBlockBorder: '#334155',
      strongColor: '#f1f5f9',
      emColor: '#38bdf8',
      listMarkerColor: '#38bdf8',
      hrColor: '#334155',
    }
  },

  // 商务经典
  business: {
    id: 'business',
    name: '商务经典',
    description: '专业严谨，适合商业文档',
    category: 'business',
    icon: '💼',
    styles: {
      ...baseStyles,
      backgroundColor: '#ffffff',
      titleColor: '#0f172a',
      titleSize: '28px',
      h2Color: '#1e3a8a',
      h2BorderColor: '#1e40af',
      h3Color: '#1e40af',
      bodyColor: '#334155',
      linkColor: '#1e40af',
      linkHoverColor: '#1e3a8a',
      blockquoteBorderColor: '#1e40af',
      blockquoteBg: '#eff6ff',
      blockquoteColor: '#1e3a8a',
      codeBg: '#f1f5f9',
      codeColor: '#1e40af',
      codeBlockBg: '#f8fafc',
      codeBlockBorder: '#cbd5e1',
      strongColor: '#1e40af',
      emColor: '#475569',
      listMarkerColor: '#1e40af',
      hrColor: '#cbd5e1',
    }
  },

  // 暖色调
  warm: {
    id: 'warm',
    name: '暖色温馨',
    description: '温暖配色，舒适阅读',
    category: 'creative',
    icon: '🌅',
    styles: {
      ...baseStyles,
      backgroundColor: '#fef3c7',
      titleColor: '#78350f',
      h2Color: '#92400e',
      h2BorderColor: '#fbbf24',
      h3Color: '#b45309',
      bodyColor: '#78350f',
      linkColor: '#d97706',
      linkHoverColor: '#b45309',
      blockquoteBorderColor: '#fbbf24',
      blockquoteBg: '#fffbeb',
      blockquoteColor: '#92400e',
      codeBg: '#fef3c7',
      codeColor: '#b45309',
      codeBlockBg: '#fffbeb',
      codeBlockBorder: '#fde68a',
      strongColor: '#78350f',
      emColor: '#d97706',
      listMarkerColor: '#fbbf24',
      hrColor: '#fde68a',
    }
  },

  // 紫色梦幻
  purple: {
    id: 'purple',
    name: '紫色梦幻',
    description: '优雅紫色，创意设计',
    category: 'creative',
    icon: '💜',
    styles: {
      ...baseStyles,
      backgroundColor: '#1e1b4b',
      titleColor: '#e9d5ff',
      h2Color: '#c084fc',
      h2BorderColor: '#a855f7',
      h3Color: '#d8b4fe',
      bodyColor: '#e9d5ff',
      linkColor: '#c084fc',
      linkHoverColor: '#d8b4fe',
      blockquoteBorderColor: '#a855f7',
      blockquoteBg: '#2e1065',
      blockquoteColor: '#d8b4fe',
      codeBg: '#2e1065',
      codeColor: '#f0abfc',
      codeBlockBg: '#1e1b4b',
      codeBlockBorder: '#4c1d95',
      strongColor: '#fae8ff',
      emColor: '#c084fc',
      listMarkerColor: '#a855f7',
      hrColor: '#4c1d95',
    }
  },
};

// 生成 CSS
function generateTemplateCSS(styles) {
  return `
    .markdown-body {
      background: ${styles.backgroundColor} !important;
      color: ${styles.bodyColor} !important;
      max-width: ${styles.maxWidth};
      margin: 0 auto;
      padding: ${styles.padding};
      font-family: ${styles.bodyFont};
      font-size: ${styles.bodySize};
      line-height: ${styles.bodyLineHeight};
    }

    .markdown-body h1 {
      font-family: ${styles.titleFont};
      font-size: ${styles.titleSize};
      font-weight: ${styles.titleWeight};
      color: ${styles.titleColor} !important;
      margin-bottom: ${styles.titleMarginBottom};
      border-bottom: 2px solid ${styles.h2BorderColor} !important;
      padding-bottom: 12px;
    }

    .markdown-body h2 {
      font-family: ${styles.h2Font};
      font-size: ${styles.h2Size};
      font-weight: ${styles.h2Weight};
      color: ${styles.h2Color} !important;
      margin-top: ${styles.h2MarginTop};
      margin-bottom: ${styles.h2MarginBottom};
      border-bottom: 1px solid ${styles.h2BorderColor} !important;
      padding-bottom: 8px;
    }

    .markdown-body h3 {
      font-size: ${styles.h3Size};
      font-weight: ${styles.h3Weight};
      color: ${styles.h3Color} !important;
    }

    .markdown-body p {
      margin-bottom: ${styles.paragraphSpacing};
    }

    .markdown-body a {
      color: ${styles.linkColor} !important;
      text-decoration: none;
    }

    .markdown-body a:hover {
      color: ${styles.linkHoverColor} !important;
      text-decoration: underline;
    }

    .markdown-body blockquote {
      border-left: 4px solid ${styles.blockquoteBorderColor} !important;
      background: ${styles.blockquoteBg} !important;
      color: ${styles.blockquoteColor} !important;
      padding: 12px 20px;
      margin: 16px 0;
    }

    .markdown-body code {
      background: ${styles.codeBg} !important;
      color: ${styles.codeColor} !important;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Monaco', 'Menlo', monospace;
    }

    .markdown-body pre {
      background: ${styles.codeBlockBg} !important;
      border: 1px solid ${styles.codeBlockBorder} !important;
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
    }

    .markdown-body pre code {
      background: transparent !important;
      color: ${styles.bodyColor} !important;
      padding: 0;
    }

    .markdown-body table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }

    .markdown-body table th,
    .markdown-body table td {
      border: 1px solid ${styles.tableBorderColor} !important;
      padding: 8px 12px;
    }

    .markdown-body table th {
      background: ${styles.tableHeaderBg} !important;
      color: ${styles.tableHeaderColor} !important;
      font-weight: 600;
    }

    .markdown-body table tr:nth-child(2n) {
      background: ${styles.tableStripeBg} !important;
    }

    .markdown-body hr {
      background-color: ${styles.hrColor} !important;
      border: none;
      height: 1px;
      margin: 24px 0;
    }

    .markdown-body strong {
      color: ${styles.strongColor} !important;
      font-weight: 600;
    }

    .markdown-body em {
      color: ${styles.emColor} !important;
    }

    .markdown-body ul,
    .markdown-body ol {
      padding-left: 24px;
    }

    .markdown-body li::marker {
      color: ${styles.listMarkerColor} !important;
    }

    .markdown-body img {
      max-width: 100%;
      border-radius: 8px;
      margin: 16px 0;
    }
  `;
}

// 获取所有模板
function getAllTemplates() {
  return Object.values(templates);
}

// 根据 ID 获取模板
function getTemplateById(id) {
  return Object.values(templates).find(t => t.id === id) || templates.githubDark;
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    templates,
    getAllTemplates,
    getTemplateById,
    generateTemplateCSS,
  };
}
