/**
 * MDSKILL 订阅管理模块
 *
 * 功能：
 * 1. 管理用户订阅状态（试用/付费/过期）
 * 2. 在线验证会员资格
 * 3. 本地状态持久化
 * 4. 到期提醒
 * 5. 功能权限控制
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { app } = require('electron');

// 订阅状态枚举
const SubscriptionStatus = {
  TRIAL: 'trial',           // 试用期
  ACTIVE: 'active',         // 付费会员
  EXPIRED: 'expired',       // 已过期
  NONE: 'none'              // 未激活
};

// 配置
const CONFIG = {
  TRIAL_DAYS: 7,                     // 试用天数
  REMINDER_DAYS: 3,                  // 提前提醒天数
  VERIFY_INTERVAL: 24 * 60 * 60 * 1000,  // 验证间隔（24小时）
  MONTHLY_PRICE: 19,                 // 月会员价格
  API_BASE_URL: 'https://api.mdskill.com'  // API地址（待部署）
};

class SubscriptionManager {
  constructor() {
    this.configDir = path.join(os.homedir(), '.mdskill');
    this.subscriptionFile = path.join(this.configDir, 'subscription.json');
    this.subscription = null;

    this.ensureConfigDir();
    this.loadSubscription();
  }

  /**
   * 确保配置目录存在
   */
  ensureConfigDir() {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  /**
   * 生成设备指纹
   */
  generateDeviceId() {
    const machineId = `${os.hostname()}-${os.platform()}-${os.arch()}`;
    return crypto.createHash('sha256').update(machineId).digest('hex').substring(0, 32);
  }

  /**
   * 生成用户ID
   */
  generateUserId() {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * 加载订阅信息
   */
  loadSubscription() {
    try {
      if (fs.existsSync(this.subscriptionFile)) {
        const data = fs.readFileSync(this.subscriptionFile, 'utf8');
        this.subscription = JSON.parse(data);
        console.log('[Subscription] Loaded:', this.subscription);
      } else {
        console.log('[Subscription] No subscription file found');
        this.subscription = null;
      }
    } catch (error) {
      console.error('[Subscription] Load error:', error);
      this.subscription = null;
    }
  }

  /**
   * 保存订阅信息
   */
  saveSubscription() {
    try {
      fs.writeFileSync(
        this.subscriptionFile,
        JSON.stringify(this.subscription, null, 2),
        'utf8'
      );
      console.log('[Subscription] Saved:', this.subscription);
    } catch (error) {
      console.error('[Subscription] Save error:', error);
    }
  }

  /**
   * 开通试用
   */
  async startTrial() {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + CONFIG.TRIAL_DAYS * 24 * 60 * 60 * 1000);

    this.subscription = {
      userId: this.generateUserId(),
      deviceId: this.generateDeviceId(),
      status: SubscriptionStatus.TRIAL,
      trialStartDate: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
      lastVerified: now.toISOString(),
      reminderShown: false,
      autoRenew: false
    };

    this.saveSubscription();

    // TODO: 调用在线API注册试用
    // await this.callAPI('/api/v1/auth/trial', {
    //   userId: this.subscription.userId,
    //   deviceId: this.subscription.deviceId
    // });

    console.log('[Subscription] Trial started:', this.subscription);
    return this.subscription;
  }

  /**
   * 在线验证订阅状态
   */
  async verifyOnline() {
    if (!this.subscription) {
      return { valid: false, reason: 'no_subscription' };
    }

    try {
      // TODO: 实现真实的在线验证
      // const response = await this.callAPI('/api/v1/auth/verify', {
      //   userId: this.subscription.userId,
      //   deviceId: this.subscription.deviceId
      // });

      // 模拟在线验证（开发阶段）
      const now = new Date();
      const expiryDate = new Date(this.subscription.expiryDate);
      const isExpired = now > expiryDate;

      if (isExpired && this.subscription.status !== SubscriptionStatus.EXPIRED) {
        this.subscription.status = SubscriptionStatus.EXPIRED;
        this.saveSubscription();
      }

      this.subscription.lastVerified = now.toISOString();
      this.saveSubscription();

      return {
        valid: !isExpired,
        status: this.subscription.status,
        expiryDate: this.subscription.expiryDate,
        daysLeft: this.getDaysLeft()
      };
    } catch (error) {
      console.error('[Subscription] Verify error:', error);
      // 验证失败时使用本地缓存
      return this.verifyLocal();
    }
  }

  /**
   * 本地验证（离线模式）
   */
  verifyLocal() {
    if (!this.subscription) {
      return { valid: false, reason: 'no_subscription' };
    }

    const now = new Date();
    const expiryDate = new Date(this.subscription.expiryDate);
    const lastVerified = new Date(this.subscription.lastVerified);

    // 检查本地缓存是否过期（7天）
    const cacheExpired = (now - lastVerified) > 7 * 24 * 60 * 60 * 1000;
    if (cacheExpired) {
      return { valid: false, reason: 'cache_expired', needOnlineVerify: true };
    }

    const isExpired = now > expiryDate;

    return {
      valid: !isExpired,
      status: this.subscription.status,
      expiryDate: this.subscription.expiryDate,
      daysLeft: this.getDaysLeft(),
      offline: true
    };
  }

  /**
   * 检查是否需要验证
   */
  needsVerification() {
    if (!this.subscription) return true;

    const now = new Date();
    const lastVerified = new Date(this.subscription.lastVerified);
    const timeSinceVerify = now - lastVerified;

    return timeSinceVerify > CONFIG.VERIFY_INTERVAL;
  }

  /**
   * 获取剩余天数
   */
  getDaysLeft() {
    if (!this.subscription) return 0;

    const now = new Date();
    const expiryDate = new Date(this.subscription.expiryDate);
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }

  /**
   * 是否需要显示续费提醒
   */
  shouldShowRenewalReminder() {
    if (!this.subscription) return false;
    if (this.subscription.reminderShown) return false;
    if (this.subscription.status === SubscriptionStatus.EXPIRED) return false;

    const daysLeft = this.getDaysLeft();
    return daysLeft <= CONFIG.REMINDER_DAYS && daysLeft > 0;
  }

  /**
   * 标记提醒已显示
   */
  markReminderShown() {
    if (this.subscription) {
      this.subscription.reminderShown = true;
      this.saveSubscription();
    }
  }

  /**
   * 重置提醒状态（用于测试）
   */
  resetReminder() {
    if (this.subscription) {
      this.subscription.reminderShown = false;
      this.saveSubscription();
    }
  }

  /**
   * 检查功能权限
   */
  hasFeatureAccess(featureName) {
    // 免费功能列表
    const freeFeatures = [
      'basic_edit',
      'preview',
      'file_operations',
      'default_theme'
    ];

    // 如果是免费功能，直接返回 true
    if (freeFeatures.includes(featureName)) {
      return true;
    }

    // 专业功能列表
    const proFeatures = [
      'wechat_copy',        // 复制到微信公众号
      'blog_copy',          // 复制到博客
      'html_export',        // 复制 HTML 源码
      'pdf_export',         // 导出 PDF
      'premium_themes',     // 精美主题
      'ai_format'           // AI 格式化
    ];

    // 如果不是已知的专业功能，默认允许（向后兼容）
    if (!proFeatures.includes(featureName)) {
      return true;
    }

    // 专业功能需要有效订阅
    if (!this.subscription) return false;

    const now = new Date();
    const expiryDate = new Date(this.subscription.expiryDate);

    return now <= expiryDate;
  }

  /**
   * 获取订阅状态摘要
   */
  getStatusSummary() {
    if (!this.subscription) {
      return {
        hasSubscription: false,
        status: SubscriptionStatus.NONE,
        message: '未激活'
      };
    }

    const daysLeft = this.getDaysLeft();
    const isExpired = daysLeft === 0;

    let message = '';
    if (this.subscription.status === SubscriptionStatus.TRIAL) {
      message = `试用期剩余 ${daysLeft} 天`;
    } else if (this.subscription.status === SubscriptionStatus.ACTIVE) {
      message = `会员剩余 ${daysLeft} 天`;
    } else if (this.subscription.status === SubscriptionStatus.EXPIRED) {
      message = '会员已过期';
    }

    return {
      hasSubscription: true,
      status: this.subscription.status,
      daysLeft,
      isExpired,
      expiryDate: this.subscription.expiryDate,
      message,
      needsRenewal: daysLeft <= CONFIG.REMINDER_DAYS
    };
  }

  /**
   * 激活订阅（支付成功后调用）
   */
  async activateSubscription(months = 1) {
    if (!this.subscription) {
      throw new Error('No subscription found');
    }

    const now = new Date();
    let expiryDate;

    // 如果当前订阅未过期，从当前到期日延长
    const currentExpiry = new Date(this.subscription.expiryDate);
    if (currentExpiry > now) {
      expiryDate = new Date(currentExpiry.getTime() + months * 30 * 24 * 60 * 60 * 1000);
    } else {
      // 如果已过期，从现在开始计算
      expiryDate = new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);
    }

    this.subscription.status = SubscriptionStatus.ACTIVE;
    this.subscription.expiryDate = expiryDate.toISOString();
    this.subscription.lastVerified = now.toISOString();
    this.subscription.reminderShown = false;

    this.saveSubscription();

    // TODO: 调用在线API更新订阅状态
    // await this.callAPI('/api/v1/auth/subscribe', {
    //   userId: this.subscription.userId,
    //   months
    // });

    console.log('[Subscription] Activated:', this.subscription);
    return this.subscription;
  }

  /**
   * 使用激活码激活订阅
   * @param {string} activationCode - 激活码
   * @returns {Promise<object>} 激活结果
   */
  async activateWithCode(activationCode) {
    const { verifyActivationCode } = require('./activation-code-generator');

    console.log('[Subscription] Verifying activation code...');

    // 验证激活码
    const codeData = verifyActivationCode(activationCode);

    if (!codeData) {
      throw new Error('激活码无效或已过期');
    }

    console.log('[Subscription] Activation code verified:', codeData);

    // 激活订阅
    await this.activateSubscription(codeData.months);

    return {
      success: true,
      months: codeData.months,
      expiryDate: this.subscription.expiryDate,
      message: `成功激活 ${codeData.months} 个月会员`
    };
  }

  /**
   * 重置订阅（用于测试）
   */
  resetSubscription() {
    if (fs.existsSync(this.subscriptionFile)) {
      fs.unlinkSync(this.subscriptionFile);
    }
    this.subscription = null;
    console.log('[Subscription] Reset complete');
  }

  /**
   * 调用API（占位符）
   */
  async callAPI(endpoint, data) {
    // TODO: 实现真实的API调用
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    console.log('[Subscription] API call:', url, data);

    // 模拟API响应
    return {
      success: true,
      data: {}
    };
  }
}

// 导出单例
const subscriptionManager = new SubscriptionManager();

module.exports = {
  SubscriptionManager,
  SubscriptionStatus,
  CONFIG,
  subscriptionManager
};
