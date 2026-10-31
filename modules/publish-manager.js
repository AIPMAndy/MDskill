/**
 * Publish Manager
 * 发布管理器 - 统一管理所有平台的发布逻辑
 */

const WechatPlatform = require('./platforms/wechat-platform');
const ZhihuPlatform = require('./platforms/zhihu-platform');
const XiaohongshuPlatform = require('./platforms/xiaohongshu-platform');
const ElectronStore = require('electron-store');
const marked = require('marked');
const hljs = require('highlight.js');

class PublishManager {
  constructor() {
    this.platforms = new Map();
    this.store = new ElectronStore({
      name: 'publish-data',
      defaults: {
        history: [],
        platformConfigs: {}
      }
    });

    this.registerPlatforms();
    this.configureMarked();
  }

  /**
   * 注册所有平台
   */
  registerPlatforms() {
    const configs = this.store.get('platformConfigs');

    this.platforms.set('wechat', new WechatPlatform(configs.wechat || {}));
    this.platforms.set('zhihu', new ZhihuPlatform(configs.zhihu || {}));
    this.platforms.set('xiaohongshu', new XiaohongshuPlatform(configs.xiaohongshu || {}));
  }

  /**
   * 配置 Markdown 解析器
   */
  configureMarked() {
    marked.setOptions({
      highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      },
      breaks: true,
      gfm: true
    });
  }

  /**
   * 获取所有平台列表
   */
  getPlatforms() {
    return Array.from(this.platforms.keys()).map(key => ({
      id: key,
      name: this.platforms.get(key).getDisplayName(),
      isLoggedIn: this.platforms.get(key).isLoggedIn
    }));
  }

  /**
   * 发布到指定平台
   * @param {string} platformId - 平台ID
   * @param {Object} content - 内容对象
   * @param {string} content.title - 标题
   * @param {string} content.markdown - Markdown内容
   * @param {Object} options - 发布选项
   */
  async publishTo(platformId, content, options = {}) {
    const platform = this.platforms.get(platformId);

    if (!platform) {
      throw new Error(`未知平台: ${platformId}`);
    }

    // 准备内容
    const preparedContent = this.prepareContent(content);

    // 验证内容
    const validation = platform.validate(preparedContent);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // 执行发布
    const startTime = Date.now();
    const result = await platform.publish(preparedContent, options);
    const duration = Date.now() - startTime;

    // 保存历史记录
    await this.saveHistory({
      platformId,
      platformName: platform.getDisplayName(),
      title: content.title,
      timestamp: new Date().toISOString(),
      duration,
      success: result.success,
      error: result.error || null
    });

    return result;
  }

  /**
   * 准备发布内容（转换 Markdown 为 HTML）
   */
  prepareContent(content) {
    return {
      title: content.title,
      markdown: content.markdown,
      html: marked.parse(content.markdown)
    };
  }

  /**
   * 批量发布到多个平台
   */
  async publishToMultiple(platformIds, content, options = {}) {
    const results = [];

    for (const platformId of platformIds) {
      try {
        const result = await this.publishTo(platformId, content, options);
        results.push({
          platformId,
          ...result
        });
      } catch (error) {
        results.push({
          platformId,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * 保存发布历史
   */
  async saveHistory(record) {
    const history = this.store.get('history');
    history.unshift(record);

    // 只保留最近100条
    if (history.length > 100) {
      history.splice(100);
    }

    this.store.set('history', history);
  }

  /**
   * 获取发布历史
   */
  getHistory(limit = 20) {
    const history = this.store.get('history');
    return history.slice(0, limit);
  }

  /**
   * 清除发布历史
   */
  clearHistory() {
    this.store.set('history', []);
  }

  /**
   * 更新平台配置
   */
  updatePlatformConfig(platformId, config) {
    const configs = this.store.get('platformConfigs');
    configs[platformId] = { ...configs[platformId], ...config };
    this.store.set('platformConfigs', configs);

    // 更新平台实例
    const platform = this.platforms.get(platformId);
    if (platform) {
      platform.updateConfig(config);
    }
  }

  /**
   * 获取平台配置
   */
  getPlatformConfig(platformId) {
    const configs = this.store.get('platformConfigs');
    return configs[platformId] || {};
  }

  /**
   * 关闭所有平台连接
   */
  closeAll() {
    for (const [, platform] of this.platforms) {
      if (typeof platform.close === 'function') {
        platform.close();
      }
    }
  }
}

// 单例模式
let instance = null;

module.exports = {
  getInstance: () => {
    if (!instance) {
      instance = new PublishManager();
    }
    return instance;
  }
};
