// 在开发者工具的 Console 中运行这个脚本来诊断主题卡片

console.log('=== 主题卡片诊断 ===');

// 1. 检查 theme-preview-modal 是否存在
const modal = document.getElementById('theme-preview-modal');
console.log('1. Modal 元素:', modal);

if (modal) {
  // 2. 打开主题选择器
  console.log('2. 尝试打开主题选择器...');
  if (window.themePreview && window.themePreview.openThemePreview) {
    window.themePreview.openThemePreview('github-dark');
    console.log('   ✓ 主题选择器已打开');
  } else {
    console.error('   ✗ window.themePreview.openThemePreview 不存在');
  }

  // 3. 等待渲染完成后检查主题卡片
  setTimeout(() => {
    const cards = modal.querySelectorAll('.theme-card');
    console.log(`3. 找到 ${cards.length} 个主题卡片`);

    cards.forEach((card, index) => {
      const themeId = card.dataset.themeId;
      const themeName = card.querySelector('.theme-name-text')?.textContent;
      const proBadge = card.querySelector('.pro-badge');
      const lockIcon = card.textContent.includes('🔒');

      console.log(`   卡片 ${index + 1}:`, {
        id: themeId,
        name: themeName,
        hasProBadge: !!proBadge,
        hasLockIcon: lockIcon,
        innerHTML: card.innerHTML.substring(0, 200) + '...'
      });

      // 如果有锁图标，找出它在哪里
      if (lockIcon) {
        console.warn(`   ⚠️ 卡片 "${themeName}" 包含锁图标！`);
        console.warn('   完整 HTML:', card.innerHTML);
      }
    });
  }, 500);
}
