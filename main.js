const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const Store = require('electron-store');

const store = new Store();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
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

  mainWindow.loadFile('renderer/index.html');

  // 创建菜单
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('file-new')
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => openFile()
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('file-save')
        },
        {
          label: 'Save As',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow.webContents.send('file-save-as')
        },
        { type: 'separator' },
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
          click: () => mainWindow.webContents.send('toggle-preview')
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
      label: 'Help',
      submenu: [
        {
          label: 'About MDSKILL',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About MDSKILL',
              message: 'MDSKILL v1.1.0',
              detail: 'Modern Markdown Editor for Mac\n\n' +
                      'AI酋长Andy 出品\n' +
                      '合作微信: AIPMAndy\n\n' +
                      '© 2026 AI酋长Andy. All rights reserved.\n' +
                      'Licensed under MIT License',
              buttons: ['OK']
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Contact Developer',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
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
}

async function openFile() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown', 'txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const content = await fs.readFile(filePath, 'utf-8');
    mainWindow.webContents.send('file-opened', { path: filePath, content });
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
  const result = await dialog.showSaveDialog(mainWindow, {
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

// 监听渲染进程的打开文件请求
ipcMain.on('file-open', () => {
  openFile();
});

// 处理通过 Finder 打开文件（macOS）
app.on('open-file', (event, filePath) => {
  event.preventDefault();
  if (mainWindow) {
    loadFileIntoWindow(filePath);
  } else {
    // 如果窗口还未创建，保存路径待窗口创建后加载
    app.fileToOpen = filePath;
  }
});

// 加载文件到窗口
async function loadFileIntoWindow(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    mainWindow.webContents.send('file-opened', { path: filePath, content });
    store.set('lastOpenedFile', filePath);
  } catch (error) {
    console.error('Failed to open file:', error);
  }
}

app.whenReady().then(() => {
  createWindow();

  // 如果有待打开的文件，加载它
  if (app.fileToOpen) {
    setTimeout(() => {
      loadFileIntoWindow(app.fileToOpen);
      app.fileToOpen = null;
    }, 500);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
