#!/usr/bin/env node

/**
 * MDskill 授权码生成工具
 * 使用方法: node generate-license.js <设备指纹> <月数>
 */

const generator = require('./activation-code-generator.js');

// 获取命令行参数
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('❌ 参数不足');
  console.log('');
  console.log('使用方法:');
  console.log('  node generate-license.js <设备指纹> <月数>');
  console.log('');
  console.log('示例:');
  console.log('  node generate-license.js "abc123def456" 12');
  console.log('');
  process.exit(1);
}

const deviceId = args[0];
const months = parseInt(args[1]);

if (isNaN(months) || months <= 0) {
  console.log('❌ 月数必须是正整数');
  process.exit(1);
}

// 生成授权码
const activationCode = generator.generateActivationCode(deviceId, months);

console.log('');
console.log('✅ 授权码生成成功！');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('设备指纹:', deviceId);
console.log('有效期:', months, '个月');
console.log('到期日期:', new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN'));
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('授权码:');
console.log(activationCode);
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('💡 请将授权码发送给用户');
console.log('💡 用户在应用中选择"帮助" -> "激活专业版"输入授权码');
console.log('');
