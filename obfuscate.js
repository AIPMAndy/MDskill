#!/usr/bin/env node

/**
 * 代码混淆脚本
 * 用于保护授权相关的关键代码
 */

const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// 需要混淆的文件列表
const filesToObfuscate = [
  'license-manager.js',
  'activation-code-generator.js',
  'subscription-manager.js'
];

// 混淆配置（高强度）
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: 4000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 5,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['rc4'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 5,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 5,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 1,
  transformObjectKeys: true,
  unicodeEscapeSequence: false
};

console.log('🔒 开始混淆关键代码...\n');

filesToObfuscate.forEach(filename => {
  const filePath = path.join(__dirname, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  跳过: ${filename} (文件不存在)`);
    return;
  }

  try {
    // 读取原始代码
    const sourceCode = fs.readFileSync(filePath, 'utf8');

    // 备份原始文件
    const backupPath = filePath + '.original';
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, sourceCode);
      console.log(`📦 备份: ${filename}.original`);
    }

    // 混淆代码
    const obfuscationResult = JavaScriptObfuscator.obfuscate(sourceCode, obfuscationOptions);

    // 写入混淆后的代码
    fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode());

    console.log(`✅ 混淆完成: ${filename}`);

  } catch (error) {
    console.error(`❌ 混淆失败: ${filename}`, error.message);
  }
});

console.log('\n🎉 代码混淆完成！');
console.log('💡 原始文件已备份为 .original 后缀');
