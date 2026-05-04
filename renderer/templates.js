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

  // 极简主义（专业版）
  minimal: {
    id: 'minimal',
    name: '极简现代',
    description: '极简设计，专注内容',
    category: 'minimal',
    icon: '✨',
    isPro: true,
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

  // 文艺清新（专业版）
  literary: {
    id: 'literary',
    name: '文艺清新',
    description: '优雅字体，适合随笔写作',
    category: 'creative',
    icon: '🌿',
    isPro: true,
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

  // 科技蓝（专业版）
  techBlue: {
    id: 'tech-blue',
    name: '科技蓝',
    description: '深蓝配色，科技感十足',
    category: 'tech',
    icon: '🔷',
    isPro: true,
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

  // 商务经典（专业版）
  business: {
    id: 'business',
    name: '商务经典',
    description: '专业严谨，适合商业文档',
    category: 'business',
    icon: '💼',
    isPro: true,
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

  // 暖色调（专业版）
  warm: {
    id: 'warm',
    name: '暖色温馨',
    description: '温暖配色，舒适阅读',
    category: 'creative',
    icon: '🌅',
    isPro: true,
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

  // 紫色梦幻（专业版）
  purple: {
    id: 'purple',
    name: '紫色梦幻',
    description: '优雅紫色，创意设计',
    category: 'creative',
    icon: '💜',
    isPro: true,
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

  // ============== 新增 13 个专业版主题 ==============

  // 商务类 - Professional（简洁企业风格）
  professional: {
    id: 'professional',
    name: '简洁企业',
    description: '简洁企业风格，适合商业报告',
    category: 'business',
    icon: '💼',
    isPro: true,
    styles: {
      ...baseStyles,
      backgroundColor: '#ffffff',
      maxWidth: '720px',
      padding: '48px 40px',
      titleFont: '"Helvetica Neue", Arial, sans-serif',
      titleSize: '32px',
      titleWeight: '600',
      titleColor: '#1a1a1a',
      titleMarginBottom: '24px',
      h2Font: '"Helvetica Neue", Arial, sans-serif',
      h2Size: '24px',
      h2Weight: '600',
      h2Color: '#2c3e50',
      h2BorderColor: '#e0e0e0',
      h2MarginTop: '40px',
      h2MarginBottom: '16px',
      h3Size: '20px',
      h3Weight: '600',
      h3Color: '#34495e',
      bodyFont: '"Helvetica Neue", Arial, sans-serif',
      bodySize: '16px',
      bodyColor: '#333333',
      bodyLineHeight: '1.75',
      paragraphSpacing: '16px',
      linkColor: '#3498db',
      linkHoverColor: '#2980b9',
      blockquoteBorderColor: '#3498db',
      blockquoteBg: '#f8f9fa',
      blockquoteColor: '#555555',
      codeBg: '#f5f5f5',
      codeColor: '#e74c3c',
      codeBlockBg: '#f8f9fa',
      codeBlockBorder: '#dee2e6',
      tableBorderColor: '#dee2e6',
      tableHeaderBg: '#f8f9fa',
      tableHeaderColor: '#1a1a1a',
      tableStripeBg: '#ffffff',
      hrColor: '#dee2e6',
      strongColor: '#1a1a1a',
      emColor: '#7f8c8d',
      listMarkerColor: '#3498db',
    }
  },

  // 商务类 - Executive（高端商务报告）
  executive: {
    id: 'executive',
    name: '高端商务',
    description: '高端商务报告风格，适合高管演示',
    category: 'business',
    icon: '👔',
    isPro: true,
    styles: {
      ...baseStyles,
      backgroundColor: '#0a0e27',
      maxWidth: '760px',
      padding: '56px 48px',
      titleFont: '"Playfair Display", Georgia, serif',
      titleSize: '38px',
      titleWeight: '700',
      titleColor: '#f8f9fa',
      titleMarginBottom: '32px',
      h2Font: '"Playfair Display", Georgia, serif',
      h2Size: '28px',
      h2Weight: '600',
      h2Color: '#d4af37',
      h2BorderColor: '#d4af37',
      h2MarginTop: '48px',
      h2MarginBottom: '20px',
      h3Size: '22px',
      h3Weight: '600',
      h3Color: '#c9b037',
      bodyFont: '"Lora", Georgia, serif',
      bodySize: '17px',
      bodyColor: '#e8e8e8',
      bodyLineHeight: '1.8',
      paragraphSpacing: '18px',
      linkColor: '#d4af37',
      linkHoverColor: '#f0c75e',
      blockquoteBorderColor: '#d4af37',
      blockquoteBg: '#1a1f3a',
      blockquoteColor: '#c9c9c9',
      codeBg: '#1a1f3a',
      codeColor: '#d4af37',
      codeBlockBg: '#0d1117',
      codeBlockBorder: '#2d3748',
      tableBorderColor: '#2d3748',
      tableHeaderBg: '#1a1f3a',
      tableHeaderColor: '#f8f9fa',
      tableStripeBg: '#0f1419',
      hrColor: '#2d3748',
      strongColor: '#ffffff',
      emColor: '#d4af37',
      listMarkerColor: '#d4af37',
    }
  },

  // 商务类 - Consulting（咨询演示风格）
  consulting: {
    id: 'consulting',
    name: '咨询演示',
    description: '咨询演示风格，适合战略分析',
    category: 'business',
    icon: '📊',
    isPro: true,
    styles: {
      ...baseStyles,
      backgroundColor: '#f5f7fa',
      maxWidth: '700px',
      padding: '44px 36px',
      titleFont: '"Arial", sans-serif',
      titleSize: '30px',
      titleWeight: '700',
      titleColor: '#003d82',
      titleMarginBottom: '20px',
      h2Font: '"Arial", sans-serif',
      h2Size: '24px',
      h2Weight: '700',
      h2Color: '#005eb8',
      h2BorderColor: '#005eb8',
      h2MarginTop: '36px',
      h2MarginBottom: '16px',
      h3Size: '20px',
      h3Weight: '600',
      h3Color: '#0072ce',
      bodyFont: '"Arial", sans-serif',
      bodySize: '16px',
      bodyColor: '#2c2c2c',
      bodyLineHeight: '1.7',
      paragraphSpacing: '16px',
      linkColor: '#005eb8',
      linkHoverColor: '#003d82',
      blockquoteBorderColor: '#005eb8',
      blockquoteBg: '#e8f4f8',
      blockquoteColor: '#2c2c2c',
      codeBg: '#e8f4f8',
      codeColor: '#c7254e',
      codeBlockBg: '#ffffff',
      codeBlockBorder: '#d0d7de',
      tableBorderColor: '#d0d7de',
      tableHeaderBg: '#005eb8',
      tableHeaderColor: '#ffffff',
      tableStripeBg: '#f9fafb',
      hrColor: '#d0d7de',
      strongColor: '#003d82',
      emColor: '#0072ce',
      listMarkerColor: '#005eb8',
    }
  },

  // 创意类 - Magazine（杂志布局）
  magazine: {
    id: 'magazine',
    name: '杂志布局',
    description: '杂志风格布局，适合深度报道',
    category: 'creative',
    icon: '📰',
    isPro: true,
    styles: {
      ...baseStyles,
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
      ...baseStyles,
      backgroundColor: '#fef6e4',
      maxWidth: '680px',
      padding: '52px 44px',
      titleFont: '"Pacifico", cursive',
      titleSize: '34px',
      titleWeight: '400',
      titleColor: '#f25f4c',
      titleMarginBottom: '28px',
      h2Font: '"Quicksand", sans-serif',
      h2Size: '26px',
      h2Weight: '600',
      h2Color: '#e53170',
      h2BorderColor: 'transparent',
      h2MarginTop: '40px',
      h2MarginBottom: '18px',
      h3Size: '21px',
      h3Weight: '600',
      h3Color: '#ff6b6b',
      bodyFont: '"Quicksand", sans-serif',
      bodySize: '16px',
      bodyColor: '#2d3142',
      bodyLineHeight: '1.85',
      paragraphSpacing: '18px',
      linkColor: '#f25f4c',
      linkHoverColor: '#e53170',
      blockquoteBorderColor: '#f25f4c',
      blockquoteBg: '#fffacd',
      blockquoteColor: '#2d3142',
      codeBg: '#ffe8cc',
      codeColor: '#e53170',
      codeBlockBg: '#fff9e6',
      codeBlockBorder: '#f7d794',
      tableBorderColor: '#f7d794',
      tableHeaderBg: '#ffe8cc',
      tableHeaderColor: '#2d3142',
      tableStripeBg: '#fffacd',
      hrColor: '#f7d794',
      strongColor: '#f25f4c',
      emColor: '#e53170',
      listMarkerColor: '#ff6b6b',
    }
  },

  // 创意类 - Playful（多彩活力）
  playful: {
    id: 'playful',
    name: '多彩活力',
    description: '多彩活力风格，适合创意内容',
    category: 'creative',
    icon: '🌈',
    isPro: true,
    styles: {
      ...baseStyles,
      backgroundColor: '#fff5f7',
      maxWidth: '660px',
      padding: '40px 36px',
      titleFont: '"Comic Neue", cursive',
      titleSize: '32px',
      titleWeight: '700',
      titleColor: '#ff006e',
      titleMarginBottom: '24px',
      h2Font: '"Comic Neue", cursive',
      h2Size: '24px',
      h2Weight: '700',
      h2Color: '#fb5607',
      h2BorderColor: 'transparent',
      h2MarginTop: '36px',
      h2MarginBottom: '16px',
      h3Size: '20px',
      h3Weight: '600',
      h3Color: '#ffbe0b',
      bodyFont: '"Nunito", sans-serif',
      bodySize: '16px',
      bodyColor: '#2b2d42',
      bodyLineHeight: '1.8',
      paragraphSpacing: '16px',
      linkColor: '#8338ec',
      linkHoverColor: '#3a86ff',
      blockquoteBorderColor: '#ff006e',
      blockquoteBg: '#fff0f6',
      blockquoteColor: '#2b2d42',
      codeBg: '#ffebf0',
      codeColor: '#ff006e',
      codeBlockBg: '#fff9e6',
      codeBlockBorder: '#ffd60a',
      tableBorderColor: '#ffd60a',
      tableHeaderBg: '#ffebf0',
      tableHeaderColor: '#2b2d42',
      tableStripeBg: '#fff9fb',
      hrColor: '#ffd60a',
      strongColor: '#ff006e',
      emColor: '#8338ec',
      listMarkerColor: '#fb5607',
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
      ...baseStyles,
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
      ...baseStyles,
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
      ...baseStyles,
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
      ...baseStyles,
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

  // 极简类 - Paper（纸质纹理）
  paper: {
    id: 'paper',
    name: '纸质纹理',
    description: '纸质纹理效果，适合传统阅读',
    category: 'minimal',
    icon: '📄',
    isPro: true,
    styles: {
      ...baseStyles,
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
      ...baseStyles,
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
      ...baseStyles,
      backgroundColor: '#fffef9',
      maxWidth: '620px',
      padding: '48px 40px',
      titleFont: '"Dancing Script", cursive',
      titleSize: '32px',
      titleWeight: '700',
      titleColor: '#5d4e37',
      titleMarginBottom: '28px',
      h2Font: '"Indie Flower", cursive',
      h2Size: '24px',
      h2Weight: '400',
      h2Color: '#6b5d4f',
      h2BorderColor: 'transparent',
      h2MarginTop: '40px',
      h2MarginBottom: '18px',
      h3Size: '20px',
      h3Weight: '400',
      h3Color: '#7d6e5d',
      bodyFont: '"Patrick Hand", cursive',
      bodySize: '16px',
      bodyColor: '#4a3f35',
      bodyLineHeight: '1.95',
      paragraphSpacing: '18px',
      linkColor: '#a0826d',
      linkHoverColor: '#8b6f5a',
      blockquoteBorderColor: '#d4a574',
      blockquoteBg: '#fef9f0',
      blockquoteColor: '#5d4e37',
      codeBg: '#fef5e7',
      codeColor: '#a0826d',
      codeBlockBg: '#fef9f0',
      codeBlockBorder: '#e8dcc8',
      tableBorderColor: '#e8dcc8',
      tableHeaderBg: '#fef5e7',
      tableHeaderColor: '#5d4e37',
      tableStripeBg: '#fffef9',
      hrColor: '#e8dcc8',
      strongColor: '#5d4e37',
      emColor: '#a0826d',
      listMarkerColor: '#d4a574',
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
