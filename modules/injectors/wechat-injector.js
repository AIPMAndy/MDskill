// 微信公众号注入器
class WeChatInjector extends BaseInjector {
  constructor() {
    super('微信公众号');
    this.init();
  }

  async init() {
    try {
      // 等待编辑器加载
      await this.waitForEditor('#ueditor_0', 15000);
      this.isReady = true;
      console.log('[AndyMD] 微信公众号编辑器已就绪');
    } catch (error) {
      console.error('[AndyMD] 微信公众号编辑器未找到:', error);
      this.isReady = false;
    }
  }

  async inject(html, markdown) {
    if (!this.isReady) {
      throw new Error('编辑器未就绪，请刷新页面后重试');
    }

    try {
      // 方法 1: 通过 UEditor 实例注入
      const ueditor = window.UE?.getEditor('ueditor_0');
      if (ueditor) {
        // 清理 HTML
        const cleanHTML = this.sanitizeHTML(html);

        // 设置内容
        ueditor.setContent(cleanHTML);

        console.log('[AndyMD] 通过 UEditor 实例注入成功');
        this.showNotification('✓ 已应用到微信公众号编辑器');
        return true;
      }

      // 方法 2: 直接操作 DOM
      const editorBody = document.querySelector('#ueditor_0');
      if (editorBody) {
        const cleanHTML = this.sanitizeHTML(html);
        editorBody.innerHTML = cleanHTML;

        console.log('[AndyMD] 通过 DOM 注入成功');
        this.showNotification('✓ 已应用到微信公众号编辑器');
        return true;
      }

      throw new Error('找不到编辑器实例');

    } catch (error) {
      console.error('[AndyMD] 注入失败:', error);
      this.showNotification('✗ 注入失败: ' + error.message, 'error');
      throw error;
    }
  }
}

// 初始化微信注入器
const wechatInjector = new WeChatInjector();

// 监听来自侧边栏的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'applyContent' && request.platform === 'wechat') {
    console.log('[AndyMD] 收到微信注入请求');

    wechatInjector.inject(request.html, request.markdown)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });

    return true; // 保持消息通道打开
  }
});
