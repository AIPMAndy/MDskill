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
    open: 'Open File...',
    openFile: 'Open File...',
    recentDocuments: 'Recent Documents',
    noRecentDocuments: 'No Recent Documents',
    clearRecentDocuments: 'Clear Recent Documents',
    save: 'Save',
    saveAs: 'Save As...',
    export: 'Export',
    copyForWeChat: 'Copy for WeChat',
    copyForBlog: 'Copy for Blog',
    copyHTMLSource: 'Copy HTML Source',
    exportAsPDF: 'Export as PDF',
    exportPDF: 'Export as PDF',
    quit: 'Quit',

    // Edit menu
    undo: 'Undo',
    redo: 'Redo',
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    selectAll: 'Select All',
    find: 'Find',
    findReplace: 'Find and Replace',

    // View menu
    togglePreview: 'Toggle Preview',
    toggleFullscreen: 'Toggle Fullscreen',
    codeBlockLineNumbers: 'Code Block Line Numbers',
    actualSize: 'Actual Size',
    reload: 'Reload',
    toggleDevTools: 'Toggle Developer Tools',
    resetZoom: 'Actual Size',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',

    // Window menu
    window: 'Window',
    minimize: 'Minimize',
    zoom: 'Zoom',
    front: 'Bring All to Front',

    // Help menu
    about: 'Help',
    aiConfig: 'AI API Settings',
    getDeviceFingerprint: 'Show Device ID',
    contactDeveloper: 'Contact Developer',
    deviceFingerprintTitle: 'Device ID',
    deviceFingerprintMessage: 'Your Device ID:',
    copyButton: 'Copy',
    contactDeveloperTitle: 'Contact Developer',
    contactDeveloperMessage: 'Andy',
    contactDeveloperDetail: 'WeChat: AIPMAndy\nGitHub: https://github.com/AIPMAndy',
    openFileFailedTitle: 'Open File Failed',
    openFileFailedMessage: 'Unable to open file: {path}\n\n{error}',

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
      exportingPDF: 'Exporting PDF...',
      pdfExportSuccess: 'PDF exported successfully!\nSaved to: {path}',
      pdfExportFailed: 'PDF export failed: {error}',
      pdfExportError: 'PDF export error: {error}'
    },

    confirmations: {
      membershipExpiring: '⏰ Membership Expiring\n\n{message}\n\nRenew now?',
      membershipExpired: '😢 Membership Expired\n\n{message}\n\nRenew now?',
      viewMembershipBenefits: '{message}\n\nView membership benefits?'
    },

    subscriptionMessages: {
      expiring: 'Your membership expires in {days} days. Renew for just ¥19/month.',
      expired: 'Your membership has expired. Renew to restore all Pro features.\n\nMonthly membership: ¥19/month',
      featureLocked: '🔒 {featureName} is a Pro feature\n\nMonthly membership: ¥19/month\nNew users get a 7-day free trial'
    },

    featureNames: {
      themes: 'Themes',
      premiumThemes: 'Beautiful Themes',
      pdfExport: 'PDF Export',
      wechatCopy: 'Copy to WeChat',
      blogCopy: 'Copy to Blog',
      htmlExport: 'Copy HTML Source'
    },

    activationPrompt: {
      message: '{featureName} is a Pro feature 🔒\n\nYour Device ID: {deviceId}\n\nContact the developer for a license key:\nWeChat: AIPMAndy\n\nAfter getting a license key, choose "Activate Pro" from the Help menu.'
    },

    // Document search panel
    docSearch: {
      tabSearch: '🔍 Search',
      tabOutline: '📋 Outline',
      placeholder: 'Search in document...',
      emptyHint: 'Enter keywords to search',
      emptyHintWithTip: 'Enter keywords to search\n\nSupports regular expressions, try:\n\\b\\w{5}\\b (match 5-letter words)',
      noResults: 'No results found\n\nTry:\n• Check spelling\n• Use different keywords\n• Turn off "Case sensitive" option',
      prevMatch: 'Previous (Shift+Enter)',
      nextMatch: 'Next (Enter)',
      caseSensitive: 'Case sensitive',
      regex: 'Regular expression',
      resultsCount: '{current}/{total}',
      closeTooltip: 'Close'
    },

    // Editor
    editor: {
      placeholder: 'Start writing your Markdown document...\n\nSupported features:\n• Headers: # ## ###\n• Bold: **text**\n• Italic: *text*\n• Links: [text](url)\n• Code: `code` or ```language\n• Lists, tables, and more'
    },

    // Branding
    branding: {
      madeBy: 'Made by Andy'
    },

    // Status bar
    status: {
      wordsChars: '{words} words, {chars} chars',
      savedSecondsAgo: 'Saved {seconds}s ago',
      savedMinutesAgo: 'Saved {minutes}m ago',
      notSaved: 'Not saved'
    },

    // AI progress
    aiProgress: {
      formatting: 'Andy is converting this to Markdown...',
      cancel: 'Cancel'
    },

    // Find and replace modal
    findReplaceModal: {
      title: 'Find and Replace',
      findLabel: 'Find',
      findPlaceholder: 'Enter text to find',
      previous: 'Previous (Shift+Enter)',
      next: 'Next (Enter)',
      caseSensitive: 'Case sensitive',
      wholeWord: 'Whole word',
      regex: 'Regular expression',
      replaceLabel: 'Replace with',
      replacePlaceholder: 'Enter replacement',
      replace: 'Replace',
      replaceAll: 'Replace All',
      noMatches: 'No matches',
      replacedOne: 'Replaced 1 match',
      replacedMany: 'Replaced {count} matches',
      close: 'Close'
    },

    // Command palette
    commandPalette: {
      placeholder: 'Type to search files and commands...',
      noResults: 'No results found',
      commands: 'Commands',
      recentFiles: 'Recent Files',
      newWindowTitle: 'New Window',
      newWindowSubtitle: 'Create a new editor window',
      openFileTitle: 'Open File',
      openFileSubtitle: 'Open a Markdown file',
      saveFileTitle: 'Save File',
      saveFileSubtitle: 'Save current file',
      changeThemeTitle: 'Change Theme',
      changeThemeSubtitle: 'Open theme selector',
      searchTitle: 'Search in Document',
      searchSubtitle: 'Find text in current document',
      exportPdfTitle: 'Export to PDF',
      exportPdfSubtitle: 'Export current document as PDF',
      openFileFailed: 'Failed to open file: {error}'
    },

    // Sidebar
    sidebar: {
      openFolder: 'Open Folder',
      searchPlaceholder: 'Search files...',
      recentOpen: 'Recent Files',
      noRecentFiles: 'No recent files',
      currentFolder: 'Current Folder',
      noFolder: 'No folder open',
      openFolderFirst: 'Open a folder first',
      noMarkdownFiles: 'No Markdown files in this folder',
      noMatchingFiles: 'No matching files'
    },

    // Help page
    helpPage: {
      title: 'Help - MDSKILL',
      appName: 'MDSKILL',
      appTagline: 'Professional Markdown Editor & Publishing Tool',

      // Tabs
      tabFeatures: 'Features',
      tabShortcuts: 'Shortcuts',
      tabFaq: 'FAQ',
      tabAbout: 'About',

      // Features
      featureWechatTitle: 'WeChat Export',
      featureWechatDesc: 'Copy with styling preserved',
      featureBlogTitle: 'Blog Optimized',
      featureBlogDesc: 'Support major platforms',
      featureThemesTitle: 'Beautiful Themes',
      featureThemesDesc: '13 professional themes',
      featurePdfTitle: 'PDF Export',
      featurePdfDesc: 'Perfect layout preservation',
      featureHtmlTitle: 'HTML Source',
      featureHtmlDesc: 'One-click copy',
      featurePreviewTitle: 'Live Preview',
      featurePreviewDesc: 'What you see is what you get',

      sectionEditingTitle: 'EDITING',
      editMarkdownTitle: 'Markdown Editing',
      editMarkdownDesc: 'Standard Markdown syntax',
      editPreviewTitle: 'Live Preview',
      editPreviewDesc: 'Synchronized editing & preview',
      editHighlightTitle: 'Syntax Highlighting',
      editHighlightDesc: 'Code block highlighting',

      sectionExportTitle: 'EXPORT',
      exportWechatTitle: 'WeChat',
      exportWechatDesc: 'One-click copy to editor',
      exportBlogTitle: 'Blog Platforms',
      exportBlogDesc: 'Medium, Dev.to, Hashnode compatible',
      exportPdfTitle: 'PDF Export',
      exportPdfDesc: 'Professional layout for printing',

      // Shortcuts
      sectionFileTitle: 'FILE OPERATIONS',
      shortcutNew: 'New File',
      shortcutOpen: 'Open File',
      shortcutSave: 'Save File',

      sectionEditTitle: 'EDITING',
      shortcutUndo: 'Undo',
      shortcutRedo: 'Redo',
      shortcutFind: 'Find',
      shortcutReplace: 'Replace',

      sectionFormatTitle: 'FORMATTING',
      shortcutBold: 'Bold',
      shortcutItalic: 'Italic',
      shortcutLink: 'Insert Link',

      // FAQ
      faqCopyWechatQ: 'How to copy to WeChat?',
      faqCopyWechatA: 'Click "Copy to WeChat" button, then paste in WeChat editor',
      faqThemeQ: 'How to switch themes?',
      faqThemeA: 'Click theme selector in toolbar',
      faqPdfQ: 'How to export PDF?',
      faqPdfA: 'Click "Export PDF" button and choose save location',
      faqBlogQ: 'Which blog platforms are supported?',
      faqBlogA: 'Medium, Dev.to, Hashnode, and other major platforms',
      faqActivateQ: 'How to activate Pro version?',
      faqActivateA: 'Go to Help → Subscription, enter activation code. Contact: WeChat AIPMAndy or supera6@qq.com',
      faqTrialQ: 'How long is the trial?',
      faqTrialA: '7-day free trial with all pro features',

      // About
      aboutVersion: 'Version',
      aboutDescription: 'Professional Markdown Editor & Publishing Tool\nMake document editing efficient and layout beautiful',
      aboutWebsite: 'Website',
      aboutGithub: 'GitHub',
      aboutFeedback: 'Feedback',
      aboutFooter: '© 2026 MDSKILL. All rights reserved.\nContact: WeChat AIPMAndy | Email supera6@qq.com'
    },

    // Toast messages
    toast: {
      editorEmpty: 'Editor content is empty',
      copyWechatSuccess: 'Copied to clipboard, paste directly into WeChat editor',
      copyWechatSuccessWithTheme: 'Copied using「{theme}」theme to WeChat',
      copyBlogSuccess: 'Copied to clipboard, paste into Medium, Dev.to, Hashnode, etc.',
      copyHtmlSuccess: 'HTML source copied to clipboard',
      copyFailed: 'Copy failed, please try again',
      copyFailedError: 'Copy failed: {error}',
      themeProOnly: 'This theme requires Pro license 🔒',
      themeProOnlyTrial: '🔒 This is a Pro theme\n\nYou have {days} days left in your trial',
      themeProOnlyExpired: '🔒 This is a Pro theme\n\nYour trial has expired. Please upgrade to Pro',
      themeSwitched: 'Switched to "{name}" theme ✨',
      trialReminder: '⏰ Trial expires in {days} days\n\nUpgrade now to keep using Pro features',
      trialExpired: '⏰ Your trial has expired\n\nUpgrade to Pro to continue using premium features',
      uploadingImage: 'Uploading image...',
      imageUploaded: 'Image uploaded successfully',
      imageUploadFailed: 'Image upload failed: {error}'
    },

    // Alert/Error messages
    alerts: {
      initFailed: 'App initialization failed: {error}',
      aiFormatFailed: 'AI formatting failed: {error}',
      copyModuleNotLoaded: 'Copy module not loaded, please refresh and try again',
      wechatRendererNotLoaded: 'WeChat renderer not loaded, please refresh and try again'
    },

    // Theme selector
    themeSelector: {
      title: 'Select Theme',
      categoryAll: 'All',
      categoryFree: 'Free Themes',
      categoryPro: 'Pro Themes'
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
    pleaseWait: 'Please wait...',

    // Welcome modal
    welcome: {
      title: 'Welcome to MDskill',
      subtitle: 'Professional Markdown Editor',
      feature1Title: 'Beautiful Themes',
      feature1Desc: '13+ professional themes for every platform',
      feature2Title: 'One-Click Export',
      feature2Desc: 'WeChat, Medium, Dev.to, and more',
      feature3Title: 'Professional PDF',
      feature3Desc: 'High-quality PDF with auto table of contents',
      feature4Title: 'AI Formatting',
      feature4Desc: 'Transform messy text into beautiful Markdown',
      loadSample: 'Load Sample Document',
      startBlank: 'Start from Blank',
      dontShowAgain: "Don't show this again",
      sampleDocument: `# Welcome to MDskill ✨

## What is MDskill?

MDskill is a **professional Markdown editor** designed for content creators, technical writers, and bloggers.

### Key Features

- 🎨 **13+ Beautiful Themes** - Perfect rendering for WeChat, blogs, and more
- 🚀 **One-Click Export** - Copy to WeChat, Medium, Dev.to instantly
- 📄 **Professional PDF** - High-quality output with auto table of contents
- 🤖 **AI Formatting** - Transform messy notes into structured documents

### Quick Start

1. **Write** - Type your content using Markdown syntax
2. **Style** - Click theme selector to choose a theme
3. **Export** - Use toolbar buttons to copy or export

### Common Markdown Syntax

\`\`\`markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- List item 1
- List item 2

[Link text](https://example.com)

![Image](image-url.jpg)
\`\`\`

### Need Help?

- Press \`Cmd+F\` to search document
- Click **Help → Getting Started** for tutorials
- Contact us: WeChat AIPMAndy | supera6@qq.com

---

**Ready to create?** Delete this text and start writing! 🚀`
    },

    // WeChat Preview Modal
    wechatPreview: {
      title: 'Preview Before Copy',
      cancel: 'Cancel',
      copyToWechat: 'Copy to WeChat'
    },

    // AI Config Page
    aiConfigPage: {
      title: 'AI API Settings',
      description: 'Configure AI API to convert text into formatted Markdown with one click',
      warningTitle: 'Your Own API Key Required',
      warningText: 'This feature requires your own AI service API Key. The API Key will be securely stored locally and will not be uploaded to any server.\n\nRecommended: DeepSeek - Fast access in China, affordable (about ¥0.001/1k chars), excellent performance.',
      getDeepSeekKey: '→ Get DeepSeek API Key',
      tabUI: 'UI Config',
      tabJSON: 'JSON Config',
      providerLabel: 'AI Provider',
      providerPlaceholder: 'Please select provider',
      providerOpenAI: 'OpenAI',
      providerAnthropic: 'Anthropic',
      providerDeepSeek: 'DeepSeek (China)',
      providerZhipu: 'Zhipu AI',
      providerMoonshot: 'Moonshot',
      providerCustom: 'Custom API',
      apiKeyLabel: 'API Key',
      apiKeyPlaceholder: 'sk-...',
      apiKeyHint: 'Your API Key will be securely stored locally',
      modelLabel: 'Model Name',
      modelPlaceholder: 'e.g.: gpt-4o',
      modelHint: 'Please enter the complete model name',
      endpointLabel: 'API Endpoint',
      endpointPlaceholder: 'https://api.example.com/v1/chat/completions',
      cancel: 'Cancel',
      saveAndConvert: 'Save and Convert',
      jsonConfigLabel: 'JSON Configuration',
      jsonConfigPlaceholder: 'Example config:\n{\n  "provider": "deepseek",\n  "apiKey": "sk-xxx",\n  "model": "deepseek-chat",\n  "endpoint": "https://api.deepseek.com/v1/chat/completions",\n  "temperature": 0.3,\n  "maxTokens": 4096,\n  "systemPrompt": "You are a Markdown formatting expert...",\n  "customHeaders": {}\n}',
      jsonConfigHint: 'Supports all custom parameters including headers, temperature, etc.',
      saveJSON: 'Save and Convert',
      cancelJSON: 'Cancel',
      providerInfoOpenAI: 'Get API Key: <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform</a>',
      providerInfoAnthropic: 'Get API Key: <a href="https://console.anthropic.com/settings/keys" target="_blank">Anthropic Console</a>',
      providerInfoDeepSeek: 'Get API Key: <a href="https://platform.deepseek.com/api_keys" target="_blank">DeepSeek Platform</a><br>Fast access in China, low cost, excellent performance',
      providerInfoZhipu: 'Get API Key: <a href="https://open.bigmodel.cn/usercenter/apikeys" target="_blank">Zhipu AI Platform</a><br>China access, supports long text',
      providerInfoMoonshot: 'Get API Key: <a href="https://platform.moonshot.cn/console/api-keys" target="_blank">Moonshot Platform</a><br>China access, ultra-long context',
      modelPlaceholderOpenAI: 'e.g.: gpt-4o, gpt-4o-mini, o1',
      modelHintOpenAI: 'Enter the OpenAI model name',
      modelPlaceholderAnthropic: 'e.g.: claude-opus-4-20250514',
      modelHintAnthropic: 'Enter the Claude model name',
      modelPlaceholderDeepSeek: 'e.g.: deepseek-chat, deepseek-reasoner',
      modelHintDeepSeek: 'Enter the DeepSeek model name',
      modelPlaceholderZhipu: 'e.g.: glm-4-plus, glm-4-air',
      modelHintZhipu: 'Enter the Zhipu AI model name',
      modelPlaceholderMoonshot: 'e.g.: moonshot-v1-32k, moonshot-v1-128k',
      modelHintMoonshot: 'Enter the Kimi model name',
      modelPlaceholderCustom: 'e.g.: your-model-name',
      modelHintCustom: 'Enter the custom model name',
      defaultSystemPrompt: 'You are a Markdown formatting expert. Convert the text provided by the user into a well-formatted Markdown document. Preserve the original meaning, improve layout, and add appropriate headings, lists, emphasis, and other formatting. Return only the formatted Markdown text without any explanation.',
      alertFillApiKey: 'Please enter API Key',
      alertFillModel: 'Please enter model name',
      alertJsonError: 'JSON format error: {error}',
      alertJsonMissingApiKey: 'Config error: missing apiKey field'
    },

    // Subscription Page
    subscriptionPage: {
      title: 'Subscription Management',
      subtitle: 'MDSKILL Pro',
      userIdLabel: 'User ID',
      statusLabel: 'Subscription Status',
      daysLeftLabel: 'Days Remaining',
      expiryDateLabel: 'Expiry Date',
      statusTrial: 'Trial',
      statusActive: 'Active Member',
      statusExpired: 'Expired',
      daysUnit: 'days',
      featuresTitle: 'Pro Features',
      featureWechat: 'Copy to WeChat Official Account',
      featureBlog: 'Copy to Blog Platforms',
      featureHTML: 'Copy HTML Source',
      featurePDF: 'Export PDF',
      featureThemes: '13 Premium Themes',
      pricingMonthly: '¥19/month',
      pricingYearly: '¥99/year',
      pricePeriod: '/month',
      pricingNote: 'Monthly ¥19 | Yearly ¥99',
      pricingHighlight: 'Save ¥129 with yearly plan (Recommended)',
      paymentNote: 'To purchase an activation code, please contact:',
      wechatLabel: 'WeChat:',
      emailLabel: 'Email:',
      btnActivateCode: '🔑 I Have an Activation Code',
      btnLater: 'Later',
      deviceIdLabel: 'Device ID',
      lastVerifiedLabel: 'Last Verified',
      btnReset: '🔧 Reset Subscription (Test)',
      modalTitle: 'Enter Activation Code',
      modalPlaceholder: 'eyJ1-c2Vy-SWQi-...|df52-b5e6-...',
      modalCancel: 'Cancel',
      modalActivate: 'Activate',
      alertEnterCode: 'Please enter activation code',
      alertActivateSuccess: 'Activation successful!\nMembership duration: {months} months\nExpiry date: {date}',
      alertActivateFailed: 'Activation failed: {error}',
      confirmReset: 'Are you sure you want to reset the subscription? This will clear all subscription data.',
      alertResetSuccess: 'Subscription reset',
      alertResetFailed: 'Reset failed: {error}',
      unknownError: 'Unknown error',
      ipcUnavailableRequire: 'IPC communication unavailable: unable to load Electron IPC module',
      ipcUnavailableUndefined: 'IPC communication unavailable: ipcRenderer is undefined',
      loading: 'Loading...'
    },

    // Activation page
    activationPage: {
      title: 'Activate Pro - MDskill',
      headerTitle: 'Activate Pro',
      headerSubtitle: 'Unlock all advanced features',
      activatedTitle: 'Pro Activated',
      activatedSubtitle: 'All advanced features are unlocked',
      activatedDesc: 'Thanks for your support. All advanced features are unlocked.',
      activatedDeviceLabel: 'Device ID',
      activatedTimeLabel: 'Activation Time',
      licenseTypeLabel: 'License Type',
      lifetimeLicense: 'Lifetime',
      unlockedFeaturesTitle: 'Unlocked Features',
      benefitsTitle: 'Pro Benefits',
      benefitAiTitle: 'AI Text to Markdown',
      benefitAiDesc: 'Smart formatting for polished documents',
      benefitThemeTitle: '13 Beautiful Themes',
      benefitThemeDesc: 'Switch styles for different platforms',
      benefitWechatTitle: 'One-Click WeChat Copy',
      benefitWechatDesc: 'Preserve styling and paste directly',
      benefitBlogTitle: 'Blog Platform Support',
      benefitBlogDesc: 'Format for major blog platforms',
      benefitPdfTitle: 'Professional PDF Export',
      benefitPdfDesc: 'Preserve styling for printing',
      priceDesc: 'One-time purchase · Lifetime use',
      priceBadge: 'Limited-Time Offer',
      freeMember: 'Free for Andy\'s Xingjue Society members',
      deviceLabel: 'Your Device ID',
      licenseLabel: 'Enter License Key',
      licensePlaceholder: 'Paste license key\nFormat: MDSK-xxxxxxxx-xxxxxxxx',
      cancel: 'Cancel',
      activate: 'Activate',
      activating: 'Activating...',
      close: 'Close',
      noLicense: '✗ Please enter a license key',
      activateSuccess: '✓ Activation successful. Pro features are unlocked.',
      activateFailed: 'Activation failed',
      activateError: 'Activation error: {error}',
      copied: 'Copied!',
      copiedDefault: 'Copy',
      loading: 'Loading...',
      loadFailed: 'Load failed: {error}',
      activatedFallback: 'Activated',
      noLicenseQuestion: 'No license yet?',
      contactWechat: 'WeChat:',
      contactInstruction: 'Send your Device ID to the developer to get a license'
    }
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
    open: '打开文件...',
    openFile: '打开文件...',
    recentDocuments: '最近打开',
    noRecentDocuments: '暂无最近文档',
    clearRecentDocuments: '清除最近记录',
    save: '保存',
    saveAs: '另存为...',
    export: '导出',
    copyForWeChat: '复制到微信公众号',
    copyForBlog: '复制到博客平台',
    copyHTMLSource: '复制 HTML 源码',
    exportAsPDF: '导出为 PDF',
    exportPDF: '导出为 PDF',
    quit: '退出',

    // 编辑菜单
    undo: '撤销',
    redo: '重做',
    cut: '剪切',
    copy: '复制',
    paste: '粘贴',
    selectAll: '全选',
    find: '查找',
    findReplace: '查找和替换',

    // 查看菜单
    togglePreview: '切换预览',
    toggleFullscreen: '切换全屏',
    codeBlockLineNumbers: '代码块行号',
    actualSize: '实际大小',
    reload: '重新加载',
    toggleDevTools: '切换开发者工具',
    resetZoom: '实际大小',
    zoomIn: '放大',
    zoomOut: '缩小',

    // 窗口菜单
    window: '窗口',
    minimize: '最小化',
    zoom: '缩放',
    front: '全部置于顶层',

    // 帮助菜单
    about: '帮助',
    aiConfig: 'AI API 配置',
    getDeviceFingerprint: '查看设备指纹',
    contactDeveloper: '联系开发者',
    deviceFingerprintTitle: '设备指纹',
    deviceFingerprintMessage: '您的设备指纹：',
    copyButton: '复制',
    contactDeveloperTitle: '联系开发者',
    contactDeveloperMessage: 'AI酋长Andy',
    contactDeveloperDetail: '微信：AIPMAndy\nGitHub: https://github.com/AIPMAndy',
    openFileFailedTitle: '打开文件失败',
    openFileFailedMessage: '无法打开文件：{path}\n\n{error}',

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
      exportingPDF: '正在导出 PDF...',
      pdfExportSuccess: 'PDF 导出成功！\n保存位置：{path}',
      pdfExportFailed: 'PDF 导出失败：{error}',
      pdfExportError: 'PDF 导出出错：{error}'
    },

    confirmations: {
      membershipExpiring: '⏰ 会员即将到期\n\n{message}\n\n是否立即续费？',
      membershipExpired: '😢 会员已过期\n\n{message}\n\n是否立即续费？',
      viewMembershipBenefits: '{message}\n\n是否查看会员权益？'
    },

    subscriptionMessages: {
      expiring: '您的会员将在 {days} 天后到期，续费仅需 ¥19/月。',
      expired: '您的会员已过期，续费后立即恢复所有专业功能。\n\n月会员：¥19/月',
      featureLocked: '🔒 {featureName} 是会员专享功能\n\n月会员：¥19/月\n新用户享 7 天免费试用'
    },

    featureNames: {
      themes: '主题',
      premiumThemes: '精美主题',
      pdfExport: 'PDF 导出',
      wechatCopy: '复制到微信公众号',
      blogCopy: '复制到博客',
      htmlExport: '复制 HTML 源码'
    },

    activationPrompt: {
      message: '{featureName} 是专业版功能 🔒\n\n您的设备指纹：{deviceId}\n\n请联系开发者获取授权码：\n微信：AIPMAndy\n\n获取授权码后，请在“帮助”菜单中选择“激活专业版”进行激活。'
    },

    // 文档搜索面板
    docSearch: {
      tabSearch: '🔍 搜索',
      tabOutline: '📋 大纲',
      placeholder: '搜索内容...',
      emptyHint: '输入关键词开始搜索',
      emptyHintWithTip: '输入关键词开始搜索\n\n支持正则表达式，试试：\n\\b\\w{5}\\b (匹配5个字母的单词)',
      noResults: '未找到匹配项\n\n试试：\n• 检查拼写\n• 使用不同的关键词\n• 关闭"区分大小写"选项',
      prevMatch: '上一个 (Shift+Enter)',
      nextMatch: '下一个 (Enter)',
      caseSensitive: '区分大小写',
      regex: '正则表达式',
      resultsCount: '{current}/{total}',
      closeTooltip: '关闭'
    },

    // 编辑器
    editor: {
      placeholder: '开始编写你的 Markdown 文档...\n\n支持的功能：\n• 标题：# ## ###\n• 加粗：**文本**\n• 斜体：*文本*\n• 链接：[文本](url)\n• 代码：`代码` 或 ```语言\n• 列表、表格等更多功能'
    },

    // 品牌
    branding: {
      madeBy: 'AI酋长Andy出品'
    },

    // 状态栏
    status: {
      wordsChars: '{words} 个词，{chars} 个字符',
      savedSecondsAgo: '{seconds} 秒前已保存',
      savedMinutesAgo: '{minutes} 分钟前已保存',
      notSaved: '未保存'
    },

    // AI 进度提示
    aiProgress: {
      formatting: 'Andy 正在帮你转成 Markdown...',
      cancel: '取消'
    },

    // 查找和替换弹窗
    findReplaceModal: {
      title: '查找和替换',
      findLabel: '查找',
      findPlaceholder: '输入查找内容',
      previous: '上一个 (Shift+Enter)',
      next: '下一个 (Enter)',
      caseSensitive: '区分大小写',
      wholeWord: '全字匹配',
      regex: '正则表达式',
      replaceLabel: '替换为',
      replacePlaceholder: '输入替换内容',
      replace: '替换',
      replaceAll: '全部替换',
      noMatches: '无匹配',
      replacedOne: '已替换 1 处',
      replacedMany: '已替换 {count} 处',
      close: '关闭'
    },

    // 命令面板
    commandPalette: {
      placeholder: '输入关键词搜索文件和命令...',
      noResults: '未找到结果',
      commands: '命令',
      recentFiles: '最近文件',
      newWindowTitle: '新建窗口',
      newWindowSubtitle: '创建新的编辑器窗口',
      openFileTitle: '打开文件',
      openFileSubtitle: '打开 Markdown 文件',
      saveFileTitle: '保存文件',
      saveFileSubtitle: '保存当前文件',
      changeThemeTitle: '切换主题',
      changeThemeSubtitle: '打开主题选择器',
      searchTitle: '搜索文档',
      searchSubtitle: '在当前文档中查找文本',
      exportPdfTitle: '导出 PDF',
      exportPdfSubtitle: '将当前文档导出为 PDF',
      openFileFailed: '打开文件失败：{error}'
    },

    // 侧边栏
    sidebar: {
      openFolder: '打开文件夹',
      searchPlaceholder: '搜索文件...',
      recentOpen: '最近打开',
      noRecentFiles: '暂无最近文件',
      currentFolder: '当前文件夹',
      noFolder: '未打开文件夹',
      openFolderFirst: '请先打开一个文件夹',
      noMarkdownFiles: '此文件夹中没有 Markdown 文件',
      noMatchingFiles: '未找到匹配的文件'
    },

    // 帮助页面
    helpPage: {
      title: '帮助 - MDSKILL',
      appName: 'MDSKILL',
      appTagline: '专业的 Markdown 编辑与排版工具',

      // 标签
      tabFeatures: '功能介绍',
      tabShortcuts: '快捷键',
      tabFaq: '常见问题',
      tabAbout: '关于',

      // 功能
      featureWechatTitle: '公众号复制',
      featureWechatDesc: '保留样式，直接粘贴',
      featureBlogTitle: '博客适配',
      featureBlogDesc: '支持主流博客平台',
      featureThemesTitle: '精美主题',
      featureThemesDesc: '13种专业主题',
      featurePdfTitle: 'PDF导出',
      featurePdfDesc: '完美保留排版',
      featureHtmlTitle: 'HTML源码',
      featureHtmlDesc: '一键复制源码',
      featurePreviewTitle: '实时预览',
      featurePreviewDesc: '所见即所得',

      sectionEditingTitle: '编辑功能',
      editMarkdownTitle: 'Markdown 编辑',
      editMarkdownDesc: '支持标准 Markdown 语法',
      editPreviewTitle: '实时预览',
      editPreviewDesc: '编辑与预览同步更新',
      editHighlightTitle: '语法高亮',
      editHighlightDesc: '代码块语法高亮显示',

      sectionExportTitle: '导出功能',
      exportWechatTitle: '微信公众号',
      exportWechatDesc: '一键复制到公众号编辑器',
      exportBlogTitle: '博客平台',
      exportBlogDesc: '适配掘金、知乎、CSDN等',
      exportPdfTitle: 'PDF 导出',
      exportPdfDesc: '专业排版，适合打印',

      // 快捷键
      sectionFileTitle: '文件操作',
      shortcutNew: '新建文件',
      shortcutOpen: '打开文件',
      shortcutSave: '保存文件',

      sectionEditTitle: '编辑操作',
      shortcutUndo: '撤销',
      shortcutRedo: '重做',
      shortcutFind: '查找',
      shortcutReplace: '替换',

      sectionFormatTitle: '格式化',
      shortcutBold: '粗体',
      shortcutItalic: '斜体',
      shortcutLink: '插入链接',

      // 常见问题
      faqCopyWechatQ: '如何复制到微信公众号？',
      faqCopyWechatA: '点击工具栏的"复制到微信公众号"按钮，然后在公众号编辑器中粘贴即可',
      faqThemeQ: '如何切换主题？',
      faqThemeA: '点击工具栏的主题选择器，选择您喜欢的主题',
      faqPdfQ: '如何导出PDF？',
      faqPdfA: '点击工具栏的"导出PDF"按钮，选择保存位置即可',
      faqBlogQ: '支持哪些博客平台？',
      faqBlogA: '支持掘金、知乎、CSDN、简书等主流博客平台',
      faqActivateQ: '如何激活专业版？',
      faqActivateA: '点击菜单栏"帮助" → "订阅管理"，输入激活码即可。购买激活码请联系：微信 AIPMAndy 或邮箱 supera6@qq.com',
      faqTrialQ: '试用期有多长？',
      faqTrialA: '新用户可享受7天免费试用，试用期内可使用所有专业功能',

      // 关于
      aboutVersion: '版本',
      aboutDescription: '专业的 Markdown 编辑与排版工具\n让文档编辑更高效，排版更精美',
      aboutWebsite: '官方网站',
      aboutGithub: 'GitHub',
      aboutFeedback: '反馈问题',
      aboutFooter: '© 2026 MDSKILL. All rights reserved.\n联系方式：微信 AIPMAndy | 邮箱 supera6@qq.com'
    },

    // Toast 消息
    toast: {
      editorEmpty: '编辑器内容为空',
      copyWechatSuccess: '已复制到剪贴板，可直接粘贴到微信公众号编辑器',
      copyWechatSuccessWithTheme: '已使用「{theme}」主题复制到微信',
      copyBlogSuccess: '已复制到剪贴板，可粘贴到知乎、简书等博客平台',
      copyHtmlSuccess: 'HTML 源码已复制到剪贴板',
      copyFailed: '复制失败，请重试',
      copyFailedError: '复制失败: {error}',
      themeProOnly: '此主题需要专业版授权 🔒',
      themeProOnlyTrial: '🔒 这是专业版主题\n\n您的试用期还剩 {days} 天',
      themeProOnlyExpired: '🔒 这是专业版主题\n\n您的试用期已结束，请升级专业版',
      themeSwitched: '已切换到「{name}」主题 ✨',
      trialReminder: '⏰ 试用期还剩 {days} 天\n\n立即升级以继续使用专业功能',
      trialExpired: '⏰ 您的试用期已结束\n\n升级专业版以继续使用高级功能',
      uploadingImage: '正在上传图片...',
      imageUploaded: '图片上传成功',
      imageUploadFailed: '图片上传失败: {error}'
    },

    // Alert/错误消息
    alerts: {
      initFailed: '应用初始化失败: {error}',
      aiFormatFailed: 'AI 格式化失败: {error}',
      copyModuleNotLoaded: '复制功能模块未加载，请刷新页面重试',
      wechatRendererNotLoaded: '微信渲染器未加载，请刷新页面重试'
    },

    // 主题选择器
    themeSelector: {
      title: '选择主题',
      categoryAll: '全部',
      categoryFree: '免费主题',
      categoryPro: '专业版主题'
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
    pleaseWait: '请稍候...',

    // 欢迎弹窗
    welcome: {
      title: '欢迎使用 MDskill',
      subtitle: '专业 Markdown 编辑器',
      feature1Title: '精美主题',
      feature1Desc: '13+ 专业主题，适配各大平台',
      feature2Title: '一键导出',
      feature2Desc: '微信、Medium、Dev.to 等平台',
      feature3Title: '专业 PDF',
      feature3Desc: '高质量 PDF，自动生成目录',
      feature4Title: 'AI 排版',
      feature4Desc: '将杂乱文本转换为精美 Markdown',
      loadSample: '加载示例文档',
      startBlank: '从空白开始',
      dontShowAgain: '不再显示',
      sampleDocument: `# 欢迎使用 MDskill ✨

## MDskill 是什么？

MDskill 是为内容创作者、技术写作者和博主设计的**专业 Markdown 编辑器**。

### 核心功能

- 🎨 **13+ 精美主题** - 完美适配微信公众号、博客等平台
- 🚀 **一键导出** - 快速复制到微信、Medium、Dev.to
- 📄 **专业 PDF** - 高质量输出，自动生成目录
- 🤖 **AI 排版** - 将混乱笔记转换为结构化文档

### 快速开始

1. **编写** - 使用 Markdown 语法输入内容
2. **美化** - 点击主题选择器选择主题
3. **导出** - 使用工具栏按钮复制或导出

### 常用 Markdown 语法

\`\`\`markdown
# 一级标题
## 二级标题
### 三级标题

**粗体文本**
*斜体文本*

- 列表项 1
- 列表项 2

[链接文本](https://example.com)

![图片](image-url.jpg)
\`\`\`

### 需要帮助？

- 按 \`Cmd+F\` 搜索文档
- 点击 **帮助 → 使用指南** 查看教程
- 联系我们：微信 AIPMAndy | supera6@qq.com

---

**准备好了吗？**删除此文本，开始创作！🚀`
    },

    // 微信预览模态框
    wechatPreview: {
      title: '复制前预览',
      cancel: '取消',
      copyToWechat: '复制到微信'
    },

    // AI 配置页面
    aiConfigPage: {
      title: 'AI API 配置',
      description: '配置 AI API 后，可以一键将文本转换为格式化的 Markdown',
      warningTitle: '需要您自己的 API Key',
      warningText: '此功能需要您提供自己的 AI 服务 API Key。API Key 将安全存储在本地，不会上传到任何服务器。\n\n推荐使用 DeepSeek：国内访问快，价格便宜（约 ¥0.001/千字），效果优秀。',
      getDeepSeekKey: '→ 获取 DeepSeek API Key',
      tabUI: '界面配置',
      tabJSON: 'JSON 配置',
      providerLabel: 'AI 服务商',
      providerPlaceholder: '请选择服务商',
      providerOpenAI: 'OpenAI',
      providerAnthropic: 'Anthropic',
      providerDeepSeek: 'DeepSeek (国内)',
      providerZhipu: '智谱 AI',
      providerMoonshot: '月之暗面',
      providerCustom: '自定义 API',
      apiKeyLabel: 'API Key',
      apiKeyPlaceholder: 'sk-...',
      apiKeyHint: '您的 API Key 将安全存储在本地',
      modelLabel: '模型名称',
      modelPlaceholder: '例如: gpt-4o',
      modelHint: '请填写模型的完整名称',
      endpointLabel: 'API 端点',
      endpointPlaceholder: 'https://api.example.com/v1/chat/completions',
      cancel: '取消',
      saveAndConvert: '保存并转换',
      jsonConfigLabel: 'JSON 配置',
      jsonConfigPlaceholder: '示例配置：\n{\n  "provider": "deepseek",\n  "apiKey": "sk-xxx",\n  "model": "deepseek-chat",\n  "endpoint": "https://api.deepseek.com/v1/chat/completions",\n  "temperature": 0.3,\n  "maxTokens": 4096,\n  "systemPrompt": "你是一个 Markdown 格式化专家...",\n  "customHeaders": {}\n}',
      jsonConfigHint: '支持自定义所有参数，包括 headers、temperature 等',
      saveJSON: '保存并转换',
      cancelJSON: '取消',
      providerInfoOpenAI: '获取 API Key: <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform</a>',
      providerInfoAnthropic: '获取 API Key: <a href="https://console.anthropic.com/settings/keys" target="_blank">Anthropic Console</a>',
      providerInfoDeepSeek: '获取 API Key: <a href="https://platform.deepseek.com/api_keys" target="_blank">DeepSeek 平台</a><br>国内访问，价格低廉，性能优秀',
      providerInfoZhipu: '获取 API Key: <a href="https://open.bigmodel.cn/usercenter/apikeys" target="_blank">智谱 AI 开放平台</a><br>国内访问，支持长文本',
      providerInfoMoonshot: '获取 API Key: <a href="https://platform.moonshot.cn/console/api-keys" target="_blank">月之暗面平台</a><br>国内访问，超长上下文',
      modelPlaceholderOpenAI: '例如: gpt-4o, gpt-4o-mini, o1',
      modelHintOpenAI: '请填写 OpenAI 模型名称',
      modelPlaceholderAnthropic: '例如: claude-opus-4-20250514',
      modelHintAnthropic: '请填写 Claude 模型名称',
      modelPlaceholderDeepSeek: '例如: deepseek-chat, deepseek-reasoner',
      modelHintDeepSeek: '请填写 DeepSeek 模型名称',
      modelPlaceholderZhipu: '例如: glm-4-plus, glm-4-air',
      modelHintZhipu: '请填写智谱 AI 模型名称',
      modelPlaceholderMoonshot: '例如: moonshot-v1-32k, moonshot-v1-128k',
      modelHintMoonshot: '请填写 Kimi 模型名称',
      modelPlaceholderCustom: '例如: your-model-name',
      modelHintCustom: '请填写自定义模型名称',
      defaultSystemPrompt: '你是一个 Markdown 格式化专家。将用户提供的文本转换为格式良好的 Markdown 文档。保持原意，优化排版，添加适当的标题、列表、强调等格式。只返回格式化后的 Markdown 文本，不要添加任何解释。',
      alertFillApiKey: '请填写 API Key',
      alertFillModel: '请填写模型名称',
      alertJsonError: 'JSON 格式错误：{error}',
      alertJsonMissingApiKey: '配置错误：缺少 apiKey 字段'
    },

    // 订阅页面
    subscriptionPage: {
      title: '订阅管理',
      subtitle: 'MDSKILL 专业版',
      userIdLabel: '用户ID',
      statusLabel: '订阅状态',
      daysLeftLabel: '剩余时间',
      expiryDateLabel: '到期日期',
      statusTrial: '试用期',
      statusActive: '付费会员',
      statusExpired: '已过期',
      daysUnit: '天',
      featuresTitle: '专业功能',
      featureWechat: '复制到微信公众号',
      featureBlog: '复制到博客平台',
      featureHTML: '复制HTML源码',
      featurePDF: '导出PDF',
      featureThemes: '13种精美主题',
      pricingMonthly: '¥19/月',
      pricingYearly: '¥99/年',
      pricePeriod: '/月起',
      pricingNote: '月付 ¥19 | 年付 ¥99',
      pricingHighlight: '年付节省 ¥129（推荐）',
      paymentNote: '如需购买激活码，请通过以下方式联系：',
      wechatLabel: '微信：',
      emailLabel: '邮箱：',
      btnActivateCode: '🔑 我有激活码',
      btnLater: '稍后',
      deviceIdLabel: '设备ID',
      lastVerifiedLabel: '最后验证',
      btnReset: '🔧 重置订阅（测试用）',
      modalTitle: '输入激活码',
      modalPlaceholder: 'eyJ1-c2Vy-SWQi-...|df52-b5e6-...',
      modalCancel: '取消',
      modalActivate: '激活',
      alertEnterCode: '请输入激活码',
      alertActivateSuccess: '激活成功！\n会员时长：{months} 个月\n到期日期：{date}',
      alertActivateFailed: '激活失败：{error}',
      confirmReset: '确定要重置订阅吗？这将清除所有订阅数据。',
      alertResetSuccess: '订阅已重置',
      alertResetFailed: '重置失败：{error}',
      unknownError: '未知错误',
      ipcUnavailableRequire: 'IPC 通信不可用：无法加载 Electron IPC 模块',
      ipcUnavailableUndefined: 'IPC 通信不可用：ipcRenderer 未定义',
      loading: '加载中...'
    },

    // 激活页面
    activationPage: {
      title: '激活专业版 - MDskill',
      headerTitle: '激活专业版',
      headerSubtitle: '解锁所有高级功能',
      activatedTitle: '专业版已激活',
      activatedSubtitle: '所有高级功能已解锁',
      activatedDesc: '感谢您的支持！所有高级功能已解锁',
      activatedDeviceLabel: '设备指纹',
      activatedTimeLabel: '激活时间',
      licenseTypeLabel: '授权类型',
      lifetimeLicense: '终身使用',
      unlockedFeaturesTitle: '已解锁功能',
      benefitsTitle: '专业版权益',
      benefitAiTitle: 'AI 文本转 Markdown',
      benefitAiDesc: '智能格式化，一键美化文档',
      benefitThemeTitle: '13 种精美主题',
      benefitThemeDesc: '多样化风格，随心切换',
      benefitWechatTitle: '公众号一键复制',
      benefitWechatDesc: '保留样式，直接粘贴发布',
      benefitBlogTitle: '博客平台适配',
      benefitBlogDesc: '支持主流博客平台格式',
      benefitPdfTitle: 'PDF 专业导出',
      benefitPdfDesc: '完美保留样式，适合打印',
      priceDesc: '买断制 · 终身使用',
      priceBadge: '限时优惠',
      freeMember: 'Andy 所创办的醒觉社成员免费',
      deviceLabel: '您的设备指纹',
      licenseLabel: '输入授权码',
      licensePlaceholder: '粘贴授权码内容\n格式: MDSK-xxxxxxxx-xxxxxxxx',
      cancel: '取消',
      activate: '激活',
      activating: '激活中...',
      close: '关闭',
      noLicense: '✗ 请输入授权码',
      activateSuccess: '✓ 激活成功！专业版功能已解锁',
      activateFailed: '激活失败',
      activateError: '激活出错：{error}',
      copied: '已复制！',
      copiedDefault: '复制',
      loading: '加载中...',
      loadFailed: '加载失败：{error}',
      activatedFallback: '已激活',
      noLicenseQuestion: '还没有授权？',
      contactWechat: '微信：',
      contactInstruction: '将设备指纹发送给开发者获取授权'
    }
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
