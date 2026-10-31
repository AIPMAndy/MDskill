/**
 * Platform Base Class
 * 所有平台适配器的基类
 */

class BasePlatform {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.isLoggedIn = false;
    this.lastError = null;
  }

  /**
   * 获取平台显示名称
   */
  getDisplayName() {
    const names = {
      wechat: '微信公众号',
      zhihu: '知乎',
      xiaohongshu: '小红书',
      csdn: 'CSDN'
    };
    return names[this.name] || this.name;
  }

  /**
   * 检查是否已登录
   * @returns {Promise<boolean>}
   */
  async checkLogin() {
    throw new Error('Must implement checkLogin()');
  }

  /**
   * 发布内容
   * @param {Object} content - 内容对象
   * @param {string} content.title - 标题
   * @param {string} content.markdown - Markdown 原文
   * @param {string} content.html - 转换后的 HTML
   * @param {Object} options - 发布选项
   * @returns {Promise<Object>} - 发布结果
   */
  async publish(content, options = {}) {
    throw new Error('Must implement publish()');
  }

  /**
   * 验证内容格式
   * @param {Object} content - 内容对象
   * @returns {Object} - {valid: boolean, message?: string}
   */
  validate(content) {
    if (!content.title || content.title.trim() === '') {
      return { valid: false, message: '标题不能为空' };
    }

    if (!content.markdown || content.markdown.trim() === '') {
      return { valid: false, message: '内容不能为空' };
    }

    return { valid: true };
  }

  /**
   * 获取平台特定配置
   * @returns {Object}
   */
  getConfig() {
    return this.config;
  }

  /**
   * 更新平台配置
   * @param {Object} config
   */
  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }

  /**
   * 获取最后的错误信息
   * @returns {Error|null}
   */
  getLastError() {
    return this.lastError;
  }

  /**
   * 清除错误信息
   */
  clearError() {
    this.lastError = null;
  }
}

module.exports = BasePlatform;
