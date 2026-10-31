// 基础注入器 - 所有平台的通用逻辑
class BaseInjector {
  constructor(platformName) {
    this.platformName = platformName;
    this.isReady = false;
    console.log(`[AndyMD] ${platformName} 注入器已加载`);
  }

  // 等待编辑器元素出现
  waitForEditor(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkEditor = () => {
        const editor = document.querySelector(selector);
        if (editor) {
          console.log(`[AndyMD] 找到 ${this.platformName} 编辑器:`, selector);
          resolve(editor);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`等待编辑器超时: ${selector}`));
        } else {
          setTimeout(checkEditor, 200);
        }
      };

      checkEditor();
    });
  }

  // 清理 HTML（移除不安全的标签和属性）
  sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // 移除 script 标签
    const scripts = temp.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    // 移除事件属性
    const allElements = temp.querySelectorAll('*');
    allElements.forEach(el => {
      const attributes = Array.from(el.attributes);
      attributes.forEach(attr => {
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return temp.innerHTML;
  }

  // 发送通知
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#4caf50' : '#f44336'};
      color: white;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 999999;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  // 子类需要实现的方法
  async inject(html, markdown) {
    throw new Error('子类必须实现 inject 方法');
  }
}

// 导出供平台特定的注入器使用
window.BaseInjector = BaseInjector;
