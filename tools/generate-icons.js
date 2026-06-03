const fs = require('fs');
const { createCanvas } = require('canvas');

// 创建图标
function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const scale = size / 1024;

  // 背景渐变
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#667eea');
  bgGrad.addColorStop(0.5, '#764ba2');
  bgGrad.addColorStop(1, '#f093fb');

  // 圆角矩形背景
  const radius = size * 0.18;
  ctx.fillStyle = bgGrad;
  roundRect(ctx, 0, 0, size, size, radius);
  ctx.fill();

  // 主渐变
  const mainGrad = ctx.createLinearGradient(0, 0, size, size);
  mainGrad.addColorStop(0, '#ffffff');
  mainGrad.addColorStop(1, '#f0f0f0');

  // 辅助渐变
  const accentGrad = ctx.createLinearGradient(0, 0, size, size);
  accentGrad.addColorStop(0, '#ffffff');
  accentGrad.addColorStop(1, '#ffd6e8');

  // 设置发光效果
  ctx.shadowBlur = 20 * scale;
  ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';

  // 绘制 M
  ctx.strokeStyle = mainGrad;
  ctx.lineWidth = 56 * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(220 * scale, 640 * scale);
  ctx.lineTo(220 * scale, 360 * scale);
  ctx.lineTo(340 * scale, 520 * scale);
  ctx.lineTo(460 * scale, 360 * scale);
  ctx.lineTo(460 * scale, 640 * scale);
  ctx.stroke();

  // 绘制 D
  ctx.strokeStyle = accentGrad;

  ctx.beginPath();
  ctx.moveTo(540 * scale, 360 * scale);
  ctx.lineTo(540 * scale, 640 * scale);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(540 * scale, 360 * scale);
  ctx.quadraticCurveTo(740 * scale, 360 * scale, 740 * scale, 500 * scale);
  ctx.quadraticCurveTo(740 * scale, 640 * scale, 540 * scale, 640 * scale);
  ctx.stroke();

  // Markdown # 符号
  ctx.shadowBlur = 10 * scale;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = `bold ${80 * scale}px "SF Mono", Monaco, monospace`;
  ctx.fillText('#', 820 * scale, 240 * scale);

  // 装饰点
  ctx.shadowBlur = 15 * scale;
  const dots = [
    {x: 340, y: 260, color: 'rgba(255, 255, 255, 0.6)'},
    {x: 660, y: 260, color: 'rgba(255, 255, 255, 0.5)'},
    {x: 340, y: 740, color: 'rgba(255, 255, 255, 0.6)'},
    {x: 660, y: 740, color: 'rgba(255, 255, 255, 0.5)'}
  ];

  dots.forEach(dot => {
    ctx.fillStyle = dot.color;
    ctx.shadowColor = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x * scale, dot.y * scale, 12 * scale, 0, Math.PI * 2);
    ctx.fill();
  });

  return canvas;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// 生成所需尺寸
const sizes = [1024, 512, 256, 128];

sizes.forEach(size => {
  const canvas = createIcon(size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`assets/icon-${size}.png`, buffer);
  console.log(`Generated icon-${size}.png`);
});

console.log('All icons generated successfully!');
