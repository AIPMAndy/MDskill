const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const Store = require('electron-store');
const licenseManager = require('./license-manager');
const { subscriptionManager, SubscriptionStatus } = require('./subscription-manager');

const store = new Store();

let windows = []; // 存储所有窗口
let pendingFilePath = null; // 缓存 app ready 前的文件路径
let currentLanguage = store.get('language', 'en'); // 默认英文

// 菜单文本国际化
const menuTexts = {
  en: {
    file: 'File',
    newWindow: 'New Window',
    open: 'Open',
    save: 'Save',
    saveAs: 'Save As',
    export: 'Export',
    copyForWeChat: 'Copy for WeChat',
    copyForBlog: 'Copy for Blog',
    copyHTMLSource: 'Copy HTML Source',
    exportAsPDF: 'Export as PDF',
    close: 'Close',
    quit: 'Quit',
    edit: 'Edit',
    undo: 'Undo',
    redo: 'Redo',
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    selectAll: 'Select All',
    view: 'View',
    togglePreview: 'Toggle Preview',
    reload: 'Reload',
    toggleDevTools: 'Toggle Developer Tools',
    resetZoom: 'Actual Size',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    toggleFullscreen: 'Toggle Full Screen',
    window: 'Window',
    minimize: 'Minimize',
    zoom: 'Zoom',
    front: 'Bring All to Front',
    help: 'Help',
    about: 'About MDskill',
    activatePro: 'Activate Pro Version',
    getDeviceFingerprint: 'Get Device Fingerprint',
    contactDeveloper: 'Contact Developer',
    language: 'Language',
    switchToEnglish: 'English',
    switchToChinese: '中文',
    aiConfig: 'AI Configuration'
  },
  zh: {
    file: '文件',
    newWindow: '新建窗口',
    open: '打开',
    save: '保存',
    saveAs: '另存为',
    export: '导出',
    copyForWeChat: '复制到微信公众号',
    copyForBlog: '复制到博客',
    copyHTMLSource: '复制 HTML 源码',
    exportAsPDF: '导出为 PDF',
    close: '关闭',
    quit: '退出',
    edit: '编辑',
    undo: '撤销',
    redo: '重做',
    cut: '剪切',
    copy: '复制',
    paste: '粘贴',
    selectAll: '全选',
    view: '视图',
    togglePreview: '切换预览',
    reload: '重新加载',
    toggleDevTools: '切换开发者工具',
    resetZoom: '实际大小',
    zoomIn: '放大',
    zoomOut: '缩小',
    toggleFullscreen: '切换全屏',
    window: '窗口',
    minimize: '最小化',
    zoom: '缩放',
    front: '前置所有窗口',
    help: '帮助',
    about: '关于 MDskill',
    activatePro: '激活专业版',
    getDeviceFingerprint: '获取设备指纹',
    contactDeveloper: '联系开发者',
    language: '语言',
    switchToEnglish: 'English',
    switchToChinese: '中文',
    aiConfig: 'AI 配置'
  }
};

// 获取当前语言的文本
function t(key) {
  return menuTexts[currentLanguage][key] || key;
}

// 切换语言
function switchLanguage(lang) {
  currentLanguage = lang;
  store.set('language', lang);
  // 重建所有窗口的菜单
  windows.forEach(win => {
    if (win && !win.isDestroyed()) {
      buildMenu(win);
    }
  });
}

// 构建菜单
function buildMenu(win) {
  console.log('Building menu with language:', currentLanguage);
  const template = [
    {
      label: t('file'),
      submenu: [
        {
          label: t('newWindow'),
          accelerator: 'CmdOrCtrl+N',
          click: () => createWindow()
        },
        {
          label: t('open'),
          accelerator: 'CmdOrCtrl+O',
          click: () => openFile(BrowserWindow.getFocusedWindow())
        },
        {
          label: t('save'),
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('file-save');
            }
          }
        },
        {
          label: t('saveAs'),
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('file-save-as');
            }
          }
        },
        { type: 'separator' },
        {
          label: t('export'),
          submenu: [
            {
              label: t('copyForWeChat'),
              accelerator: 'CmdOrCtrl+Shift+W',
              click: () => {
                const focusedWindow = BrowserWindow.getFocusedWindow();
                if (focusedWindow) {
                  focusedWindow.webContents.send('copy-wechat');
                }
              }
            },
            {
              label: t('copyForBlog'),
              accelerator: 'CmdOrCtrl+Shift+B',
              click: () => {
                const focusedWindow = BrowserWindow.getFocusedWindow();
                if (focusedWindow) {
                  focusedWindow.webContents.send('copy-blog');
                }
              }
            },
            {
              label: t('copyHTMLSource'),
              accelerator: 'CmdOrCtrl+Shift+H',
              click: () => {
                const focusedWindow = BrowserWindow.getFocusedWindow();
                if (focusedWindow) {
                  focusedWindow.webContents.send('copy-html');
                }
              }
            },
            { type: 'separator' },
            {
              label: t('exportAsPDF'),
              accelerator: 'CmdOrCtrl+E',
              click: () => {
                const focusedWindow = BrowserWindow.getFocusedWindow();
                if (focusedWindow) {
                  focusedWindow.webContents.send('export-pdf');
                }
              }
            }
          ]
        },
        { type: 'separator' },
        { role: 'close', label: t('close') },
        { role: 'quit', label: t('quit') }
      ]
    },
    {
      label: t('edit'),
      submenu: [
        { role: 'undo', label: t('undo') },
        { role: 'redo', label: t('redo') },
        { type: 'separator' },
        { role: 'cut', label: t('cut') },
        { role: 'copy', label: t('copy') },
        { role: 'paste', label: t('paste') },
        { role: 'selectAll', label: t('selectAll') }
      ]
    },
    {
      label: t('view'),
      submenu: [
        {
          label: t('togglePreview'),
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('toggle-preview');
            }
          }
        },
        { type: 'separator' },
        { role: 'reload', label: t('reload') },
        { role: 'toggleDevTools', label: t('toggleDevTools') },
        { type: 'separator' },
        { role: 'resetZoom', label: t('resetZoom') },
        { role: 'zoomIn', label: t('zoomIn') },
        { role: 'zoomOut', label: t('zoomOut') },
        { type: 'separator' },
        { role: 'togglefullscreen', label: t('toggleFullscreen') }
      ]
    },
    {
      label: t('window'),
      submenu: [
        { role: 'minimize', label: t('minimize') },
        { role: 'zoom', label: t('zoom') },
        { type: 'separator' },
        { role: 'front', label: t('front') }
      ]
    },
    {
      label: t('help'),
      submenu: [
        {
          label: t('about'),
          click: () => {
            showHelpDialog();
          }
        },
        { type: 'separator' },
        {
          label: t('aiConfig'),
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            showAIConfigDialog();
          }
        },
        { type: 'separator' },
        {
          label: t('activatePro'),
          click: () => {
            showSubscriptionDialog();
          }
        },
        {
          label: t('getDeviceFingerprint'),
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              const fingerprint = licenseManager.getDeviceFingerprint();
              dialog.showMessageBox(focusedWindow, {
                type: 'info',
                title: '设备指纹',
                message: '您的设备指纹：',
                detail: fingerprint,
                buttons: ['复制', '关闭']
              }).then(result => {
                if (result.response === 0) {
                  // 复制到剪贴板
                  const { clipboard } = require('electron');
                  clipboard.writeText(fingerprint);
                }
              });
            }
          }
        },
        { type: 'separator' },
        {
          label: t('contactDeveloper'),
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              dialog.showMessageBox(focusedWindow, {
                type: 'info',
                title: '联系开发者',
                message: 'AI酋长Andy',
                detail: '微信：AIPMAndy\nGitHub: https://github.com/AIPMAndy',
                buttons: ['关闭']
              });
            }
          }
        },
        { type: 'separator' },
        {
          label: t('language'),
          submenu: [
            {
              label: t('switchToEnglish'),
              type: 'radio',
              checked: currentLanguage === 'en',
              click: () => switchLanguage('en')
            },
            {
              label: t('switchToChinese'),
              type: 'radio',
              checked: currentLanguage === 'zh',
              click: () => switchLanguage('zh')
            }
          ]
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  console.log('Menu built successfully');
}

function createWindow(filePath = null) {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1e1e1e',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  windows.push(win);

  win.loadFile('renderer/index.html');

  // 窗口关闭时从数组中移除
  win.on('closed', () => {
    const index = windows.indexOf(win);
    if (index > -1) {
      windows.splice(index, 1);
    }
  });

  // 如果指定了文件路径，等待窗口加载完成后打开文件
  if (filePath) {
    win.webContents.on('did-finish-load', async () => {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        win.webContents.send('file-opened', { path: filePath, content });
        store.set('lastOpenedFile', filePath);
      } catch (error) {
        console.error('Failed to open file:', error);
      }
    });
  }

  // 构建菜单
  buildMenu(win);

  return win;
}

// 打开 AI 配置窗口
function showAIConfigDialog() {
  const aiConfigWin = new BrowserWindow({
    width: 600,
    height: 650,
    center: true,
    modal: false,
    show: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    title: 'AI API 配置',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  aiConfigWin.loadFile('renderer/ai-config.html');

  aiConfigWin.once('ready-to-show', () => {
    aiConfigWin.show();
  });

  return aiConfigWin;
}

// 显示订阅管理窗口
function showSubscriptionDialog() {
  const subscriptionWin = new BrowserWindow({
    width: 600,
    height: 800,
    center: true,
    modal: false,
    show: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    title: '订阅管理',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  subscriptionWin.loadFile('renderer/subscription.html');

  subscriptionWin.once('ready-to-show', () => {
    subscriptionWin.show();
  });

  return subscriptionWin;
}


// 显示激活对话框
async function showActivationDialog() {
  const focusedWindow = BrowserWindow.getFocusedWindow();

  // 创建激活窗口
  const activationWin = new BrowserWindow({
    width: 600,
    height: 750,
    center: true,
    parent: focusedWindow,
    modal: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // 加载激活页面
  activationWin.loadFile('renderer/activation-premium.html');

  // 页面加载完成后再显示，避免闪烁
  activationWin.once('ready-to-show', () => {
    activationWin.show();
  });

  // 移除菜单栏
  activationWin.setMenu(null);
}

// 显示帮助对话框
async function showHelpDialog() {
  const focusedWindow = BrowserWindow.getFocusedWindow();

  // 创建帮助窗口
  const helpWin = new BrowserWindow({
    width: 900,
    height: 700,
    center: true,
    parent: focusedWindow,
    modal: false,
    resizable: true,
    minimizable: true,
    maximizable: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // 加载帮助页面
  helpWin.loadFile('renderer/help.html');

  // 页面加载完成后再显示，避免闪烁
  helpWin.once('ready-to-show', () => {
    helpWin.show();
  });

  // 移除菜单栏
  helpWin.setMenu(null);
}

async function openFile(targetWindow) {
  const win = targetWindow || BrowserWindow.getFocusedWindow();
  const result = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown', 'txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const content = await fs.readFile(filePath, 'utf-8');
    win.webContents.send('file-opened', { path: filePath, content });
    store.set('lastOpenedFile', filePath);
  }
}

// IPC 处理
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-file', async (event, { filePath, content }) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    store.set('lastOpenedFile', filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-file-as', async (event, content) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  // 生成智能默认文件名
  let defaultFileName = 'Untitled.md';

  // 尝试从内容中提取第一个标题作为文件名
  if (content && content.trim()) {
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      // 匹配 Markdown 标题 (# 标题)
      const match = trimmedLine.match(/^#{1,6}\s+(.+)$/);
      if (match) {
        let title = match[1].trim();
        // 清理文件名：移除特殊字符
        title = title
          .replace(/[<>:"/\\|?*]/g, '') // 移除不允许的字符
          .replace(/\s+/g, '-') // 空格替换为连字符
          .substring(0, 100); // 限制长度

        if (title) {
          defaultFileName = `${title}.md`;
          break;
        }
      }
    }

    // 如果没有找到标题，使用第一个非空行的前几个字
    if (defaultFileName === 'Untitled.md') {
      const firstLine = lines.find(l => l.trim());
      if (firstLine) {
        let title = firstLine.trim()
          .replace(/^[#\s*\->]+/, '') // 移除 Markdown 符号
          .replace(/[<>:"/\\|?*]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 50);

        if (title) {
          defaultFileName = `${title}.md`;
        }
      }
    }
  }

  const result = await dialog.showSaveDialog(win, {
    defaultPath: defaultFileName,
    filters: [
      { name: 'Markdown', extensions: ['md'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePath) {
    try {
      await fs.writeFile(result.filePath, content, 'utf-8');
      store.set('lastOpenedFile', result.filePath);
      return { success: true, filePath: result.filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  return { success: false, canceled: true };
});

ipcMain.handle('get-last-file', () => {
  return store.get('lastOpenedFile');
});

ipcMain.handle('export-pdf', async (event, { defaultPath, htmlContent }) => {
  console.log('PDF export handler called with defaultPath:', defaultPath);
  const win = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showSaveDialog(win, {
    defaultPath: defaultPath,
    filters: [
      { name: 'PDF', extensions: ['pdf'] }
    ]
  });

  console.log('Save dialog result:', result);

  if (!result.canceled && result.filePath) {
    try {
      console.log('Starting PDF generation...');

      // 创建一个隐藏的打印窗口
      const printWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      });

      // 加载 HTML 内容
      await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

      // 等待内容完全加载
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 使用优化的 printToPDF 配置
      const data = await printWindow.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4',
        landscape: false,
        margins: {
          top: 0.5,    // 0.5cm 上边距
          bottom: 0.5, // 0.5cm 下边距
          left: 1.0,   // 1.0cm 左边距
          right: 1.0   // 1.0cm 右边距
        },
        preferCSSPageSize: true,
        printSelectionOnly: false,
        displayHeaderFooter: false,
        scale: 1.0
      });

      console.log('PDF data generated, size:', data.length, 'bytes');

      // 关闭打印窗口
      printWindow.close();

      await fs.writeFile(result.filePath, data);
      console.log('PDF file written successfully to:', result.filePath);
      return { success: true, filePath: result.filePath };
    } catch (error) {
      console.error('Error generating PDF:', error);
      return { success: false, error: error.message };
    }
  }
  return { success: false, canceled: true };
});

// 检查授权状态
ipcMain.handle('check-license', () => {
  return licenseManager.isPro();
});

// 激活授权码
ipcMain.handle('activate-license', async (event, licenseKey) => {
  const result = licenseManager.activateLicense(licenseKey);
  return result;
});

// 获取设备指纹
ipcMain.handle('get-device-fingerprint', () => {
  return licenseManager.getDeviceFingerprint();
});

// 获取授权信息
ipcMain.handle('get-license-info', () => {
  return licenseManager.getLicenseInfo();
});

// AI 配置相关
ipcMain.handle('get-ai-config', () => {
  return store.get('aiConfig');
});

ipcMain.handle('save-ai-config', (event, config) => {
  store.set('aiConfig', config);
  return { success: true };
});

// ============================================================================
// 订阅管理 IPC 处理器
// ============================================================================

// 获取订阅状态
ipcMain.handle('get-subscription-status', async () => {
  try {
    // 如果没有订阅，自动开通试用
    if (!subscriptionManager.subscription) {
      await subscriptionManager.startTrial();
    }

    // 检查是否需要在线验证
    if (subscriptionManager.needsVerification()) {
      await subscriptionManager.verifyOnline();
    }

    return {
      success: true,
      data: subscriptionManager.getStatusSummary()
    };
  } catch (error) {
    console.error('[IPC] Get subscription status error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// 获取订阅信息（用于订阅管理窗口）
ipcMain.handle('get-subscription-info', async () => {
  try {
    // 如果没有订阅，自动开通试用
    if (!subscriptionManager.subscription) {
      await subscriptionManager.startTrial();
    }

    return {
      success: true,
      data: subscriptionManager.getStatusSummary()
    };
  } catch (error) {
    console.error('[IPC] Get subscription info error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// 检查功能权限
ipcMain.handle('check-feature-access', (event, featureName) => {
  const hasAccess = subscriptionManager.hasFeatureAccess(featureName);
  return {
    hasAccess,
    status: subscriptionManager.getStatusSummary()
  };
});

// 检查是否需要显示续费提醒
ipcMain.handle('should-show-renewal-reminder', () => {
  return subscriptionManager.shouldShowRenewalReminder();
});

// 标记续费提醒已显示
ipcMain.handle('mark-reminder-shown', () => {
  subscriptionManager.markReminderShown();
  return { success: true };
});

// 激活订阅（支付成功后调用）
ipcMain.handle('activate-subscription', async (event, months = 1) => {
  try {
    await subscriptionManager.activateSubscription(months);
    return {
      success: true,
      data: subscriptionManager.getStatusSummary()
    };
  } catch (error) {
    console.error('[IPC] Activate subscription error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// 使用激活码激活订阅
ipcMain.handle('activate-with-code', async (event, activationCode) => {
  try {
    const result = await subscriptionManager.activateWithCode(activationCode);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('[IPC] Activate with code error:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// 重置订阅（仅用于开发测试）
ipcMain.handle('reset-subscription', () => {
  subscriptionManager.resetSubscription();
  return { success: true };
});

// 打开订阅管理窗口
ipcMain.on('open-subscription', () => {
  showSubscriptionDialog();
});

// ============================================================================

ipcMain.on('close-ai-config', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.close();
});

ipcMain.on('ai-config-saved', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.close();
  // 通知主窗口配置已保存，可以开始格式化
  const mainWin = windows[0];
  if (mainWin) {
    mainWin.webContents.send('start-ai-format');
  }
});

ipcMain.on('open-ai-config', () => {
  showAIConfigDialog();
});

// 监听渲染进程的打开文件请求
ipcMain.on('file-open', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  openFile(win);
});

// 监听渲染进程的新建窗口请求
ipcMain.on('new-window', () => {
  createWindow();
});

// ============================================================================
// 文件夹管理 IPC 处理器
// ============================================================================

// 打开文件夹对话框
ipcMain.handle('open-folder-dialog', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (result.canceled) {
    return null;
  }

  const folderPath = result.filePaths[0];
  const files = await getMarkdownFiles(folderPath);

  return {
    folderPath,
    files
  };
});

// 获取文件夹中的 Markdown 文件
async function getMarkdownFiles(folderPath) {
  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      const fullPath = path.join(folderPath, entry.name);

      if (entry.isDirectory()) {
        // 只显示文件夹，不递归
        files.push({
          name: entry.name,
          path: fullPath,
          type: 'folder'
        });
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.markdown'))) {
        files.push({
          name: entry.name,
          path: fullPath,
          type: 'file'
        });
      }
    }

    // 排序：文件夹在前，然后按名称排序
    files.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'folder' ? -1 : 1;
    });

    return files;
  } catch (error) {
    console.error('Error reading folder:', error);
    return [];
  }
}

// 从侧边栏打开文件
ipcMain.on('open-file-from-sidebar', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const win = BrowserWindow.fromWebContents(event.sender);

    if (win) {
      win.webContents.send('file-loaded', {
        filePath,
        content
      });
      win.webContents.send('file-switched', filePath);
    }
  } catch (error) {
    console.error('Error opening file from sidebar:', error);
  }
});

// 从侧边栏打开文件夹
ipcMain.on('open-folder-from-sidebar', async (event, folderPath) => {
  try {
    const files = await getMarkdownFiles(folderPath);
    const win = BrowserWindow.fromWebContents(event.sender);

    if (win) {
      win.webContents.send('folder-opened', {
        folderPath,
        files
      });
    }
  } catch (error) {
    console.error('Error opening folder from sidebar:', error);
  }
});

// 重新加载文件夹
ipcMain.on('reload-folder', async (event, folderPath) => {
  try {
    const files = await getMarkdownFiles(folderPath);
    const win = BrowserWindow.fromWebContents(event.sender);

    if (win) {
      win.webContents.send('folder-opened', {
        folderPath,
        files
      });
    }
  } catch (error) {
    console.error('Error reloading folder:', error);
  }
});

// 全文搜索
ipcMain.handle('search-content', async (event, { folderPath, query }) => {
  try {
    const results = [];
    const files = await getMarkdownFiles(folderPath);

    for (const file of files) {
      if (file.type !== 'file') continue;

      try {
        const content = await fs.readFile(file.path, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              path: file.path,
              name: file.name,
              line: line.trim(),
              lineNumber: index + 1
            });
          }
        });
      } catch (err) {
        console.error(`Error reading file ${file.path}:`, err);
      }
    }

    // 限制结果数量
    return results.slice(0, 50);
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
});

// ============================================================================

// 处理通过 Finder 打开文件（macOS）
app.on('open-file', (event, filePath) => {
  event.preventDefault();

  if (app.isReady()) {
    // App 已经 ready，直接创建窗口
    createWindow(filePath);
  } else {
    // App 还未 ready，缓存文件路径
    pendingFilePath = filePath;
  }
});

app.whenReady().then(() => {
  // 如果有待打开的文件，用该文件创建窗口
  if (pendingFilePath) {
    createWindow(pendingFilePath);
    pendingFilePath = null;
  } else {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (windows.length === 0) {
    createWindow();
  }
});
