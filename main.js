const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const Store = require('electron-store');
const licenseManager = require('./license-manager');
const { subscriptionManager, SubscriptionStatus } = require('./subscription-manager');

const store = new Store();

let windows = []; // 存储所有窗口
let pendingFilePath = null; // 缓存 app ready 前的文件路径
let fileWatchers = new Map(); // 文件监听器映射 { windowId: { filePath, watcher } }

// 加载 i18n 配置
const { t: i18nT, getCurrentLanguage, setLanguage } = require('./i18n/locales');
let currentLanguage = getCurrentLanguage();

// 获取当前语言的文本
function t(key, params = {}) {
  return i18nT(key, currentLanguage, params);
}

// 切换语言
function switchLanguage(lang) {
  currentLanguage = lang;
  setLanguage(lang);

  // 重建菜单并通知所有 BrowserWindow，包括帮助、订阅、AI 设置等独立窗口。
  BrowserWindow.getAllWindows().forEach(win => {
    if (win && !win.isDestroyed()) {
      buildMenu(win);
      if (!win.webContents.isDestroyed()) {
        win.webContents.send('language-changed', lang);
      }
    }
  });
}

// 获取最近文档列表
function getRecentDocuments() {
  return store.get('recentDocuments', []);
}

// 添加到最近文档列表
function addRecentDocument(filePath) {
  if (!filePath) return;

  let recent = getRecentDocuments();

  // 移除重复项
  recent = recent.filter(path => path !== filePath);

  // 添加到开头
  recent.unshift(filePath);

  // 限制为最近 10 个
  recent = recent.slice(0, 10);

  // 保存到 store
  store.set('recentDocuments', recent);

  // 使用 Electron 的原生最近文档 API
  if (process.platform === 'darwin' || process.platform === 'win32') {
    app.addRecentDocument(filePath);
  }

  // 重建所有窗口的菜单
  windows.forEach(win => {
    if (win && !win.isDestroyed()) {
      buildMenu(win);
    }
  });
}

// 构建最近文档菜单
function buildRecentDocumentsMenu() {
  const recent = getRecentDocuments();

  if (recent.length === 0) {
    return [
      {
        label: t('noRecentDocuments'),
        enabled: false
      }
    ];
  }

  const menuItems = [];

  // Add recent files
  recent.forEach(filePath => {
    const fileName = path.basename(filePath);
    const dirName = path.basename(path.dirname(filePath));
    const displayLabel = `${fileName} (${dirName})`;

    menuItems.push({
      label: displayLabel,
      click: () => {
        const focusedWindow = BrowserWindow.getFocusedWindow() || windows[0];
        if (focusedWindow) {
          openSpecificFile(focusedWindow, filePath);
        }
      }
    });
  });

  // Add separator
  menuItems.push({ type: 'separator' });

  // Add clear option
  menuItems.push({
    label: t('clearRecentDocuments'),
    click: () => {
      store.set('recentDocuments', []);
      if (process.platform === 'darwin' || process.platform === 'win32') {
        app.clearRecentDocuments();
      }
      // 重建所有窗口的菜单
      windows.forEach(win => {
        if (win && !win.isDestroyed()) {
          buildMenu(win);
        }
      });
    }
  });

  return menuItems;
}

// 构建菜单
function buildMenu(win) {
  const recentMenu = buildRecentDocumentsMenu();

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
          label: t('recentDocuments'),
          submenu: recentMenu
        },
        { type: 'separator' },
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
        { role: 'selectAll', label: t('selectAll') },
        { type: 'separator' },
        {
          label: t('find'),
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('open-find');
            }
          }
        },
        {
          label: t('findReplace'),
          accelerator: 'CmdOrCtrl+Alt+F',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('open-find-replace');
            }
          }
        }
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
        {
          label: t('codeBlockLineNumbers'),
          type: 'checkbox',
          checked: true,
          click: (menuItem) => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('toggle-code-block-lines', menuItem.checked);
            }
          }
        },
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
                title: t('deviceFingerprintTitle'),
                message: t('deviceFingerprintMessage'),
                detail: fingerprint,
                buttons: [t('copyButton'), t('close')]
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
                title: t('contactDeveloperTitle'),
                message: t('contactDeveloperMessage'),
                detail: t('contactDeveloperDetail'),
                buttons: [t('close')]
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
}

function createWindow(filePath = null, restoreSession = true) {
  // 恢复窗口状态（如果有保存的会话）
  const session = store.get('mdskill.session.v1', {});
  const windowBounds = session.windowBounds || {};

  const win = new BrowserWindow({
    width: windowBounds.width || 1400,
    height: windowBounds.height || 900,
    x: windowBounds.x,
    y: windowBounds.y,
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

  // 保存窗口状态变化
  const saveWindowState = () => {
    // 检查窗口是否已销毁
    if (win.isDestroyed()) {
      return;
    }

    try {
      if (!win.isMinimized() && !win.isMaximized()) {
        const bounds = win.getBounds();
        const currentSession = store.get('mdskill.session.v1', {});
        currentSession.windowBounds = bounds;
        store.set('mdskill.session.v1', currentSession);
      }
    } catch (error) {
      console.error('[saveWindowState] Error saving window state:', error);
    }
  };

  // 监听窗口大小和位置变化
  win.on('resize', saveWindowState);
  win.on('move', saveWindowState);

  // 窗口关闭前保存状态
  win.on('close', () => {
    saveWindowState();
  });

  // 窗口完全关闭后清理
  win.on('closed', () => {
    const index = windows.indexOf(win);
    if (index > -1) {
      windows.splice(index, 1);
    }

    // 停止文件监听
    stopWatchingFile(win.id);
  });

  // 等待渲染进程完全就绪后再发送文件
  let pendingFilePath = filePath;
  let pendingSessionFile = null;

  if (!filePath && restoreSession) {
    // 没有指定文件，且允许恢复会话，尝试恢复上次的文件
    pendingSessionFile = session.lastFile;
  }

  // 监听渲染进程就绪信号
  ipcMain.once(`renderer-ready-${win.id}`, async () => {
    console.log('[main] Renderer ready signal received');

    try {
      if (pendingFilePath) {
        console.log('[main] Loading pending file:', pendingFilePath);
        const content = await fs.readFile(pendingFilePath, 'utf-8');
        win.webContents.send('file-opened', { path: pendingFilePath, content });
        store.set('lastOpenedFile', pendingFilePath);
        // 保存到会话
        const currentSession = store.get('mdskill.session.v1', {});
        currentSession.lastFile = pendingFilePath;
        store.set('mdskill.session.v1', currentSession);
      } else if (pendingSessionFile) {
        console.log('[main] Restoring session file:', pendingSessionFile);
        const content = await fs.readFile(pendingSessionFile, 'utf-8');
        win.webContents.send('file-opened', { path: pendingSessionFile, content });
      }
    } catch (error) {
      console.error('[main] Failed to open file:', error);
    }
  });

  // 构建菜单
  buildMenu(win);

  return win;
}

// ============================================================================
// 文件监听功能（外部修改自动刷新）
// ============================================================================

// 开始监听文件
function startWatchingFile(windowId, filePath) {
  // 停止之前的监听
  stopWatchingFile(windowId);

  if (!filePath) return;

  console.log(`[FileWatch] Starting watch for window ${windowId}: ${filePath}`);

  try {
    // 使用 Node.js 内置的 fs.watch
    const watcher = fsSync.watch(filePath, { persistent: true }, async (eventType, filename) => {
      console.log(`[FileWatch] File event: ${eventType} for ${filename}`);

      // 查找对应的窗口
      const win = windows.find(w => w.id === windowId);
      if (!win || win.isDestroyed()) {
        stopWatchingFile(windowId);
        return;
      }

      if (eventType === 'change') {
        // 文件内容变化
        try {
          // 小延迟确保文件写入完成
          setTimeout(async () => {
            try {
              const content = await fs.readFile(filePath, 'utf-8');
              win.webContents.send('file-changed-externally', {
                path: filePath,
                content: content
              });
            } catch (error) {
              // 文件可能被删除
              console.error('[FileWatch] Failed to read changed file:', error);
            }
          }, 100);
        } catch (error) {
          console.error('[FileWatch] Failed to read changed file:', error);
        }
      } else if (eventType === 'rename') {
        // 文件被删除或重命名
        try {
          await fs.access(filePath);
          // 文件仍然存在，可能是重命名后又恢复
        } catch (error) {
          // 文件不存在，通知删除
          console.log(`[FileWatch] File deleted: ${filePath}`);
          win.webContents.send('file-deleted-externally', { path: filePath });
          stopWatchingFile(windowId);
        }
      }
    });

    // 保存监听器
    fileWatchers.set(windowId, {
      filePath: filePath,
      watcher: watcher
    });

    watcher.on('error', (error) => {
      console.error('[FileWatch] Watcher error:', error);
      stopWatchingFile(windowId);
    });
  } catch (error) {
    console.error('[FileWatch] Failed to create watcher:', error);
  }
}

// 停止监听文件
function stopWatchingFile(windowId) {
  const watcherInfo = fileWatchers.get(windowId);
  if (watcherInfo) {
    console.log(`[FileWatch] Stopping watch for window ${windowId}: ${watcherInfo.filePath}`);
    watcherInfo.watcher.close();
    fileWatchers.delete(windowId);
  }
}

// IPC: 渲染进程通知开始监听文件
ipcMain.on('start-watching-file', (event, filePath) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    startWatchingFile(win.id, filePath);
  }
});

// IPC: 渲染进程通知停止监听文件
ipcMain.on('stop-watching-file', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    stopWatchingFile(win.id);
  }
});

// ============================================================================

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
    title: t('aiConfig'),
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
    title: t('subscriptionPage.title'),
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

    // 保存到会话
    const currentSession = store.get('mdskill.session.v1', {});
    currentSession.lastFile = filePath;
    store.set('mdskill.session.v1', currentSession);

    // 添加到最近文档列表
    addRecentDocument(filePath);
  }
}

// 打开指定的文件
async function openSpecificFile(targetWindow, filePath) {
  try {
    const win = targetWindow || BrowserWindow.getFocusedWindow();
    const content = await fs.readFile(filePath, 'utf-8');
    win.webContents.send('file-opened', { path: filePath, content });
    store.set('lastOpenedFile', filePath);

    // 添加到最近文档列表
    addRecentDocument(filePath);
  } catch (error) {
    console.error('Error opening file:', error);
    dialog.showErrorBox(
      t('openFileFailedTitle'),
      t('openFileFailedMessage', { path: filePath, error: error.message })
    );
  }
}

// IPC 处理
ipcMain.handle('get-window-id', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return win ? win.id : null;
});

ipcMain.on('set-window-title', (event, title) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && typeof title === 'string' && title.trim()) {
    win.setTitle(title);
  }
});

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

    // 保存到会话
    const currentSession = store.get('mdskill.session.v1', {});
    currentSession.lastFile = filePath;
    store.set('mdskill.session.v1', currentSession);

    // 添加到最近文档列表
    addRecentDocument(filePath);

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

      // 保存到会话
      const currentSession = store.get('mdskill.session.v1', {});
      currentSession.lastFile = result.filePath;
      store.set('mdskill.session.v1', currentSession);

      // 添加到最近文档列表
      addRecentDocument(result.filePath);

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

// Save image from clipboard
ipcMain.handle('save-image', async (event, { imageBuffer, currentFilePath }) => {
  try {
    let imageDir;

    // If document is saved, use its directory
    if (currentFilePath) {
      const docDir = path.dirname(currentFilePath);
      imageDir = path.join(docDir, 'images');
    } else {
      // If document not saved, use temp directory
      const tempDir = app.getPath('temp');
      imageDir = path.join(tempDir, 'mdskill-images');
    }

    // Create images directory if not exists
    await fs.mkdir(imageDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileName = `image-${timestamp}-${random}.png`;
    const imagePath = path.join(imageDir, fileName);

    // Write image file
    await fs.writeFile(imagePath, imageBuffer);

    // Return relative path for markdown
    const relativePath = currentFilePath
      ? `images/${fileName}`
      : imagePath;

    return { success: true, path: relativePath, absolutePath: imagePath };
  } catch (error) {
    console.error('Error saving image:', error);
    return { success: false, error: error.message };
  }
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
        displayHeaderFooter: true,
        headerTemplate: '<div></div>', // Empty header
        footerTemplate: `
          <div style="width: 100%; text-align: center; font-size: 10px; color: #888; padding: 0 1cm;">
            <span class="pageNumber"></span> / <span class="totalPages"></span>
          </div>
        `,
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
  createWindow(null, false); // 创建空白窗口，不恢复会话文件
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
