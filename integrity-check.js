/**
 * 授权完整性检查模块
 * 防止授权系统被篡改
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 关键文件的哈希值（构建时生成）
let INTEGRITY_HASHES = {
  "license-manager.js": "d73958044a09ca5f3ce0cf3c0552dab1e14631e0af17dce2fa0699b44d49afc8",
  "activation-code-generator.js": "3c11f7647e17ec20313279a328342c804cc0bb235776803e6dea662a0274ed29",
  "subscription-manager.js": "24fdfffa5853fb19bddaa0df899d39dfa6032513d08b08752d94718cec1ad214"
};

/**
 * 计算文件哈希
 */
function calculateFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return crypto.createHash('sha256').update(content).digest('hex');
  } catch (error) {
    return null;
  }
}

/**
 * 验证关键文件完整性
 */
function verifyIntegrity() {
  const criticalFiles = [
    'license-manager.js',
    'subscription-manager.js'
  ];

  for (const file of criticalFiles) {
    const filePath = path.join(__dirname, file);
    const currentHash = calculateFileHash(filePath);
    const expectedHash = INTEGRITY_HASHES[file];

    if (expectedHash && currentHash !== expectedHash) {
      // 文件被篡改
      return false;
    }
  }

  return true;
}

/**
 * 生成完整性哈希（构建时调用）
 */
function generateIntegrityHashes() {
  const criticalFiles = [
    'license-manager.js',
    'subscription-manager.js'
  ];

  const hashes = {};
  for (const file of criticalFiles) {
    const filePath = path.join(__dirname, file);
    const hash = calculateFileHash(filePath);
    if (hash) {
      hashes[file] = hash;
    }
  }

  return hashes;
}

/**
 * 设置完整性哈希
 */
function setIntegrityHashes(hashes) {
  INTEGRITY_HASHES = hashes;
}

/**
 * 反调试检测
 */
function detectDebugger() {
  const start = Date.now();
  debugger;
  const end = Date.now();

  // 如果执行时间过长，说明可能在调试
  return (end - start) > 100;
}

/**
 * 环境检测
 */
function detectTampering() {
  // 检查是否在开发者工具中
  const devtools = /./;
  devtools.toString = function() {
    this.opened = true;
  };

  console.log('%c', devtools);

  return devtools.opened;
}

module.exports = {
  verifyIntegrity,
  generateIntegrityHashes,
  setIntegrityHashes,
  detectDebugger,
  detectTampering
};
