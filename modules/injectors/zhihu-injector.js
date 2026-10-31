// 知乎注入器
class ZhihuInjector extends BaseInjector {
  constructor() {
    super('知乎专栏');
    this.init();
  }

  async init() {
    try {
      // 知乎编辑器可能有多个选择器
      const selectors = [
        '.ProseMirror',
        '[contenteditable="true"]',
        '.RichContent-editor'
      ];

      let editor = null;
      for (const selector of selectors) {
        try {
          editor = await this.waitForEditor(selector, 5000);
          if (editor) break;
        } catch (e) {
          continue;
        }
      }

      if (editor) {
        this.isReady = true;
        console.log('[AndyMD] 知乎编辑器已就绪');
      } else {
        throw new Error('未找到知乎编辑器');
      }
    } catch (error) {
      console.error('[AndyMD] 知乎编辑器未找到:', error);
      this.isReady = false;
    }
  }

  async inject(html, markdown) {
    if (!this.isReady) {
      throw new Error('编辑器未就绪，请刷新页面后重试');
    }

    try {
      // 查找编辑器
      const editor = document.querySelector('.ProseMirror') ||
                     document.querySelector('[contenteditable="true"]');

      if (!editor) {
        throw new Error('找不到知乎编辑器');
      }

      // 清理 HTML
      const cleanHTML = this.sanitizeHTML(html);

      // 方法 1: 使用 innerHTML（简单粗暴）
      editor.innerHTML = cleanHTML;

      // 触发输入事件，让知乎编辑器感知到变化
      const inputEvent = new Event('input', { bubbles: true });
      editor.dispatchEvent(inputEvent);

      console.log('[AndyMD] 知乎注入成功');
      this.showNotification('✓ 已应用到知乎编辑器');
      return true;

    } catch (error) {
      console.error('[AndyMD] 注入失败:', error);
      this.showNotification('✗ 注入失败: ' + error.message, 'error');
      throw error;
    }
  }
}

// 初始化知乎注入器
const zhihuInjector = new ZhihuInjector();

// 监听来自侧边栏的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'applyContent' && request.platform === 'zhihu') {
    console.log('[AndyMD] 收到知乎注入请求');

    zhihuInjector.inject(request.html, request.markdown)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });

    return true; // 保持消息通道打开
  }
});
