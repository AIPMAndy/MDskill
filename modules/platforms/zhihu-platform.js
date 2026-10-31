/**
 * Zhihu Platform Adapter
 * 知乎平台适配器
 */

const BasePlatform = require('./base-platform');
const { BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

class ZhihuPlatform extends BasePlatform {
  constructor(config = {}) {
    super('zhihu', config);
    this.webview = null;
    this.editorUrl = 'https://zhuanlan.zhihu.com/write';
  }

  async checkLogin() {
    return new Promise((resolve, reject) => {
      if (!this.webview || this.webview.isDestroyed()) {
        this.webview = this.createWebView();
      }

      this.webview.webContents.on('did-finish-load', async () => {
        try {
          const isEditor = await this.webview.webContents.executeJavaScript(`
            window.location.href.includes('zhuanlan.zhihu.com')
          `);

          this.isLoggedIn = isEditor;
          resolve(isEditor);
        } catch (error) {
          reject(error);
        }
      });

      this.webview.loadURL(this.editorUrl);
    });
  }

  createWebView() {
    const webview = new BrowserWindow({
      width: 1200,
      height: 800,
      title: '知乎 - 发布',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        partition: 'persist:zhihu'
      }
    });

    return webview;
  }

  async publish(content, options = {}) {
    try {
      const validation = this.validate(content);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      if (!this.isLoggedIn) {
        await this.checkLogin();
      }

      await this.waitForEditor();
      await this.injectContent(content);

      return {
        success: true,
        platform: 'zhihu',
        message: '内容已填充到知乎编辑器，请手动点击发布'
      };

    } catch (error) {
      this.lastError = error;
      return {
        success: false,
        platform: 'zhihu',
        error: error.message
      };
    }
  }

  async waitForEditor() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('等待编辑器超时，请手动打开知乎文章编辑页面'));
      }, 30000);

      const checkEditor = setInterval(async () => {
        try {
          const hasEditor = await this.webview.webContents.executeJavaScript(`
            !!document.querySelector('.ProseMirror') || !!document.querySelector('[contenteditable="true"]')
          `);

          if (hasEditor) {
            clearInterval(checkEditor);
            clearTimeout(timeout);
            resolve();
          }
        } catch (error) {
          // 继续等待
        }
      }, 500);
    });
  }

  async injectContent(content) {
    const injectorPath = path.join(__dirname, '../injectors/zhihu-injector.js');
    const baseInjectorPath = path.join(__dirname, '../injectors/base-injector.js');

    const baseInjectorCode = fs.readFileSync(baseInjectorPath, 'utf-8');
    const injectorCode = fs.readFileSync(injectorPath, 'utf-8');

    await this.webview.webContents.executeJavaScript(`
      ${baseInjectorCode}
      ${injectorCode}

      (async () => {
        const injector = new ZhihuInjector();
        const html = ${JSON.stringify(content.html)};
        await injector.inject(html);
        return { success: true };
      })();
    `);
  }

  close() {
    if (this.webview && !this.webview.isDestroyed()) {
      this.webview.close();
      this.webview = null;
    }
  }
}

module.exports = ZhihuPlatform;
