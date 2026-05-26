#!/usr/bin/env node

/**
 * 安全构建脚本
 * 1. 混淆关键代码
 * 2. 生成完整性哈希
 * 3. 打包应用
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

console.log('🔐 MDskill 安全构建流程\n');

// 步骤1：备份原始文件
console.log('📦 步骤1: 备份原始文件...');
const filesToProtect = [
  'license-manager.js',
  'activation-code-generator.js',
  'subscription-manager.js'
];

const backupDir = path.join(__dirname, '.backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

filesToProtect.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(backupDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  ✓ 备份: ${file}`);
  }
});

// 步骤2：混淆代码
console.log('\n🔒 步骤2: 混淆关键代码...');
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: 4000,
  disableConsoleOutput: false,
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
  stringArrayThreshold: 1,
  transformObjectKeys: true,
  unicodeEscapeSequence: false
};

filesToProtect.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      const sourceCode = fs.readFileSync(filePath, 'utf8');
      const obfuscated = JavaScriptObfuscator.obfuscate(sourceCode, obfuscationOptions);
      fs.writeFileSync(filePath, obfuscated.getObfuscatedCode());
      console.log(`  ✓ 混淆: ${file}`);
    } catch (error) {
      console.error(`  ✗ 失败: ${file} - ${error.message}`);
    }
  }
});

// 步骤3：生成完整性哈希
console.log('\n🔑 步骤3: 生成完整性哈希...');
const crypto = require('crypto');
const hashes = {};

filesToProtect.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    hashes[file] = hash;
    console.log(`  ✓ ${file}: ${hash.substring(0, 16)}...`);
  }
});

// 将哈希写入完整性检查文件
const integrityCheckPath = path.join(__dirname, 'integrity-check.js');
let integrityCode = fs.readFileSync(integrityCheckPath, 'utf8');
integrityCode = integrityCode.replace(
  'let INTEGRITY_HASHES = {};',
  `let INTEGRITY_HASHES = ${JSON.stringify(hashes, null, 2)};`
);
fs.writeFileSync(integrityCheckPath, integrityCode);
console.log('  ✓ 完整性哈希已写入');

// 步骤4：打包应用
console.log('\n📦 步骤4: 打包应用...');
try {
  execSync('npm run build:mac', { stdio: 'inherit' });
  console.log('\n✅ 构建完成！');
} catch (error) {
  console.error('\n❌ 构建失败:', error.message);
  process.exit(1);
}

// 步骤5：恢复原始文件
console.log('\n♻️  步骤5: 恢复原始文件...');
filesToProtect.forEach(file => {
  const src = path.join(backupDir, file);
  const dest = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  ✓ 恢复: ${file}`);
  }
});

console.log('\n🎉 安全构建流程完成！');
console.log('💡 混淆后的代码已打包到 dist/ 目录');
console.log('💡 开发环境的代码已恢复为原始版本');
