/**
 * MDskill 授权管理模块（服务端验证版本）
 */

const crypto = require('crypto');
const os = require('os');
const Store = require('electron-store');
const https = require('https');
const http = require('http');

const store = new Store();

// 配置
const CONFIG = {
  API_BASE_URL: 'http://124.222.208.117:3000',
  API_SECRET: '73b5eb4f89888c4637814ad108197981e7bcc88bdbb8724c0e34af1cad3dbc8f',
  OFFLINE_GRACE_DAYS: 5,
};

/**
 * 生成当前设备指纹
 */
function generateDeviceFingerprint() {
  const deviceInfo = {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus()[0].model,
    totalMemory: os.totalmem()
  };

  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(deviceInfo));
  return hash.digest('hex').substring(0, 16).toUpperCase();
}

/**
 * 获取设备详细信息
 */
function getDeviceInfo() {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    type: os.type(),
    release: os.release(),
  };
}

/**
 * HTTP 请求封装
 */
function apiRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, CONFIG.API_BASE_URL);
    const client = url.protocol === 'https:' ? https : http;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CONFIG.API_SECRET  // 统一使用小写
      },
      timeout: 10000
    };

    const req = client.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve(result);
        } catch (error) {
          reject(new Error('响应解析失败'));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * 在线激活授权码
 */
async function activateLicenseOnline(licenseKey) {
  try {
    const deviceId = generateDeviceFingerprint();
    const deviceInfo = getDeviceInfo();

    const result = await apiRequest('/activate', 'POST', {
      licenseKey,
      deviceId,
      deviceInfo
    });

    if (result.success) {
      store.set('license', {
        key: licenseKey,
        deviceId,
        activatedAt: Date.now(),
        lastVerified: Date.now()
      });

      return {
        success: true,
        errorCode: null,
        message: 'Activation successful'
      };
    } else {
      return {
        success: false,
        errorCode: result.code || 'invalidLicense',
        message: result.message || 'Activation failed'
      };
    }
  } catch (error) {
    console.error('Activation error:', error);
    return {
      success: false,
      errorCode: 'networkError',
      message: error.message || 'Network error'
    };
  }
}

/**
 * 验证授权状态（离线优先）
 */
async function verifyLicenseOnline(featureName = null) {
  try {
    const license = store.get('license');

    if (!license || !license.token) {
      return { valid: false, error: '未激活', needActivate: true };
    }

    const result = await apiRequest('/api/verify', 'POST', {
      token: license.token,
      featureName
    });

    if (result.success && result.data.valid) {
      license.lastVerifiedAt = Date.now();
      store.set('license', license);
      return { valid: true };
    } else {
      if (result.data?.needReactivate) {
        return {
          valid: false,
          error: '授权已失效',
          needReactivate: true
        };
      }
      return { valid: false, error: result.error };
    }

  } catch (error) {
    console.error('在线验证失败:', error);
    return { valid: false, error: '网络错误', offline: true };
  }
}

/**
 * 离线验证授权（容错机制）
 */
function verifyLicenseOffline() {
  const license = store.get('license');

  if (!license || !license.token) {
    return { valid: false, error: '未激活' };
  }

  const lastVerified = license.lastVerifiedAt || license.activatedAt;
  const daysSinceVerified = (Date.now() - lastVerified) / (1000 * 60 * 60 * 24);

  if (daysSinceVerified > CONFIG.OFFLINE_GRACE_DAYS) {
    return {
      valid: false,
      error: `离线时间超过 ${CONFIG.OFFLINE_GRACE_DAYS} 天，请联网验证`
    };
  }

  return { valid: true, offline: true };
}

/**
 * 检查是否为专业版（混合验证）
 */
async function isPro() {
  const onlineResult = await verifyLicenseOnline();

  if (onlineResult.valid) {
    return true;
  }

  if (onlineResult.offline) {
    const offlineResult = verifyLicenseOffline();
    return offlineResult.valid;
  }

  return false;
}

/**
 * 检查功能访问权限（关键功能强制在线验证）
 */
async function checkFeatureAccess(featureName) {
  const criticalFeatures = ['pdf_export', 'ai_format'];

  if (criticalFeatures.includes(featureName)) {
    const result = await verifyLicenseOnline(featureName);
    return result.valid;
  }

  return await isPro();
}

/**
 * 激活授权码（兼容旧接口）
 */
function activateLicense(licenseKey) {
  return activateLicenseOnline(licenseKey);
}

/**
 * 验证授权码（兼容旧接口）
 */
function verifyLicense(licenseKey) {
  return { valid: false, error: '请使用在线激活' };
}

/**
 * 获取设备指纹
 */
function getDeviceFingerprint() {
  return generateDeviceFingerprint();
}

/**
 * 获取授权信息
 */
function getLicenseInfo() {
  const license = store.get('license');

  if (!license) {
    return null;
  }

  return {
    userId: license.license?.userId,
    activatedAt: license.activatedAt,
    isPro: true
  };
}

/**
 * 清除授权信息
 */
function clearLicense() {
  store.delete('license');
}

module.exports = {
  verifyLicense,
  activateLicense,
  isPro,
  getLicenseInfo,
  getDeviceFingerprint,
  clearLicense,
  checkFeatureAccess,
};
