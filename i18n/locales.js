// MDSKILL 多语言配置文件
// Language configuration file for MDSKILL

const locales = {
  en: {
    // Application
    appName: 'MDSKILL',
    appSubtitle: 'Markdown Editor',

    // Menu
    file: 'File',
    edit: 'Edit',
    view: 'View',
    help: 'Help',
    language: 'Language',
    switchToEnglish: 'English',
    switchToChinese: '中文',

    // File menu
    newWindow: 'New Window',
    openFile: 'Open File...',
    save: 'Save',
    saveAs: 'Save As...',
    exportPDF: 'Export as PDF',
    quit: 'Quit',

    // Edit menu
    undo: 'Undo',
    redo: 'Redo',
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    selectAll: 'Select All',

    // View menu
    togglePreview: 'Toggle Preview',
    toggleFullscreen: 'Toggle Fullscreen',
    actualSize: 'Actual Size',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',

    // Toolbar tooltips
    toggleSidebar: 'Toggle Sidebar',
    toggleTheme: 'Toggle Theme',
    aiFormat: 'AI Format Markdown',
    searchDocument: 'Search Document',
    documentOutline: 'Document Outline',
    newFile: 'New Window',
    openFileBtn: 'Open File',
    saveFile: 'Save File',
    bold: 'Bold',
    italic: 'Italic',
    codeBlock: 'Code Block',
    insertLink: 'Insert Link',
    selectTheme: 'Select Theme',
    copyToWechat: 'Copy to WeChat Official Account',

    // Activation
    activatePro: 'Activate MDskill Pro',
    activateTitle: 'Upgrade to Pro',
    activateSubtitle: 'Unlock all premium features',
    deviceFingerprint: 'Device ID',
    licenseKey: 'License Key',
    activate: 'Activate',
    activating: 'Activating...',
    cancel: 'Cancel',
    getKey: 'Get License Key',
    contactInfo: 'Email: support@mdskill.io',
    contactNote: 'Please contact us to purchase a license key',
    copyDeviceId: 'Copy',
    deviceIdCopied: 'Device ID copied to clipboard',
    helpText: 'Copy your Device ID and email us to get your license key.',
    deviceHint: 'This ID is generated from your hardware information and does not contain any personal data. It is used only for license verification.',

    // Privacy & Data
    privacyTitle: 'Privacy & Data Collection',
    whatWeCollect: 'What we collect:',
    collectList: [
      'Device hostname (hashed for privacy)',
      'Operating system type',
      'CPU architecture',
      'Application version'
    ],
    whatWeDoNotCollect: 'What we do NOT collect:',
    doNotCollectList: [
      'Your documents or file contents',
      'Browsing history or usage patterns',
      'Location data or IP address',
      'Personal information'
    ],
    privacyNote: 'This Device ID is generated from your hardware information and does not contain any personal data. It is used only for license verification.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',

    // Activation messages
    activationSuccess: 'Activation successful!',
    activationFailed: 'Activation failed',
    invalidLicense: 'Invalid license key',
    deviceLimitReached: 'Device limit reached for this license',
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',

    // Error messages with suggestions
    errors: {
      networkError: {
        title: 'Connection Failed',
        message: 'Unable to reach the license server.',
        suggestions: [
          'Check your internet connection',
          'Try again in a moment',
          'Contact support if the problem persists'
        ],
        action: 'Retry'
      },
      invalidLicense: {
        title: 'Invalid License Key',
        message: 'The license key you entered is not valid.',
        suggestions: [
          'Check for typos in the license key',
          'Make sure you copied the entire key',
          'Contact support@mdskill.io for help'
        ],
        action: 'Try Again'
      },
      deviceLimit: {
        title: 'Device Limit Reached',
        message: 'This license is already activated on the maximum number of devices (3).',
        suggestions: [
          'Deactivate MDskill on another device',
          'Contact us to increase your device limit',
          'Purchase an additional license'
        ],
        action: 'Contact Support'
      },
      serverError: {
        title: 'Server Error',
        message: 'The license server encountered an error.',
        suggestions: [
          'Wait a moment and try again',
          'Check our status page',
          'Contact support if the issue continues'
        ],
        action: 'Retry'
      }
    },

    // Document operations
    untitled: 'Untitled',
    saved: 'Saved',
    modified: 'Modified',
    saving: 'Saving...',

    // Search
    search: 'Search',
    searchPlaceholder: 'Search in document...',
    searchResults: 'results',
    noResults: 'No results found',
    previousMatch: 'Previous match',
    nextMatch: 'Next match',
    closeSearch: 'Close search',

    // Export
    exportSuccess: 'Exported successfully',
    exportFailed: 'Export failed',
    exportingPDF: 'Exporting PDF...',

    // Templates
    templates: 'Templates',
    selectTemplate: 'Select a template',
    freeTemplates: 'Free Templates',
    proTemplates: 'Pro Templates',

    // Toast messages
    copied: 'Copied to clipboard',
    fileSaved: 'File saved successfully',
    fileOpened: 'File opened',

    // Subscription
    subscription: 'Subscription',
    subscriptionStatus: 'Subscription Status',
    active: 'Active',
    expired: 'Expired',
    expiresOn: 'Expires on',
    renewSubscription: 'Renew Subscription',

    // Connecting to server
    connecting: 'Connecting to license server...',
    verifying: 'Verifying license...',
    connected: 'Connected',

    // Runtime messages (alerts/confirms)
    messages: {
      initFailed: 'App initialization failed: missing critical UI elements',
      initError: 'App initialization failed: {error}',
      editorLost: 'Editor element lost, app cannot work properly',
      emptyContent: 'Editor content is empty',
      wechatRendererNotLoaded: 'WeChat renderer not loaded, please refresh and try again',
      copyModuleNotLoaded: 'Copy module not loaded, please refresh and try again',
      aiFormatFailed: 'AI formatting failed: {error}',
      pdfExportSuccess: 'PDF exported successfully!\nSaved to: {path}',
      pdfExportFailed: 'PDF export failed: {error}',
      pdfExportError: 'PDF export error: {error}'
    },

    confirmations: {
      membershipExpiring: '⏰ Membership Expiring\n\n{message}\n\nRenew now?',
      membershipExpired: '😢 Membership Expired\n\n{message}\n\nRenew now?',
      viewMembershipBenefits: '{message}\n\nView membership benefits?'
    },

    // Document search panel
    search: {
      tabSearch: '🔍 Search',
      tabOutline: '📋 Outline',
      placeholder: 'Search in document...',
      emptyHint: 'Enter keywords to search',
      prevMatch: 'Previous (Shift+Enter)',
      nextMatch: 'Next (Enter)',
      caseSensitive: 'Case sensitive',
      regex: 'Regular expression',
      noResults: 'No results found',
      resultsCount: '{current}/{total}'
    },

    // Editor
    editor: {
      placeholder: 'Start writing your Markdown document...\n\nSupported features:\n• Headers: # ## ###\n• Bold: **text**\n• Italic: *text*\n• Links: [text](url)\n• Code: `code` or ```language\n• Lists, tables, and more'
    },

    // Common
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    finish: 'Finish',
    loading: 'Loading...',
    pleaseWait: 'Please wait...'
  },

  zh: {
    // 应用
    appName: 'MDSKILL',
    appSubtitle: 'Markdown 编辑器',

    // 菜单
    file: '文件',
    edit: '编辑',
    view: '查看',
    help: '帮助',
    language: '语言',
    switchToEnglish: 'English',
    switchToChinese: '中文',

    // 文件菜单
    newWindow: '新建窗口',
    openFile: '打开文件...',
    save: '保存',
    saveAs: '另存为...',
    exportPDF: '导出为 PDF',
    quit: '退出',

    // 编辑菜单
    undo: '撤销',
    redo: '重做',
    cut: '剪切',
    copy: '复制',
    paste: '粘贴',
    selectAll: '全选',

    // 查看菜单
    togglePreview: '切换预览',
    toggleFullscreen: '切换全屏',
    actualSize: '实际大小',
    zoomIn: '放大',
    zoomOut: '缩小',

    // 工具栏提示
    toggleSidebar: '切换侧边栏',
    toggleTheme: '切换主题',
    aiFormat: 'AI 格式化 Markdown',
    searchDocument: '搜索文档',
    documentOutline: '文档大纲',
    newFile: '新建窗口',
    openFileBtn: '打开文件',
    saveFile: '保存文件',
    bold: '加粗',
    italic: '斜体',
    codeBlock: '代码块',
    insertLink: '插入链接',
    selectTheme: '选择主题',
    copyToWechat: '复制到微信公众号',

    // 激活
    activatePro: '激活 MDskill 专业版',
    activateTitle: '升级到专业版',
    activateSubtitle: '解锁全部高级功能',
    deviceFingerprint: '设备指纹',
    licenseKey: '授权码',
    activate: '激活',
    activating: '激活中...',
    cancel: '取消',
    getKey: '获取授权码',
    contactInfo: '微信：AIPMAndy<br>邮箱：supera6@qq.com',
    contactNote: '请联系客服购买授权码',
    copyDeviceId: '复制',
    deviceIdCopied: '设备指纹已复制到剪贴板',
    helpText: '复制设备指纹，微信发送给开发者获取授权码。',
    deviceHint: '此设备指纹由您的硬件信息生成，不包含任何个人数据，仅用于授权验证。',

    // 隐私与数据
    privacyTitle: '隐私与数据收集',
    whatWeCollect: '我们收集的信息：',
    collectList: [
      '设备主机名（已加密保护隐私）',
      '操作系统类型',
      'CPU 架构',
      '应用版本'
    ],
    whatWeDoNotCollect: '我们不会收集：',
    doNotCollectList: [
      '您的文档或文件内容',
      '浏览历史或使用模式',
      '位置数据或 IP 地址',
      '个人信息'
    ],
    privacyNote: '此设备指纹由您的硬件信息生成，不包含任何个人数据，仅用于授权验证。',
    privacyPolicy: '隐私政策',
    termsOfService: '服务条款',

    // 激活消息
    activationSuccess: '激活成功！',
    activationFailed: '激活失败',
    invalidLicense: '无效的授权码',
    deviceLimitReached: '此授权码已达到设备数量上限',
    networkError: '网络错误，请检查您的网络连接。',
    serverError: '服务器错误，请稍后重试。',

    // 错误消息（带建议）
    errors: {
      networkError: {
        title: '连接失败',
        message: '无法连接到授权服务器。',
        suggestions: [
          '检查您的网络连接',
          '稍后再试',
          '如果问题持续存在，请联系技术支持'
        ],
        action: '重试'
      },
      invalidLicense: {
        title: '无效的授权码',
        message: '您输入的授权码无效。',
        suggestions: [
          '检查授权码中是否有拼写错误',
          '确保您复制了完整的授权码',
          '联系 support@mdskill.io 获取帮助'
        ],
        action: '重试'
      },
      deviceLimit: {
        title: '设备数量已达上限',
        message: '此授权码已在最多数量（3台）的设备上激活。',
        suggestions: [
          '在其他设备上停用 MDskill',
          '联系我们增加设备数量限制',
          '购买额外的授权码'
        ],
        action: '联系客服'
      },
      serverError: {
        title: '服务器错误',
        message: '授权服务器遇到错误。',
        suggestions: [
          '稍等片刻后重试',
          '查看我们的状态页面',
          '如果问题持续，请联系技术支持'
        ],
        action: '重试'
      }
    },

    // 文档操作
    untitled: '未命名文档',
    saved: '已保存',
    modified: '已修改',
    saving: '保存中...',

    // 搜索
    search: '搜索',
    searchPlaceholder: '在文档中搜索...',
    searchResults: '个结果',
    noResults: '未找到结果',
    previousMatch: '上一个匹配',
    nextMatch: '下一个匹配',
    closeSearch: '关闭搜索',

    // 导出
    exportSuccess: '导出成功',
    exportFailed: '导出失败',
    exportingPDF: '正在导出 PDF...',

    // 模板
    templates: '模板',
    selectTemplate: '选择模板',
    freeTemplates: '免费模板',
    proTemplates: '专业版模板',

    // Toast 消息
    copied: '已复制到剪贴板',
    fileSaved: '文件保存成功',
    fileOpened: '文件已打开',

    // 订阅
    subscription: '订阅',
    subscriptionStatus: '订阅状态',
    active: '有效',
    expired: '已过期',
    expiresOn: '到期时间',
    renewSubscription: '续订',

    // 连接服务器
    connecting: '正在连接授权服务器...',
    verifying: '正在验证授权...',
    connected: '已连接',

    // 运行时消息（弹窗）
    messages: {
      initFailed: '应用初始化失败：关键界面元素缺失',
      initError: '应用初始化失败：{error}',
      editorLost: '编辑器元素丢失，应用无法正常工作',
      emptyContent: '编辑器内容为空',
      wechatRendererNotLoaded: '微信渲染器未加载，请刷新页面重试',
      copyModuleNotLoaded: '复制功能模块未加载，请刷新页面重试',
      aiFormatFailed: 'AI 格式化失败：{error}',
      pdfExportSuccess: 'PDF 导出成功！\n保存位置：{path}',
      pdfExportFailed: 'PDF 导出失败：{error}',
      pdfExportError: 'PDF 导出出错：{error}'
    },

    confirmations: {
      membershipExpiring: '⏰ 会员即将到期\n\n{message}\n\n是否立即续费？',
      membershipExpired: '😢 会员已过期\n\n{message}\n\n是否立即续费？',
      viewMembershipBenefits: '{message}\n\n是否查看会员权益？'
    },

    // 文档搜索面板
    search: {
      tabSearch: '🔍 搜索',
      tabOutline: '📋 大纲',
      placeholder: '在文档中搜索...',
      emptyHint: '输入关键词开始搜索',
      prevMatch: '上一个 (Shift+Enter)',
      nextMatch: '下一个 (Enter)',
      caseSensitive: '区分大小写',
      regex: '正则表达式',
      noResults: '未找到结果',
      resultsCount: '{current}/{total}'
    },

    // 编辑器
    editor: {
      placeholder: '开始编写你的 Markdown 文档...\n\n支持的功能：\n• 标题：# ## ###\n• 加粗：**文本**\n• 斜体：*文本*\n• 链接：[文本](url)\n• 代码：`代码` 或 ```语言\n• 列表、表格等更多功能'
    },

    // 通用
    ok: '确定',
    yes: '是',
    no: '否',
    close: '关闭',
    back: '返回',
    next: '下一步',
    finish: '完成',
    loading: '加载中...',
    pleaseWait: '请稍候...'
  }
};

// 获取当前语言
function getCurrentLanguage() {
  if (typeof window !== 'undefined' && window.electronAPI) {
    // 渲染进程
    return localStorage.getItem('mdskill_language') || 'en';
  } else if (typeof require !== 'undefined') {
    // 主进程
    const Store = require('electron-store');
    const store = new Store();
    return store.get('language', 'en');
  }
  return 'en';
}

// 设置语言
function setLanguage(lang) {
  if (typeof window !== 'undefined' && window.electronAPI) {
    localStorage.setItem('mdskill_language', lang);
  } else if (typeof require !== 'undefined') {
    const Store = require('electron-store');
    const store = new Store();
    store.set('language', lang);
  }
}

// 获取翻译文本（支持变量替换）
function t(key, langOrParams = null, params = null) {
  // 兼容两种调用方式：
  // t('key', 'en') 或 t('key', {var: 'value'})
  let lang, variables;
  if (typeof langOrParams === 'string') {
    lang = langOrParams;
    variables = params || {};
  } else {
    lang = null;
    variables = langOrParams || {};
  }

  const currentLang = lang || getCurrentLanguage();
  const keys = key.split('.');
  let value = locales[currentLang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // 回退到英文
      value = locales.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // 如果英文也没有，返回 key 本身
        }
      }
      break;
    }
  }

  // 替换变量 {varName}
  if (typeof value === 'string' && Object.keys(variables).length > 0) {
    value = value.replace(/\{(\w+)\}/g, (match, varName) => {
      return variables[varName] !== undefined ? variables[varName] : match;
    });
  }

  return value;
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { locales, t, getCurrentLanguage, setLanguage };
}
