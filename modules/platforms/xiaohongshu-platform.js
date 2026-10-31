/**
 * Xiaohongshu Platform Adapter
 * 小红书平台适配器
 */

const BasePlatform = require('./base-platform');
const { BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

class XiaohongshuPlatform extends BasePlatform {
  constructor(config = {}) {
    super('xiaohongshu', config);
    this.webview = null;
    this.editorUrl = 'https://creator.xiaohongshu.com/publish/publish';
  }

  async checkLogin() {
    return new Promise((resolve, reject) => {
      if (!this.webview || this.webview.isDestroyed()) {
        this.webview = this.createWebView();
      }

      this.webview.webContents.on('did-finish-load', async () => {
        try {
          const isEditor = await this.webview.webContents.executeJavaScript(`
            window.location.href.includes('creator.xiaohongshu.com')
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
      title: '小红书 - 发布',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        partition: 'persist:xiaohongshu'
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
        platform: 'xiaohongshu',
        message: '内容已填充到小红书编辑器，请手动点击发布'
      };

    } catch (error) {
      this.lastError = error;
      return {
        success: false,
        platform: 'xiaohongshu',
        error: error.message
      };
    }
  }

  async waitForEditor() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('等待编辑器超时，请手动打开小红书发布页面'));
      }, 30000);

      const checkEditor = setInterval(async () => {
        try {
          // 小红书使用自定义编辑器
          const hasEditor = await this.webview.webContents.executeJavaScript(`
            !!document.querySelector('[contenteditable="true"]') ||
            !!document.querySelector('.ql-editor') ||
            !!document.querySelector('textarea[placeholder*="标题"]')
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
    // 小红书注入逻辑（需要研究DOM结构）
    const baseInjectorPath = path.join(__dirname, '../injectors/base-injector.js');
    const baseInjectorCode = fs.readFileSync(baseInjectorPath, 'utf-8');

    await this.webview.webContents.executeJavaScript(`
      ${baseInjectorCode}

      (async () => {
        // 查找标题输入框
        const titleInput = document.querySelector('input[placeholder*="标题"]') ||
                          document.querySelector('textarea[placeholder*="标题"]');

        if (titleInput) {
          titleInput.value = ${JSON.stringify(content.title)};
          titleInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // 查找内容编辑器
        const contentEditor = document.querySelector('[contenteditable="true"]') ||
                             document.querySelector('.ql-editor');

        if (contentEditor) {
          // 小红书可能不支持富文本，使用纯文本
          contentEditor.innerText = ${JSON.stringify(content.markdown)};
          contentEditor.dispatchEvent(new Event('input', { bubbles: true }));
        }

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

module.exports = XiaohongshuPlatform;
