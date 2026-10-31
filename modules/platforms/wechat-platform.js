/**
 * WeChat Official Account Platform Adapter
 * 微信公众号平台适配器
 */

const BasePlatform = require('./base-platform');
const { BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

class WechatPlatform extends BasePlatform {
  constructor(config = {}) {
    super('wechat', config);
    this.webview = null;
    this.editorUrl = 'https://mp.weixin.qq.com';
  }

  /**
   * 检查是否已登录
   */
  async checkLogin() {
    return new Promise((resolve, reject) => {
      if (!this.webview || this.webview.isDestroyed()) {
        this.webview = this.createWebView();
      }

      this.webview.webContents.on('did-finish-load', async () => {
        try {
          // 检测是否在编辑器页面
          const isEditor = await this.webview.webContents.executeJavaScript(`
            window.location.href.includes('mp.weixin.qq.com')
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

  /**
   * 创建 WebView 窗口
   */
  createWebView() {
    const webview = new BrowserWindow({
      width: 1200,
      height: 800,
      title: '微信公众号 - 发布',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        partition: 'persist:wechat' // 持久化 session
      }
    });

    return webview;
  }

  /**
   * 发布内容到微信公众号
   */
  async publish(content, options = {}) {
    try {
      // 验证内容
      const validation = this.validate(content);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      // 检查登录状态
      if (!this.isLoggedIn) {
        await this.checkLogin();
      }

      // 等待用户导航到编辑器页面
      await this.waitForEditor();

      // 注入内容
      await this.injectContent(content);

      return {
        success: true,
        platform: 'wechat',
        message: '内容已填充到微信公众号编辑器，请手动点击发布'
      };

    } catch (error) {
      this.lastError = error;
      return {
        success: false,
        platform: 'wechat',
        error: error.message
      };
    }
  }

  /**
   * 等待编辑器页面加载完成
   */
  async waitForEditor() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('等待编辑器超时，请手动打开图文消息编辑页面'));
      }, 30000);

      const checkEditor = setInterval(async () => {
        try {
          const hasEditor = await this.webview.webContents.executeJavaScript(`
            !!document.querySelector('#ueditor_0') || !!window.UE
          `);

          if (hasEditor) {
            clearInterval(checkEditor);
            clearTimeout(timeout);
            resolve();
          }
        } catch (error) {
          // 页面可能还在加载，继续等待
        }
      }, 500);
    });
  }

  /**
   * 注入内容到编辑器
   */
  async injectContent(content) {
    // 读取注入脚本
    const injectorPath = path.join(__dirname, '../injectors/wechat-injector.js');
    const baseInjectorPath = path.join(__dirname, '../injectors/base-injector.js');

    const baseInjectorCode = fs.readFileSync(baseInjectorPath, 'utf-8');
    const injectorCode = fs.readFileSync(injectorPath, 'utf-8');

    // 执行注入
    await this.webview.webContents.executeJavaScript(`
      ${baseInjectorCode}
      ${injectorCode}

      (async () => {
        const injector = new WechatInjector();
        const html = ${JSON.stringify(content.html)};
        await injector.inject(html);
        return { success: true };
      })();
    `);
  }

  /**
   * 关闭 WebView
   */
  close() {
    if (this.webview && !this.webview.isDestroyed()) {
      this.webview.close();
      this.webview = null;
    }
  }
}

module.exports = WechatPlatform;
