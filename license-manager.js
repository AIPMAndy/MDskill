/**
 * MDskill 授权管理模块
 *
 * 负责授权码的验证、存储和状态管理
 */

const crypto = require('crypto');
const os = require('os');
const Store = require('electron-store');

const store = new Store();

// 公钥（用于验证授权码签名）
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5W0meVpPtjfuos38EPtg
2ffR8q2mwwHJcsq1ElWl0MWaQBQEm5nGn72HXmnqnY+r41SKLHwaYq3sn69/Hp81
/gaHHM9Y/kkjnJ/P9rfaRe28rP2CBY3jsrS177nggI5A9mk16NXt5EeWwmR7XcmO
luSXNPY2gaK4Srxg5Akrzb0bHEeobfgu7JaYB00Xq+UUYmXUgH4HhgbzBEs8Mvar
Ygvwrva5T24tweKXaqpVx/EUeTi6+JIO+y0aR0a8wtHYoffNohhOpR+CQGeCn0TO
L74E+ZFYA66b0zmlLx9Qh8T1l7cjfQ48oHc4CRVPPQSPYnkl0S2sBrlm+LS3uM7W
OwIDAQAB
-----END PUBLIC KEY-----`;

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
 * 验证授权码
 * @param {string} licenseKey - 授权码
 * @returns {Object} { valid: boolean, error?: string, data?: Object }
 */
function verifyLicense(licenseKey) {
  try {
    // 检查授权码格式
    if (!licenseKey || !licenseKey.startsWith('MDSK-')) {
      return { valid: false, error: '授权码格式错误' };
    }

    // 分割授权码
    const parts = licenseKey.split('-');
    if (parts.length !== 3) {
      return { valid: false, error: '授权码格式错误' };
    }

    const [prefix, encodedData, signature] = parts;

    // 解码数据
    const dataString = Buffer.from(encodedData, 'base64').toString('utf8');
    const licenseData = JSON.parse(dataString);

    // 验证签名
    const verify = crypto.createVerify('SHA256');
    verify.update(dataString);
    verify.end();

    const isValid = verify.verify(PUBLIC_KEY, signature, 'base64');

    if (!isValid) {
      return { valid: false, error: '授权码签名验证失败' };
    }

    // 验证设备指纹
    const currentDeviceId = generateDeviceFingerprint();
    if (licenseData.deviceId !== currentDeviceId) {
      return {
        valid: false,
        error: '此授权码不适用于当前设备',
        details: {
          expected: licenseData.deviceId,
          current: currentDeviceId
        }
      };
    }

    // 验证成功
    return {
      valid: true,
      data: licenseData
    };

  } catch (error) {
    return { valid: false, error: '授权码解析失败: ' + error.message };
  }
}

/**
 * 激活授权码
 * @param {string} licenseKey - 授权码
 * @returns {Object} { success: boolean, error?: string }
 */
function activateLicense(licenseKey) {
  const result = verifyLicense(licenseKey);

  if (!result.valid) {
    return { success: false, error: result.error };
  }

  // 保存授权信息
  store.set('license', {
    key: licenseKey,
    data: result.data,
    activatedAt: Date.now()
  });

  return { success: true };
}

/**
 * 检查是否已激活专业版
 * @returns {boolean}
 */
function isPro() {
  const license = store.get('license');

  if (!license || !license.key) {
    return false;
  }

  // 验证存储的授权码
  const result = verifyLicense(license.key);
  return result.valid;
}

/**
 * 获取授权信息
 * @returns {Object|null}
 */
function getLicenseInfo() {
  const license = store.get('license');

  if (!license) {
    return null;
  }

  return {
    userId: license.data?.userId,
    activatedAt: license.activatedAt,
    isPro: isPro()
  };
}

/**
 * 获取当前设备指纹（用于用户获取授权码）
 * @returns {string}
 */
function getDeviceFingerprint() {
  return generateDeviceFingerprint();
}

/**
 * 清除授权信息（用于测试或重置）
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
  clearLicense
};
