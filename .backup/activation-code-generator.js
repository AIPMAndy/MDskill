const crypto = require('crypto');

// 密钥（保密！生产环境请更改）
const SECRET_KEY = 'MDSKILL-2026-SECRET-KEY-CHANGE-IN-PRODUCTION';

/**
 * 生成激活码
 * @param {string} userId - 用户ID
 * @param {number} months - 月数
 * @returns {string} 激活码
 */
function generateActivationCode(userId, months) {
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + months);

  const data = {
    userId,
    months,
    expiryDate: expiryDate.toISOString(),
    timestamp: Date.now()
  };

  const payload = JSON.stringify(data);

  // 生成签名
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payload)
    .digest('hex')
    .substring(0, 16);

  // 组合激活码：Base64编码的数据 + 签名
  const code = Buffer.from(payload).toString('base64') + '-' + signature;

  // 格式化（不转换大小写，因为 base64 是大小写敏感的）
  return formatActivationCode(code);
}

/**
 * 格式化激活码（每4个字符一组）
 * @param {string} code - 原始激活码（格式：base64-signature）
 * @returns {string} 格式化后的激活码
 */
function formatActivationCode(code) {
  // 分离 base64 和签名
  const parts = code.split('-');
  const base64Part = parts[0];
  const signaturePart = parts[1];

  // 只格式化 base64 部分（每4个字符一组）
  const formattedBase64 = base64Part.match(/.{1,4}/g).join('-');

  // 格式化签名部分（每4个字符一组）
  const formattedSignature = signaturePart.match(/.{1,4}/g).join('-');

  // 用 | 分隔 base64 和签名，便于验证时分离
  return formattedBase64 + '|' + formattedSignature;
}

/**
 * 验证激活码
 * @param {string} code - 激活码
 * @returns {object|null} 激活信息或null
 */
function verifyActivationCode(code) {
  try {
    // 分离 base64 和签名部分（用 | 分隔）
    const parts = code.split('|');
    if (parts.length !== 2) {
      console.error('[ActivationCode] Invalid code format');
      return null;
    }

    // 移除分隔符
    const payloadBase64 = parts[0].replace(/[-\s]/g, '');
    const signature = parts[1].replace(/[-\s]/g, '').toLowerCase();

    // 解码payload
    const payload = Buffer.from(payloadBase64, 'base64').toString('utf8');

    // 验证签名
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payload)
      .digest('hex')
      .substring(0, 16);

    if (signature !== expectedSignature) {
      console.error('[ActivationCode] Invalid signature');
      return null;
    }

    // 解析数据
    const data = JSON.parse(payload);

    // 验证数据完整性
    if (!data.userId || !data.months || !data.expiryDate) {
      console.error('[ActivationCode] Invalid data structure');
      return null;
    }

    return data;
  } catch (error) {
    console.error('[ActivationCode] Verification error:', error);
    return null;
  }
}

/**
 * 生成批量激活码
 * @param {number} count - 数量
 * @param {number} months - 月数
 * @returns {Array} 激活码数组
 */
function generateBatchCodes(count, months) {
  const codes = [];

  for (let i = 0; i < count; i++) {
    const userId = `BATCH_${Date.now()}_${i}`;
    const code = generateActivationCode(userId, months);
    codes.push({
      code,
      userId,
      months,
      createdAt: new Date().toISOString()
    });
  }

  return codes;
}

module.exports = {
  generateActivationCode,
  verifyActivationCode,
  generateBatchCodes
};
