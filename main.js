const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const Store = require('electron-store');
const licenseManager = require('./license-manager');

const store = new Store();

let windows = []; // 存储所有窗口
let pendingFilePath = null; // 缓存 app ready 前的文件路径

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

  // 创建菜单
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Window',
          accelerator: 'CmdOrCtrl+N',
          click: () => createWindow()
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => openFile(BrowserWindow.getFocusedWindow())
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('file-save');
            }
          }
        },
        {
          label: 'Save As',
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
          label: 'Export as PDF',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('export-pdf');
            }
          }
        },
        { type: 'separator' },
        { role: 'close' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Preview',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('toggle-preview');
            }
          }
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About MDskill',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            const licenseInfo = licenseManager.getLicenseInfo();
            const versionInfo = licenseInfo && licenseInfo.isPro ? 'v1.2.0 专业版' : 'v1.2.0 免费版';

            dialog.showMessageBox(focusedWindow, {
              type: 'info',
              title: 'About MDskill',
              message: `MDskill ${versionInfo}`,
              detail: 'Modern Markdown Editor for Mac\n\n' +
                      'AI酋长Andy 出品\n' +
                      '合作微信: AIPMAndy\n\n' +
                      '© 2026 AI酋长Andy. All rights reserved.\n' +
                      'Licensed under GPL-3.0 License',
              buttons: ['OK']
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Activate Pro Version',
          click: () => {
            showActivationDialog();
          }
        },
        {
          label: 'Get Device Fingerprint',
          click: () => {
            const deviceId = licenseManager.getDeviceFingerprint();
            const focusedWindow = BrowserWindow.getFocusedWindow();
            dialog.showMessageBox(focusedWindow, {
              type: 'info',
              title: '设备指纹',
              message: '您的设备指纹',
              detail: `设备指纹：${deviceId}\n\n` +
                      '请将此设备指纹发送给开发者以获取授权码。\n\n' +
                      '联系方式：\n' +
                      '微信: AIPMAndy',
              buttons: ['复制', '关闭'],
              defaultId: 0
            }).then(result => {
              if (result.response === 0) {
                // 复制到剪贴板
                const { clipboard } = require('electron');
                clipboard.writeText(deviceId);
              }
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Contact Developer',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            dialog.showMessageBox(focusedWindow, {
              type: 'info',
              title: 'Contact',
              message: '联系开发者',
              detail: 'AI酋长Andy\n\n' +
                      '微信: AIPMAndy\n' +
                      'GitHub: @AIPMAndy\n\n' +
                      '欢迎合作交流！',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  return win;
}

// 显示激活对话框
async function showActivationDialog() {
  const focusedWindow = BrowserWindow.getFocusedWindow();

  // 创建激活窗口
  const activationWin = new BrowserWindow({
    width: 500,
    height: 400,
    parent: focusedWindow,
    modal: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 加载激活页面
  activationWin.loadFile('renderer/activation.html');

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
