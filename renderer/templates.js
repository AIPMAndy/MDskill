// MDSKILL 模板配置系统
// 参考 pageSKILL 的模板架构

// ============== 基础样式配置 ==============
// 所有主题必须包含的样式属性

const baseCommonStyles = {
  maxWidth: '900px',
  padding: '40px',

  // 字体
  titleFont: '"Noto Sans SC", -apple-system, sans-serif',
  bodyFont: '"Noto Sans SC", -apple-system, sans-serif',
  h2Font: '"Noto Sans SC", -apple-system, sans-serif',

  // 尺寸
  titleSize: '32px',
  titleWeight: '700',
  titleMarginBottom: '24px',
  h2Size: '24px',
  h2Weight: '600',
  h2MarginTop: '36px',
  h2MarginBottom: '16px',
  h3Size: '20px',
  h3Weight: '600',
  bodySize: '16px',
  bodyLineHeight: '1.8',
  paragraphSpacing: '8px',
};

// 深色主题基础配置
const baseDarkTheme = {
  ...baseCommonStyles,
  backgroundColor: '#252526',
  titleColor: '#ffffff',
  h2Color: '#e2e8f0',
  h2BorderColor: '#3e3e42',
  h3Color: '#cbd5e1',
  bodyColor: '#d4d4d4',
  linkColor: '#4fc3f7',
  linkHoverColor: '#81d4fa',
  blockquoteBorderColor: '#4fc3f7',
  blockquoteBg: '#1e293b',
  blockquoteColor: '#94a3b8',
  codeBg: '#1e1e1e',
  codeColor: '#ce9178',
  codeBlockBg: '#1e1e1e',
  codeBlockBorder: '#3e3e42',
  tableBorderColor: '#3e3e42',
  tableHeaderBg: '#1e1e1e',
  tableHeaderColor: '#ffffff',
  tableStripeBg: '#2d2d30',
  hrColor: '#3e3e42',
  strongColor: '#ffffff',
  emColor: '#4fc3f7',
  listMarkerColor: '#4fc3f7',
};

// 浅色主题基础配置
const baseLightTheme = {
  ...baseCommonStyles,
  backgroundColor: '#ffffff',
  titleColor: '#1a1a1a',
  h2Color: '#1a1a1a',
  h2BorderColor: '#e2e8f0',
  h3Color: '#333333',
  bodyColor: '#333333',
  linkColor: '#2563eb',
  linkHoverColor: '#1d4ed8',
  blockquoteBorderColor: '#2563eb',
  blockquoteBg: '#f8fafc',
  blockquoteColor: '#475569',
  codeBg: '#f6f8fa',
  codeColor: '#d73a49',
  codeBlockBg: '#f6f8fa',
  codeBlockBorder: '#d0d7de',
  tableBorderColor: '#d0d7de',
  tableHeaderBg: '#f6f8fa',
  tableHeaderColor: '#24292e',
  tableStripeBg: '#f6f8fa',
  hrColor: '#d0d7de',
  strongColor: '#1a1a1a',
  emColor: '#2563eb',
  listMarkerColor: '#2563eb',
};

// 主题配置验证函数
function validateTheme(themeName, themeConfig) {
  const requiredKeys = Object.keys(baseLightTheme);
  const missingKeys = requiredKeys.filter(key => !(key in themeConfig.styles));

  if (missingKeys.length > 0) {
    console.warn(`⚠️ Theme "${themeName}" missing properties:`, missingKeys);
    return false;
  }
  return true;
}

// 向后兼容：保留 baseStyles 别名
const baseStyles = baseDarkTheme;

// ============== 模板定义 ==============

const templates = {
  // 创意类 - Playful（多彩活力）- 高级优化版 - 首选主题
  playful: {
    id: 'playful',
    name: '多彩活力',
    description: '精致多彩风格，适合创意内容',
    category: 'creative',
    icon: '🌈',
    isPro: false,
    styles: {
      ...baseLightTheme,
      backgroundColor: '#fafbf9',
      maxWidth: '680px',
      padding: '48px 44px',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      titleSize: '32px',
      titleWeight: '700',
      titleColor: '#1a1a1a',
      titleMarginBottom: '24px',
      h2Font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h2Size: '24px',
      h2Weight: '600',
      h2Color: '#5f6b7a',
      h2BorderColor: 'transparent',
      h2MarginTop: '40px',
      h2MarginBottom: '18px',
      h3Size: '20px',
      h3Weight: '600',
      h3Color: '#7a8a9a',
      bodyFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      bodySize: '16px',
      bodyColor: '#3d3d3d',
      bodyLineHeight: '1.85',
      paragraphSpacing: '18px',
      linkColor: '#0071e3',
      linkHoverColor: '#0077ed',
      blockquoteBorderColor: '#8b9ba8',
      blockquoteBg: '#f5f7f8',
      blockquoteColor: '#5a6b7a',
      codeBg: '#f0f2f5',
      codeColor: '#0071e3',
      codeBlockBg: '#f5f7f8',
      codeBlockBorder: '#dce4eb',
      tableBorderColor: '#dce4eb',
      tableHeaderBg: '#f0f2f5',
      tableHeaderColor: '#1a1a1a',
      tableStripeBg: '#f9fbf9',
      hrColor: '#dce4eb',
      strongColor: '#1a1a1a',
      emColor: '#5f6b7a',
      listMarkerColor: '#0071e3',
    }
  },

  // GitHub Dark - 默认主题（免费）
  default: {
    id: 'default',
    name: 'GitHub Dark',
    description: '经典 GitHub 暗色主题，适合代码文档',
    category: 'tech',
    icon: '🌙',
    isPro: false, // 免费主题
    styles: {
      ...baseStyles,
    }
  },

  // GitHub Light - 亮色主题（专业版）
  githubLight: {
    id: 'github-light',
    name: 'GitHub Light',
    description: '清爽的亮色主题，护眼舒适',
    category: 'minimal',
    icon: '☀️',
    isPro: true, // 专业版功能
    styles: {
      ...baseLightTheme,
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

  // 极简主义（专业版）
  minimal: {
    id: 'minimal',
    name: '极简现代',
    description: '极简设计，专注内容',
    category: 'minimal',
    icon: '✨',
    isPro: true,
    styles: {
      ...baseLightTheme,
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
      tableBorderColor: '#e5e7eb',
      tableHeaderBg: '#f9fafb',
      tableHeaderColor: '#111827',
      tableStripeBg: '#fafafa',
    }
  },


  // ============== 新增 13 个专业版主题 ==============


  // 创意类 - Magazine（杂志布局）
  magazine: {
    id: 'magazine',
    name: '杂志布局',
    description: '杂志风格布局，适合深度报道',
    category: 'creative',
    icon: '📰',
    isPro: true,
    styles: {
      ...baseLightTheme,
      backgroundColor: '#ffffff',
      maxWidth: '740px',
      padding: '48px 40px',
      titleFont: '"Merriweather", Georgia, serif',
      titleSize: '36px',
      titleWeight: '900',
      titleColor: '#1a1a1a',
      titleMarginBottom: '12px',
      h2Font: '"Merriweather", Georgia, serif',
      h2Size: '26px',
      h2Weight: '700',
      h2Color: '#2c2c2c',
      h2BorderColor: '#1a1a1a',
      h2MarginTop: '44px',
      h2MarginBottom: '16px',
      h3Size: '20px',
      h3Weight: '600',
      h3Color: '#3a3a3a',
      bodyFont: '"Georgia", serif',
      bodySize: '17px',
      bodyColor: '#333333',
      bodyLineHeight: '1.9',
      paragraphSpacing: '20px',
      linkColor: '#c41e3a',
      linkHoverColor: '#a01729',
      blockquoteBorderColor: '#c41e3a',
      blockquoteBg: '#fef2f2',
      blockquoteColor: '#4a4a4a',
      codeBg: '#f5f5f5',
      codeColor: '#c41e3a',
      codeBlockBg: '#f9f9f9',
      codeBlockBorder: '#e0e0e0',
      tableBorderColor: '#d6d6d6',
      tableHeaderBg: '#f5f5f5',
      tableHeaderColor: '#1a1a1a',
      tableStripeBg: '#fafafa',
      hrColor: '#d6d6d6',
      strongColor: '#1a1a1a',
      emColor: '#c41e3a',
      listMarkerColor: '#c41e3a',
    }
  },

  // 创意类 - Artistic（装饰性创意元素）
  artistic: {
    id: 'artistic',
    name: '艺术创意',
    description: '装饰性创意元素，适合设计展示',
    category: 'creative',
    icon: '🎨',
    isPro: true,
    styles: {
      ...baseLightTheme,
      backgroundColor: '#f9f7f2',
      maxWidth: '680px',
      padding: '52px 44px',
      titleFont: '"Pacifico", cursive',
      titleSize: '34px',
      titleWeight: '400',
      titleColor: '#6b5b4e',
      titleMarginBottom: '28px',
      h2Font: '"Quicksand", sans-serif',
      h2Size: '26px',
      h2Weight: '600',
      h2Color: '#8b7355',
      h2BorderColor: 'transparent',
      h2MarginTop: '40px',
      h2MarginBottom: '18px',
      h3Size: '21px',
      h3Weight: '600',
      h3Color: '#a68370',
      bodyFont: '"Quicksand", sans-serif',
      bodySize: '16px',
      bodyColor: '#3d3d3d',
      bodyLineHeight: '1.85',
      paragraphSpacing: '18px',
      linkColor: '#8b7355',
      linkHoverColor: '#6b5b4e',
      blockquoteBorderColor: '#c9a575',
      blockquoteBg: '#faf8f3',
      blockquoteColor: '#5a5a5a',
      codeBg: '#f0ebe5',
      codeColor: '#8b7355',
      codeBlockBg: '#f5f2ed',
      codeBlockBorder: '#e0d5c7',
      tableBorderColor: '#e0d5c7',
      tableHeaderBg: '#f0ebe5',
      tableHeaderColor: '#3d3d3d',
      tableStripeBg: '#faf8f3',
      hrColor: '#e0d5c7',
      strongColor: '#6b5b4e',
      emColor: '#8b7355',
      listMarkerColor: '#c9a575',
    }
  },

  // 技术类 - Code（开发者等宽字体）
  code: {
    id: 'code',
    name: '开发者',
    description: '开发者等宽字体，适合技术文档',
    category: 'tech',
    icon: '💻',
    isPro: true,
    styles: {
      ...baseDarkTheme,
      backgroundColor: '#1e1e1e',
      maxWidth: '800px',
      padding: '40px 36px',
      titleFont: '"Fira Code", "Monaco", monospace',
      titleSize: '28px',
      titleWeight: '700',
      titleColor: '#4ec9b0',
      titleMarginBottom: '24px',
      h2Font: '"Fira Code", "Monaco", monospace',
      h2Size: '22px',
      h2Weight: '600',
      h2Color: '#569cd6',
      h2BorderColor: '#569cd6',
      h2MarginTop: '36px',
      h2MarginBottom: '16px',
      h3Size: '18px',
      h3Weight: '600',
      h3Color: '#9cdcfe',
      bodyFont: '"Fira Code", "Monaco", monospace',
      bodySize: '15px',
      bodyColor: '#d4d4d4',
      bodyLineHeight: '1.7',
      paragraphSpacing: '16px',
      linkColor: '#4ec9b0',
      linkHoverColor: '#6dd9c0',
      blockquoteBorderColor: '#569cd6',
      blockquoteBg: '#2d2d30',
      blockquoteColor: '#9cdcfe',
      codeBg: '#2d2d30',
      codeColor: '#ce9178',
      codeBlockBg: '#1e1e1e',
      codeBlockBorder: '#3e3e42',
      tableBorderColor: '#3e3e42',
      tableHeaderBg: '#2d2d30',
      tableHeaderColor: '#4ec9b0',
      tableStripeBg: '#252526',
      hrColor: '#3e3e42',
      strongColor: '#dcdcaa',
      emColor: '#c586c0',
      listMarkerColor: '#4ec9b0',
    }
  },

  // 技术类 - Terminal（终端/控制台美学）
  terminal: {
    id: 'terminal',
    name: '终端控制台',
    description: '终端控制台美学，适合命令行文档',
    category: 'tech',
    icon: '⌨️',
    isPro: true,
    styles: {
      ...baseDarkTheme,
      backgroundColor: '#0c0c0c',
      maxWidth: '840px',
      padding: '32px 28px',
      titleFont: '"Courier New", monospace',
      titleSize: '26px',
      titleWeight: '700',
      titleColor: '#00ff00',
      titleMarginBottom: '20px',
      h2Font: '"Courier New", monospace',
      h2Size: '20px',
      h2Weight: '700',
      h2Color: '#00ff00',
      h2BorderColor: 'transparent',
      h2MarginTop: '32px',
      h2MarginBottom: '14px',
      h3Size: '18px',
      h3Weight: '600',
      h3Color: '#00cc00',
      bodyFont: '"Courier New", monospace',
      bodySize: '15px',
      bodyColor: '#c0c0c0',
      bodyLineHeight: '1.6',
      paragraphSpacing: '14px',
      linkColor: '#00ffff',
      linkHoverColor: '#00cccc',
      blockquoteBorderColor: '#00ff00',
      blockquoteBg: '#1a1a1a',
      blockquoteColor: '#a0a0a0',
      codeBg: '#1a1a1a',
      codeColor: '#ffff00',
      codeBlockBg: '#0c0c0c',
      codeBlockBorder: '#333333',
      tableBorderColor: '#333333',
      tableHeaderBg: '#1a1a1a',
      tableHeaderColor: '#00ff00',
      tableStripeBg: '#0f0f0f',
      hrColor: '#333333',
      strongColor: '#ffffff',
      emColor: '#ffff00',
      listMarkerColor: '#00ff00',
    }
  },

  // 技术类 - Cyberpunk（未来霓虹风格）
  cyberpunk: {
    id: 'cyberpunk',
    name: '赛博朋克',
    description: '未来霓虹风格，适合科技前沿内容',
    category: 'tech',
    icon: '🌃',
    isPro: true,
    styles: {
      ...baseDarkTheme,
      backgroundColor: '#0a0e27',
      maxWidth: '720px',
      padding: '44px 40px',
      titleFont: '"Orbitron", sans-serif',
      titleSize: '32px',
      titleWeight: '900',
      titleColor: '#ff00ff',
      titleMarginBottom: '24px',
      h2Font: '"Orbitron", sans-serif',
      h2Size: '24px',
      h2Weight: '700',
      h2Color: '#00ffff',
      h2BorderColor: '#ff00ff',
      h2MarginTop: '40px',
      h2MarginBottom: '16px',
      h3Size: '20px',
      h3Weight: '600',
      h3Color: '#00ff00',
      bodyFont: '"Rajdhani", sans-serif',
      bodySize: '16px',
      bodyColor: '#e0e0e0',
      bodyLineHeight: '1.75',
      paragraphSpacing: '16px',
      linkColor: '#ff00ff',
      linkHoverColor: '#ff66ff',
      blockquoteBorderColor: '#00ffff',
      blockquoteBg: '#1a1f3a',
      blockquoteColor: '#b0b0b0',
      codeBg: '#1a1f3a',
      codeColor: '#ff00ff',
      codeBlockBg: '#0d1117',
      codeBlockBorder: '#ff00ff',
      tableBorderColor: '#00ffff',
      tableHeaderBg: '#1a1f3a',
      tableHeaderColor: '#ff00ff',
      tableStripeBg: '#0f1419',
      hrColor: '#00ffff',
      strongColor: '#ff00ff',
      emColor: '#00ffff',
      listMarkerColor: '#00ff00',
    }
  },

  // 极简类 - Zen（超极简留白）
  zen: {
    id: 'zen',
    name: '禅意留白',
    description: '超极简留白设计，适合深度思考',
    category: 'minimal',
    icon: '🧘',
    isPro: true,
    styles: {
      ...baseLightTheme,
      backgroundColor: '#ffffff',
      maxWidth: '600px',
      padding: '64px 48px',
      titleFont: '"Noto Serif SC", serif',
      titleSize: '28px',
      titleWeight: '400',
      titleColor: '#2c2c2c',
      titleMarginBottom: '40px',
      h2Font: '"Noto Serif SC", serif',
      h2Size: '22px',
      h2Weight: '400',
      h2Color: '#3a3a3a',
      h2BorderColor: 'transparent',
      h2MarginTop: '56px',
      h2MarginBottom: '24px',
      h3Size: '18px',
      h3Weight: '400',
      h3Color: '#4a4a4a',
      bodyFont: '"Noto Serif SC", serif',
      bodySize: '16px',
      bodyColor: '#4a4a4a',
      bodyLineHeight: '2.2',
      paragraphSpacing: '24px',
      linkColor: '#2c2c2c',
      linkHoverColor: '#1a1a1a',
      blockquoteBorderColor: '#d0d0d0',
      blockquoteBg: 'transparent',
      blockquoteColor: '#6a6a6a',
      codeBg: '#f9f9f9',
      codeColor: '#2c2c2c',
      codeBlockBg: '#fafafa',
      codeBlockBorder: '#e8e8e8',
      tableBorderColor: '#e8e8e8',
      tableHeaderBg: '#fafafa',
      tableHeaderColor: '#2c2c2c',
      tableStripeBg: '#ffffff',
      hrColor: '#e8e8e8',
      strongColor: '#2c2c2c',
      emColor: '#6a6a6a',
      listMarkerColor: '#d0d0d0',
    }
  },

  // Apple 风 - Apple Light（纯净亮色）
  appleLight: {
    id: 'apple-light',
    name: 'Apple Light',
    description: '纯净亮色，极简无衬线，高级感',
    category: 'minimal',
    icon: '✨',
    isPro: false,
    styles: {
      ...baseLightTheme,
      backgroundColor: '#ffffff',
      maxWidth: '680px',
      padding: '56px 48px',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      titleSize: '32px',
      titleWeight: '700',
      titleColor: '#000000',
      titleMarginBottom: '28px',
      h2Font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h2Size: '24px',
      h2Weight: '600',
      h2Color: '#1a1a1a',
      h2BorderColor: '#f5f5f5',
      h2MarginTop: '44px',
      h2MarginBottom: '16px',
      h3Size: '20px',
      h3Weight: '600',
      h3Color: '#333333',
      bodyFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      bodySize: '16px',
      bodyColor: '#333333',
      bodyLineHeight: '1.8',
      paragraphSpacing: '16px',
      linkColor: '#0071e3',
      linkHoverColor: '#0077ed',
      blockquoteBorderColor: '#d0d0d0',
      blockquoteBg: '#f9f9f9',
      blockquoteColor: '#666666',
      codeBg: '#f5f5f5',
      codeColor: '#d9453b',
      codeBlockBg: '#f9f9f9',
      codeBlockBorder: '#e8e8e8',
      tableBorderColor: '#e8e8e8',
      tableHeaderBg: '#f9f9f9',
      tableHeaderColor: '#000000',
      tableStripeBg: '#ffffff',
      hrColor: '#e8e8e8',
      strongColor: '#000000',
      emColor: '#666666',
      listMarkerColor: '#0071e3',
    }
  },

  // Apple 风 - Apple Dark（高级暗色）
  appleDark: {
    id: 'apple-dark',
    name: 'Apple Dark',
    description: '深灰暗色，优雅极简，适合夜间阅读',
    category: 'minimal',
    icon: '🌙',
    isPro: true,
    styles: {
      ...baseDarkTheme,
      backgroundColor: '#1d1d1f',
      maxWidth: '700px',
      padding: '56px 48px',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      titleSize: '32px',
      titleWeight: '700',
      titleColor: '#ffffff',
      titleMarginBottom: '28px',
      h2Font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h2Size: '24px',
      h2Weight: '600',
      h2Color: '#f5f5f7',
      h2BorderColor: '#424245',
      h2MarginTop: '44px',
      h2MarginBottom: '16px',
      h3Size: '20px',
      h3Weight: '600',
      h3Color: '#e5e5e7',
      bodyFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      bodySize: '16px',
      bodyColor: '#e5e5e7',
      bodyLineHeight: '1.8',
      paragraphSpacing: '16px',
      linkColor: '#0a84ff',
      linkHoverColor: '#55b4ff',
      blockquoteBorderColor: '#424245',
      blockquoteBg: '#2a2a2d',
      blockquoteColor: '#a1a1a6',
      codeBg: '#2a2a2d',
      codeColor: '#ff9f0a',
      codeBlockBg: '#1d1d1f',
      codeBlockBorder: '#424245',
      tableBorderColor: '#424245',
      tableHeaderBg: '#2a2a2d',
      tableHeaderColor: '#ffffff',
      tableStripeBg: '#1d1d1f',
      hrColor: '#424245',
      strongColor: '#ffffff',
      emColor: '#a1a1a6',
      listMarkerColor: '#0a84ff',
    }
  },

  // Apple 风 - Apple Gray（中性灰系）
  appleGray: {
    id: 'apple-gray',
    name: 'Apple Gray',
    description: '中性灰系，SF Pro 风格，专业严谨',
    category: 'minimal',
    icon: '📱',
    isPro: true,
    styles: {
      ...baseLightTheme,
      backgroundColor: '#f5f5f7',
      maxWidth: '700px',
      padding: '56px 48px',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      titleSize: '32px',
      titleWeight: '700',
      titleColor: '#1d1d1f',
      titleMarginBottom: '28px',
      h2Font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h2Size: '24px',
      h2Weight: '600',
      h2Color: '#424245',
      h2BorderColor: '#d5d5d7',
      h2MarginTop: '44px',
      h2MarginBottom: '16px',
      h3Size: '20px',
      h3Weight: '600',
      h3Color: '#555555',
      bodyFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      bodySize: '16px',
      bodyColor: '#424245',
      bodyLineHeight: '1.8',
      paragraphSpacing: '16px',
      linkColor: '#0071e3',
      linkHoverColor: '#0077ed',
      blockquoteBorderColor: '#d5d5d7',
      blockquoteBg: '#ffffff',
      blockquoteColor: '#666666',
      codeBg: '#ffffff',
      codeColor: '#d9453b',
      codeBlockBg: '#f9f9f9',
      codeBlockBorder: '#e8e8e8',
      tableBorderColor: '#d5d5d7',
      tableHeaderBg: '#ffffff',
      tableHeaderColor: '#1d1d1f',
      tableStripeBg: '#f5f5f7',
      hrColor: '#d5d5d7',
      strongColor: '#1d1d1f',
      emColor: '#666666',
      listMarkerColor: '#0071e3',
    }
  },

  // Apple 风 - Silicon（科技感高级）
  silicon: {
    id: 'silicon',
    name: 'Silicon Valley',
    description: '科技感高级风格，适合技术内容',
    category: 'tech',
    icon: '💎',
    isPro: true,
    styles: {
      ...baseLightTheme,
      backgroundColor: '#fafbfc',
      maxWidth: '720px',
      padding: '56px 48px',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      titleSize: '32px',
      titleWeight: '700',
      titleColor: '#0a0e27',
      titleMarginBottom: '28px',
      h2Font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h2Size: '24px',
      h2Weight: '600',
      h2Color: '#1a2332',
      h2BorderColor: '#e1e6ed',
      h2MarginTop: '44px',
      h2MarginBottom: '16px',
      h3Size: '20px',
      h3Weight: '600',
      h3Color: '#3a4555',
      bodyFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      bodySize: '16px',
      bodyColor: '#3a4555',
      bodyLineHeight: '1.8',
      paragraphSpacing: '16px',
      linkColor: '#0071e3',
      linkHoverColor: '#0077ed',
      blockquoteBorderColor: '#0071e3',
      blockquoteBg: '#f0f6ff',
      blockquoteColor: '#5a6b7a',
      codeBg: '#f5f7fa',
      codeColor: '#0071e3',
      codeBlockBg: '#f9fafb',
      codeBlockBorder: '#e1e6ed',
      tableBorderColor: '#e1e6ed',
      tableHeaderBg: '#f9fafb',
      tableHeaderColor: '#0a0e27',
      tableStripeBg: '#fafbfc',
      hrColor: '#e1e6ed',
      strongColor: '#0a0e27',
      emColor: '#5a6b7a',
      listMarkerColor: '#0071e3',
    }
  },

  // Minimal Pro（极简升级版）
  minimalPro: {
    id: 'minimal-pro',
    name: 'Minimal Pro',
    description: '极简升级版，严谨排版，高级感',
    category: 'minimal',
    icon: '◼️',
    isPro: true,
    styles: {
      ...baseLightTheme,
      backgroundColor: '#ffffff',
      maxWidth: '660px',
      padding: '60px 50px',
      titleFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      titleSize: '30px',
      titleWeight: '800',
      titleColor: '#111827',
      titleMarginBottom: '32px',
      h2Font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h2Size: '22px',
      h2Weight: '700',
      h2Color: '#1f2937',
      h2BorderColor: 'transparent',
      h2MarginTop: '48px',
      h2MarginBottom: '20px',
      h3Size: '18px',
      h3Weight: '600',
      h3Color: '#374151',
      bodyFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      bodySize: '16px',
      bodyColor: '#374151',
      bodyLineHeight: '1.9',
      paragraphSpacing: '20px',
      linkColor: '#111827',
      linkHoverColor: '#1f2937',
      blockquoteBorderColor: '#d1d5db',
      blockquoteBg: 'transparent',
      blockquoteColor: '#6b7280',
      codeBg: '#f3f4f6',
      codeColor: '#111827',
      codeBlockBg: '#f9fafb',
      codeBlockBorder: '#e5e7eb',
      tableBorderColor: '#e5e7eb',
      tableHeaderBg: '#f9fafb',
      tableHeaderColor: '#111827',
      tableStripeBg: '#ffffff',
      hrColor: '#e5e7eb',
      strongColor: '#111827',
      emColor: '#6b7280',
      listMarkerColor: '#9ca3af',
    }
  },

  // 极简类 - Paper（纸质纹理）
  paper: {
    id: 'paper',
    name: '纸质纹理',
    description: '纸质纹理效果，适合传统阅读',
    category: 'minimal',
    icon: '📄',
    isPro: true,
    styles: {
      ...baseLightTheme,
      backgroundColor: '#f4f1ea',
      maxWidth: '680px',
      padding: '48px 40px',
      titleFont: '"Crimson Text", Georgia, serif',
      titleSize: '32px',
      titleWeight: '600',
      titleColor: '#2c2416',
      titleMarginBottom: '24px',
      h2Font: '"Crimson Text", Georgia, serif',
      h2Size: '24px',
      h2Weight: '600',
      h2Color: '#3d3426',
      h2BorderColor: 'transparent',
      h2MarginTop: '40px',
      h2MarginBottom: '16px',
      h3Size: '20px',
      h3Weight: '600',
      h3Color: '#4e4436',
      bodyFont: '"Crimson Text", Georgia, serif',
      bodySize: '17px',
      bodyColor: '#3d3426',
      bodyLineHeight: '1.9',
      paragraphSpacing: '18px',
      linkColor: '#8b6914',
      linkHoverColor: '#6b5010',
      blockquoteBorderColor: '#c9b896',
      blockquoteBg: 'transparent',
      blockquoteColor: '#5e5446',
      codeBg: '#e8e3d6',
      codeColor: '#8b6914',
      codeBlockBg: '#ebe7dc',
      codeBlockBorder: '#d4cdb8',
      tableBorderColor: '#d4cdb8',
      tableHeaderBg: '#e8e3d6',
      tableHeaderColor: '#2c2416',
      tableStripeBg: '#f9f7f2',
      hrColor: '#d4cdb8',
      strongColor: '#2c2416',
      emColor: '#8b6914',
      listMarkerColor: '#c9b896',
    }
  },

  // 故事类 - Novel（书籍阅读体验）
  novel: {
    id: 'novel',
    name: '小说阅读',
    description: '书籍阅读体验，适合长篇故事',
    category: 'story',
    icon: '📚',
    isPro: true,
    styles: {
      ...baseLightTheme,
      backgroundColor: '#faf8f3',
      maxWidth: '640px',
      padding: '56px 44px',
      titleFont: '"Libre Baskerville", Georgia, serif',
      titleSize: '30px',
      titleWeight: '700',
      titleColor: '#1a1a1a',
      titleMarginBottom: '32px',
      h2Font: '"Libre Baskerville", Georgia, serif',
      h2Size: '24px',
      h2Weight: '700',
      h2Color: '#2c2c2c',
      h2BorderColor: 'transparent',
      h2MarginTop: '48px',
      h2MarginBottom: '20px',
      h3Size: '20px',
      h3Weight: '600',
      h3Color: '#3a3a3a',
      bodyFont: '"Libre Baskerville", Georgia, serif',
      bodySize: '17px',
      bodyColor: '#2c2c2c',
      bodyLineHeight: '2',
      paragraphSpacing: '20px',
      linkColor: '#8b4513',
      linkHoverColor: '#6b3410',
      blockquoteBorderColor: '#d4a574',
      blockquoteBg: 'transparent',
      blockquoteColor: '#5a5a5a',
      codeBg: '#f0ebe3',
      codeColor: '#8b4513',
      codeBlockBg: '#f5f2ed',
      codeBlockBorder: '#e0d8cc',
      tableBorderColor: '#e0d8cc',
      tableHeaderBg: '#f0ebe3',
      tableHeaderColor: '#1a1a1a',
      tableStripeBg: '#faf8f3',
      hrColor: '#e0d8cc',
      strongColor: '#1a1a1a',
      emColor: '#8b4513',
      listMarkerColor: '#d4a574',
    }
  },

  // 故事类 - Journal（个人日记风格）
  journal: {
    id: 'journal',
    name: '个人日记',
    description: '个人日记风格，适合随笔记录',
    category: 'story',
    icon: '📔',
    isPro: true,
    styles: {
      ...baseLightTheme,
      backgroundColor: '#f9f8f6',
      maxWidth: '620px',
      padding: '48px 40px',
      titleFont: '"Dancing Script", cursive',
      titleSize: '32px',
      titleWeight: '700',
      titleColor: '#4a5046',
      titleMarginBottom: '28px',
      h2Font: '"Indie Flower", cursive',
      h2Size: '24px',
      h2Weight: '400',
      h2Color: '#5a6456',
      h2BorderColor: 'transparent',
      h2MarginTop: '40px',
      h2MarginBottom: '18px',
      h3Size: '20px',
      h3Weight: '400',
      h3Color: '#6b7566',
      bodyFont: '"Patrick Hand", cursive',
      bodySize: '16px',
      bodyColor: '#3d3d3d',
      bodyLineHeight: '1.95',
      paragraphSpacing: '18px',
      linkColor: '#6b7355',
      linkHoverColor: '#5a6456',
      blockquoteBorderColor: '#95a7b8',
      blockquoteBg: '#f5f4f0',
      blockquoteColor: '#5a5a5a',
      codeBg: '#eef0ee',
      codeColor: '#6b7355',
      codeBlockBg: '#f5f4f0',
      codeBlockBorder: '#d4dde5',
      tableBorderColor: '#d4dde5',
      tableHeaderBg: '#eef0ee',
      tableHeaderColor: '#4a5046',
      tableStripeBg: '#f9f8f6',
      hrColor: '#d4dde5',
      strongColor: '#4a5046',
      emColor: '#6b7355',
      listMarkerColor: '#95a7b8',
    }
  },

};

// 主题分类
const themeCategories = [
  { id: 'all', name: '全部主题' },
  { id: 'business', name: '商务' },
  { id: 'creative', name: '创意' },
  { id: 'tech', name: '技术' },
  { id: 'minimal', name: '极简' },
  { id: 'story', name: '故事' }
];

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
      margin-top: 0;
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

    .markdown-body table tbody tr {
      background: ${styles.backgroundColor} !important;
      color: ${styles.bodyColor} !important;
    }

    .markdown-body table th {
      background: ${styles.tableHeaderBg} !important;
      color: ${styles.tableHeaderColor} !important;
      font-weight: 600;
    }

    /* 表格斑马纹样式 */
    .markdown-body table tbody tr:nth-child(2n) {
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
  return Object.values(templates).find(t => t.id === id) || templates.default;
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    templates,
    themeCategories,
    getAllTemplates,
    getTemplateById,
    generateTemplateCSS,
  };
}
