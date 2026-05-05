const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const Store = require('electron-store');
const licenseManager = require('./license-manager');

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
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('show-about-dialog');
            }
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
            showActivationDialog();
          }
        },
        {
          label: t('getDeviceFingerprint'),
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('show-device-fingerprint-dialog');
            }
          }
        },
        { type: 'separator' },
        {
          label: t('contactDeveloper'),
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('show-contact-dialog');
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
  const result = await dialog.showSaveDialog(win, {
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

ipcMain.handle('export-pdf', async (event, { defaultPath }) => {
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
      // 使用 Electron 的 printToPDF API
      const data = await win.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4',
        margins: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
      });
      console.log('PDF data generated, size:', data.length, 'bytes');
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
